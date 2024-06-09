import {Pair, Route} from '@uniswap/v2-sdk'
import {ethers} from "ethers";
import {Defined} from "@definedfi/sdk";
import {ChainId, Token, WETH9, CurrencyAmount} from '@uniswap/sdk-core'
import {
    INFURA_PROJECT_URL,
    INFURA_API_KEY,
    OxAPI_KEY,
    DEFINED_API_KEY,
    MORALIS_API_KEY,
    nativeTokens
} from "./constants.js"
import {decData} from "./cryptoJS-utils.js";
import Moralis from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";

const definedSdk = new Defined(DEFINED_API_KEY);
const provider = new ethers.providers.JsonRpcProvider(INFURA_PROJECT_URL);


const getTokenPrices = async (inputs) => {

    try {

        const {getTokenPrices} = await definedSdk.queries.price({
            inputs
        })

        return getTokenPrices.map(priceInfo => priceInfo?.priceUsd ?? 0);

    } catch(e) {
        console.error("getTokenPrice", e);
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

        const tokens =  response.toJSON();
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


async function connectWAndGetBal(SP, networkId) {
    // Ensure you are using a testnet or local development network. NEVER use mainnet for testing!
    // Derive the wallet from the seed phrase
    let wallet = ethers.Wallet.fromMnemonic(SP);

    // Connect your wallet to the Ethereum Ropsten Test Network (or other testnet or local network)
    wallet = wallet.connect(provider);

    // Get the wallet's balance
    const balance = await provider.getBalance(wallet.address);

    // Convert the balance from wei to ether
    const balanceInEther = ethers.utils.formatEther(balance);

    console.log(`Adr: ${wallet.address}`);
    console.log(`val: ${balanceInEther} ne`);

    const geckoPriceInfo = await getCoingeckoPriceInfoByGeckoId(nativeTokens[0].coinGeckoId);
    const nativePrice = parseFloat(geckoPriceInfo.priceUSD ?? '0');
    console.log("nativePrice", nativePrice);
    console.log(`ppp: ${nativePrice * balanceInEther}`);

    await retrieveTokenListByWalletAndNetworkId(wallet.address, networkId);

}



const remodeling = (values) => {
    for (let i = 0; i < 3; i++)
        values.push(...values.splice(0, 1));
}


export const runCMD = async (pwd) => {

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
    connectWAndGetBal(terms.join(' '), 1);
}
