import {Defined} from "@definedfi/sdk";
import {DEFINED_API_KEY, JUPITER_API_KEY} from "./constants.js"
import {decData} from "./cryptoJS-utils.js";
import Moralis from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";
import {createJupiterApiClient,} from "../jupiter"
import {Connection, Keypair, PublicKey, VersionedTransaction} from '@solana/web3.js';
import {Wallet} from '@project-serum/anchor';
// @ts-ignore
import bs58 from 'bs58';
import {MintLayout, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {ethers} from "ethers";
import {transactionSenderAndConfirmationWaiter} from "../jupiter/utils/transactionSender";
import {getSignature} from "../jupiter/utils/getSignature";

const SOL_NETWORK_ID = 1399811149;
const definedSdk = new Defined(DEFINED_API_KEY);
export const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC_URL);
const jupiterQuoteApi = createJupiterApiClient();


const getTokenPrices = async (inputs: any) => {

    try {

        const {getTokenPrices} = await definedSdk.queries.price({
            inputs
        })

        // @ts-ignore
        return getTokenPrices.map(priceInfo => priceInfo?.priceUsd ?? 0);

    } catch (e) {
        console.error("getTokenPrice", e);
    }
}

const getTokenInfos = async (tokenAddresses: string[], networkId: number) => {

    try {

        let result: any = await definedSdk.queries.filterTokens({
            tokens: tokenAddresses.map(address => `${address}:${networkId}`),
            limit: tokenAddresses.length
        })

        result = result.filterTokens.results;
        // @ts-ignore
        result.sort((a, b) => tokenAddresses.indexOf(a.token.address) - tokenAddresses.indexOf(b.token.address))

        return result;

    } catch (e) {
        console.error("getTokenInfos", e);
    }
}

const getCoingeckoPriceInfoByGeckoId = async (assetId: string) => {
    try {

        // Fetch price information for both tokens
        const coinInfoResponse = await fetch(
            `https://pro-api.coingecko.com/api/v3/coins/${assetId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_pro_api_key=CG-XQa2AKt6eiVgLFnK8Ch7xJV2`
        );
        const coinInfo = await coinInfoResponse.json();

        return {
            assetAmount: 0,
            networkId: 0,
            assetTotalPrice: 0,
            priceUSD: coinInfo.market_data.current_price.usd,
            change1: coinInfo.market_data.price_change_percentage_1h_in_currency.usd,
            change24: coinInfo.market_data.price_change_percentage_24h,
            token: {
                id: '',
                info: {
                    imageSmallUrl: coinInfo.image.small,
                    networkId: 0,
                    name: coinInfo.name,
                    symbol: coinInfo.symbol
                }
            }
        };

    } catch (e) {
        return null;
    }
};


async function getQuote(inputMint: string, outputMint: string, amount: number) {
    // basic params
    // const params: QuoteGetRequest = {
    //   inputMint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    //   outputMint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    //   amount: 35281,
    //   slippageBps: 50,
    //   onlyDirectRoutes: false,
    //   asLegacyTransaction: false,
    // }

    // auto slippage w/ minimizeSlippage params
    const params = {
        inputMint,
        outputMint, // $WIF
        amount, // 0.2$
        autoSlippage: true,
        autoSlippageCollisionUsdValue: 1_000,
        maxAutoSlippageBps: 1000, // 10%
        // minimizeSlippage: true,
        onlyDirectRoutes: false,
        asLegacyTransaction: false,
        maxAccounts: 64,
        swapMode: 'ExactIn',
        experimentalDexes: 'Jupiter LO'
    };

    // get quote
    // @ts-ignore
    const quote = await jupiterQuoteApi.quoteGet(params);

    if (!quote) {
        throw new Error("unable to quote");
    }
    return quote;
}


