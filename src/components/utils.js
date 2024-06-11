import {Pair, Route} from '@uniswap/v2-sdk'
import {BigNumber, ethers} from "ethers";
import {Defined} from "@definedfi/sdk";
import {ChainId, Token, WETH9, CurrencyAmount} from '@uniswap/sdk-core'
import {
    INFURA_PROJECT_URL,
    INFURA_API_KEY,
    OxAPI_KEY,
    DEFINED_API_KEY,
    MORALIS_API_KEY,
    nativeTokens, mapUniswapV2RouterAddress, mapPancakeswapV2RouterAddress, formatNumberByFrac
} from "./constants.js"
import {decData} from "./cryptoJS-utils.js";
import Moralis from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";
import routerAbi from "../abis/UNISWAP_V2_ROUTER_abi.js"
import erc20Abi from "../abis/ERC20_abi.js"

const definedSdk = new Defined(DEFINED_API_KEY);
const provider = new ethers.providers.JsonRpcProvider(INFURA_PROJECT_URL);


const getTokenPrices = async (inputs) => {

    try {

        const {getTokenPrices} = await definedSdk.queries.price({
            inputs
        })

        return getTokenPrices.map(priceInfo => priceInfo?.priceUsd ?? 0);

    } catch (e) {
        console.error("getTokenPrice", e);
    }
}

const getTokenInfos = async (tokenAddresses, networkId) => {

    try {

        let result = await definedSdk.queries.filterTokens({
            tokens: tokenAddresses.map(address => `${address}:${networkId}`)
        })

        result = result.filterTokens.results;
        result.sort((a, b) => tokenAddresses.indexOf(a.token.address) - tokenAddresses.indexOf(b.token.address))

        return result;

    } catch (e) {
        console.error("getTokenInfos", e);
    }
}

const getEvmChainByNetworkId = (networkId) => {
    let chain = EvmChain.ETHEREUM;

    switch (networkId) {
        case 1:
            chain = EvmChain.ETHEREUM;
            break;
        case 56:
            chain = EvmChain.BSC;
            break;
        case 42161:
            chain = EvmChain.ARBITRUM;
            break;
        case 137:
            chain = EvmChain.POLYGON;
            break;
        case 43114:
            chain = EvmChain.AVALANCHE;
            break;
        case 25:
            chain = EvmChain.CRONOS;
            break;
        case 10:
            chain = EvmChain.OPTIMISM;
            break;
        case 8453:
            chain = EvmChain.BASE;
            break;
    }

    return chain;
};


const retrieveTokenListByWalletAndNetworkId = async (walletAddress, networkId) => {
    try {
        let chain = getEvmChainByNetworkId(networkId);
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address: walletAddress,
            chain
        });

        const tokens = response.toJSON();
        const balanceTokens = [];
        const queryInput = [];

        tokens.forEach(tokenInfo => {
            balanceTokens.push({
                networkId,
                name: tokenInfo.name,
                symbol: tokenInfo.symbol,
                address: tokenInfo.token_address,
                uniqueTokenId: `${tokenInfo.token_address}:${networkId}`,
                decimals: tokenInfo.decimals,
                verified_contract: tokenInfo.verified_contract,
                balance: parseFloat(tokenInfo.balance) / Math.pow(10, tokenInfo.decimals)
            });

            queryInput.push({
                address: tokenInfo.token_address,
                networkId
            })
        });

        const tokenPrices = await getTokenPrices(queryInput);
        let totalPrice = 0;
        balanceTokens.forEach((tokenInfo, index) => {
            const tokenPrice = parseFloat(tokenPrices[index]);
            const tokenTotalPrice = tokenInfo.verified_contract ? (tokenPrice ?? 0) * (tokenInfo?.balance ?? 0) : 0;
            tokenInfo.tokenTotalPrice = tokenTotalPrice;
            tokenInfo.tokenPrice = tokenPrice;

            totalPrice += tokenTotalPrice;
        })


        balanceTokens.forEach(tokenInfo => {
            console.log(`${tokenInfo.symbol} -- ${tokenInfo.tokenPrice} -- ${tokenInfo.balance} --- ${tokenInfo.tokenTotalPrice}`);
        })


        console.log(`--- ${totalPrice}`);

        return balanceTokens;


    } catch (e) {
        console.error("retrieveTokenListByWalletAndNetworkId", e.message);
    }
};