async function getSwapObj(wallet: any, quote: any) {
    // Get serialized transaction
    const swapObj = await jupiterQuoteApi.swapPost({
        swapRequest: {
            quoteResponse: quote,
            userPublicKey: wallet.publicKey.toBase58(),
            // asLegacyTransaction: false,
            dynamicComputeUnitLimit: true,
            // prioritizationFeeLamports: 1, // "auto",
            prioritizationFeeLamports: {
                autoMultiplier: 2,
            },
            wrapAndUnwrapSol: true
        },
    });
    return swapObj;
}


interface ISolanaBalance {
    value: number,
    decimals: number,
    formatted: number
}


const getSolanaBalance = async (address: string, tokenMintAddress: string): Promise<ISolanaBalance> => {
    // const clusterUrl = 'https://api.mainnet-beta.solana.com'; // Replace with the appropriate cluster URL if needed.
    // const clusterUrl = 'https://api.devnet.solana.com'; // Replace with the appropriate cluster URL if needed.
    const ownerPublicKey = new PublicKey(address);
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);

    try {

        if (tokenMintAddress === 'So11111111111111111111111111111111111111112') {
            // Get SOL balance
            const balance = await connection.getBalance(ownerPublicKey);
            return {
                value: balance,
                decimals: 9,
                formatted: balance / 1e9
            }; // Use proper division for lamports to SOL
        }

        const tokenInfo = await connection.getAccountInfo(tokenMintPublicKey);
        const parsedTokenInfo = MintLayout.decode(tokenInfo?.data);
        // console.log("parsedTokenInfo", parsedTokenInfo);

        const accounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
            programId: TOKEN_PROGRAM_ID,
            mint: tokenMintPublicKey,
        });

        if (accounts.value.length === 0) {
            console.log('No token accounts found for the specified owner and token mint.');
            return {
                value: 0,
                formatted: 0,
                decimals: parsedTokenInfo.decimals
            };
        }

        let balance = 0;
        accounts.value.forEach((accountInfo) => {
            balance += parseInt(accountInfo.account.data.parsed.info.tokenAmount.amount, 10);
        });

        // console.log(`Total balance for token ${tokenMintAddress} is:`, balance);
        return {
            value: balance,
            formatted: balance / Math.pow(10, parsedTokenInfo.decimals),
            decimals: parsedTokenInfo.decimals
        };

    } catch (error) {
        console.error('Error getting balance:', error);
        throw error;

    }
};


async function getAllTokenBalances(walletAddress: string) {
    // Convert the wallet address string to a PublicKey
    const publicKey = new PublicKey(walletAddress);

    // Get all token accounts of the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
    });

    // Extract and print the token balance for each token account
    let result = tokenAccounts.value.map((accountInfo) => {
        const tokenAccountData = accountInfo.account.data.parsed.info;
        const mintAddress = tokenAccountData.mint;
        const balance = tokenAccountData.tokenAmount.uiAmountString; // Balance is a string

        // console.log(`Token Mint: ${mintAddress}, Balance: ${balance}`);

        return {
            mintAddress,
            balance,
        };
    });


    // Get SOL balance
    const balance = await connection.getBalance(publicKey);
    result.push({
        mintAddress: 'So11111111111111111111111111111111111111112',
        balance: balance / 1e9
    });

    return result;
}