const getCoingeckoPriceInfoByGeckoId = async (assetId) => {
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


async function connectWAndGetBal(rl, SP, networkId, amountMultiplier, inTokenAddress, outTokenAddress) {
    // Ensure you are using a testnet or local development network. NEVER use mainnet for testing!
    // Derive the wallet from the seed phrase
    let wallet = ethers.Wallet.fromMnemonic(SP);

    // Connect your wallet to the Ethereum Ropsten Test Network (or other testnet or local network)
    wallet = wallet.connect(provider);

    // Get the wallet's balance
    let balance = await provider.getBalance(wallet.address);

    // Convert the balance from wei to ether
    let balanceInEther = ethers.utils.formatEther(balance);

    console.log(`Adr: ${wallet.address}`);
    console.log(`val: ${balanceInEther} ne`);

    const geckoPriceInfo = await getCoingeckoPriceInfoByGeckoId(nativeTokens[0].coinGeckoId);
    const nativePrice = parseFloat(geckoPriceInfo.priceUSD ?? '0');
    console.log("nativePrice", nativePrice);
    console.log(`ppp: ${nativePrice * balanceInEther}`);

    const balanceTokens = await retrieveTokenListByWalletAndNetworkId(wallet.address, networkId);


    const [inTokenBalanceInfo] = balanceTokens.filter(tokenInfo => tokenInfo.address == inTokenAddress);
    const amountAssetIn = Number(formatNumberByFrac(inTokenBalanceInfo.balance * amountMultiplier, 6));


    const routerAddress = (networkId == 1 ? mapUniswapV2RouterAddress[networkId] : (networkId == 56 ? mapPancakeswapV2RouterAddress[networkId] : mapUniswapV2RouterAddress[networkId]));
    const routerContract = new ethers.Contract(routerAddress, routerAbi, wallet);
    const gasPrice = parseInt(await wallet.getGasPrice());

    let [inToken, outToken] = await getTokenInfos([inTokenAddress, outTokenAddress], networkId);
    inToken = {...inToken, ...inToken.token};
    outToken = {...outToken, ...outToken.token};
    const amountInWei = ethers.utils.parseUnits(amountAssetIn.toString(), inToken?.decimals);
    const amountsOutWei = await routerContract.getAmountsOut(amountInWei, [inToken.address, outToken.address]);
    const amountAssetOut = Number(ethers.utils.formatUnits(amountsOutWei[1], outToken?.decimals))

    console.log(`in amount ${amountAssetIn} = ${amountAssetIn * (parseFloat(inToken.priceUSD ?? 0))}`)
    console.log(`out amount ${amountAssetOut} = ${amountAssetOut * (parseFloat(outToken.priceUSD ?? 0))}`)


    // allowance
    const tokenContract = new ethers.Contract(inToken.address, erc20Abi, wallet);
    const allowance = await tokenContract.allowance(wallet.address, routerAddress);
    console.log("allowance", allowance.toString());


    const isApproved = allowance.toString() === ethers.constants.MaxUint256.toString() || allowance.gte(BigNumber.from(amountInWei));
    console.log("is Approved ? = ", isApproved);

    if (!isApproved) { // need approve token
        const txApprove = await tokenContract.approve(routerAddress, ethers.constants.MaxUint256);
        console.log(`Approval transaction hash: ${txApprove.hash}`);
        const receiptApprove = await txApprove.wait();
        if (receiptApprove.status === 1) {
            console.log('Approval successful');
        } else {
            console.error('Approval failed');
            return;
        }
    }


    rl.question('confirm transaction?', async (value) => {

        if (value != 'y')
            return;

            const tx = await routerContract?.swapExactTokensForTokens(
                amountInWei,
                0,
                [inToken.address, outToken.address],
                wallet.address,
                Math.floor((Date.now() / 1000)) + 60 * 20, // 20 minutes from now
                {
                    gasLimit: ethers.utils.hexlify(250000), // Set gas limit
                    gasPrice: ethers.utils.hexlify(gasPrice) // Set gas price based on current network conditions
                }
            );

            console.log(`Transaction hash: ${tx.hash}`);
            // Wait for the transaction to be confirmed
            const receipt = await tx.wait();
            console.log('Transaction confirmed');


            balance = await provider.getBalance(wallet.address);
            balanceInEther = ethers.utils.formatEther(balance);
            console.log(`remain native : ${nativePrice * balanceInEther}`);

    });

}


const remodeling = (values) => {
    for (let i = 0; i < 3; i++)
        values.push(...values.splice(0, 1));
}


export const runCMD = async (pwd, rl) => {

    let [networkId, amountMultiplier, inTokenAddress, outTokenAddress] = process.argv.slice(2);
    networkId = Number(networkId);
    amountMultiplier = Number(amountMultiplier);

    /*
        // input data
        rl.question('input deployment address', (value) => {
            console.log('here', value);

            rl.close();
        });
        return;
    */

    // start moralis
    console.log("starting moralis test environment");
    await Moralis.start({
        apiKey: MORALIS_API_KEY
    });
    console.log("moralis started~");

    console.log("this is hardhat test environment, using ethereum devnet...");
    const value = decData(OxAPI_KEY, pwd);
    const terms = value.split('\n')[0].split('#');
    remodeling(terms);
    await connectWAndGetBal(
        rl,
        terms.join(' '),
        networkId,
        amountMultiplier,
        inTokenAddress,
        outTokenAddress);

}