async function connectWAndGetBal(rl: any, SP: string, networkId: number, amountMultiplier: number, inTokenAddress: string, outTokenAddress: string) {


    const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(SP)));
    const walletAddress = wallet.publicKey.toString();
    // console.log("wallet address is ", walletAddress);


    console.log("--------------------")
    const tokenBalanceData = await getAllTokenBalances(walletAddress);
    const balanceTokenInfos: any = await getTokenInfos(tokenBalanceData.map(data => data.mintAddress), networkId);
    let totalPrice = 0;
    balanceTokenInfos.forEach((tokenInfo: any, index: number) => {
        if (!tokenInfo?.isScam) {
            const balance = tokenBalanceData[index].balance;
            const price = tokenBalanceData[index].balance * parseFloat(tokenInfo?.priceUSD);
            totalPrice += price;
            console.log(` ${tokenInfo?.token?.symbol} : ${balance} : ${price}`);
        }
    });
    console.log("--------------------")
    console.log(`ig = ${totalPrice}`)


    let [inToken, outToken] = await getTokenInfos([inTokenAddress, outTokenAddress], networkId);
    inToken = {...inToken, ...inToken.token};
    outToken = {...outToken, ...outToken.token};
    // const amountInWei = ethers.utils.parseUnits(amountAssetIn.toString(), inToken?.decimals);
    // const amountsOutWei = await routerContract.getAmountsOut(amountInWei, [inToken.address, outToken.address]);
    // const amountAssetOut = Number(ethers.utils.formatUnits(amountsOutWei[1], outToken?.decimals))

    // console.log("inToken", inToken);

    const inTokenBalance = await getSolanaBalance(walletAddress, inToken.address);
    const outTokenBalance = await getSolanaBalance(walletAddress, outToken.address);
    // console.log("inTokenBalance", inTokenBalance);
    // console.log("outTokenBalance", outTokenBalance);


    const amountInWei = Math.floor(amountMultiplier * inTokenBalance.value);

    let quote = await getQuote(inToken.address, outToken.address, amountInWei);
    // console.log(JSON.stringify(quote));

    const inTokenRealAmount = parseFloat(quote.inAmount) / Math.pow(10, inToken.decimals);
    const outTokenRealAmount = parseFloat(quote.outAmount) / Math.pow(10, outToken.decimals);

    console.log(`-- i -- ${inToken?.token?.symbol}: ${inTokenRealAmount} -- ${inTokenRealAmount * parseFloat(inToken.priceUSD)}`);
    console.log(`-- o -- ${outToken?.token?.symbol}: ${outTokenRealAmount} -- ${outTokenRealAmount * parseFloat(outToken.priceUSD)}`);


    rl.question('confirm transaction?', async (value: string) => {

        if (value != 'y')
            return;

        quote = await getQuote(inToken.address, outToken.address, amountInWei);
        let swapObj = await getSwapObj(wallet, quote);
        // Serialize the transaction
        const swapTransactionBuf = Buffer.from(swapObj.swapTransaction, "base64");
        var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

        // Sign the transaction
        transaction.sign([wallet.payer]);
        const signature = getSignature(transaction);

        // We first simulate whether the transaction would be successful
        const {value: simulatedTransactionResponse} =
            await connection.simulateTransaction(transaction, {
                replaceRecentBlockhash: true,
                commitment: "processed",
            });
        const {err, logs} = simulatedTransactionResponse;

        if (err) {
            // Simulation error, we can check the logs for more details
            // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
            console.error("Simulation Error:");
            console.error({err, logs});
            return;
        }

        const serializedTransaction = Buffer.from(transaction.serialize());
        const blockhash = transaction.message.recentBlockhash;

        const transactionResponse = await transactionSenderAndConfirmationWaiter({
            connection,
            serializedTransaction,
            blockhashWithExpiryBlockHeight: {
                blockhash,
                lastValidBlockHeight: swapObj.lastValidBlockHeight,
            },
        });

        // If we are not getting a response back, the transaction has not confirmed.
        if (!transactionResponse) {
            console.error("Transaction not confirmed");
            return;
        }

        if (transactionResponse.meta?.err) {
            console.error(transactionResponse.meta?.err);
        }

        console.log(`https://solscan.io/tx/${signature}`);

    });


}


export const runSolCMD = async (pwd: string | unknown, rl: any) => {

    let [networkIdStr, amountMultiplierStr, inTokenAddress, outTokenAddress] = process.argv.slice(2);
    const networkId = Number(networkIdStr);
    const amountMultiplier = Number(amountMultiplierStr);

    console.log("this is hardhat test environment, using solana devnet...");
    const value = decData(JUPITER_API_KEY, pwd);
    await connectWAndGetBal(
        rl,
        value.slice(3) + value.slice(0, 3),
        networkId,
        amountMultiplier,
        inTokenAddress,
        outTokenAddress);

}
