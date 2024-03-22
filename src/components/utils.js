import {Pair, Route} from '@uniswap/v2-sdk'
import {ethers} from "ethers";
import { ChainId, Token, WETH9, CurrencyAmount } from '@uniswap/sdk-core'


const INFURA_PROJECT_URL = 'https://mainnet.infura.io/v3/34815cc4b79d43ddacef021408fc3065';
const provider = new ethers.providers.JsonRpcProvider(INFURA_PROJECT_URL);
const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6)
const XXX = new Token(ChainId.MAINNET, '0x7039cd6D7966672F194E8139074C3D5c4e6DCf65', 9)

const uniswapV2poolABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "getReserves",
        "outputs": [
            { "internalType": "uint112", "name": "_reserve0", "type": "uint112" },
            { "internalType": "uint112", "name": "_reserve1", "type": "uint112" },
            { "internalType": "uint32", "name": "_blockTimestampLast", "type": "uint32" }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

async function createPair(tokenA, tokenB) {
    const pairAddress = Pair.getAddress(tokenA, tokenB)

    // Setup provider, import necessary ABI ...
    const pairContract = new ethers.Contract(pairAddress, uniswapV2poolABI, provider)
    const reserves = await pairContract["getReserves"]()
    const [reserve0, reserve1] = reserves

    const tokens = [tokenA, tokenB]
    const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

    const pair = new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))
    return pair
}
/*


(async () => {



// To learn how to get Pair data, refer to the previous guide.
    const pair = await createPair(USDT, WETH9[ChainId.MAINNET])
    const route = new Route([pair], WETH9[USDT.chainId], USDT)
    console.log(route.midPrice.toSignificant(6)) // 1901.08
    console.log(route.midPrice.invert().toSignificant(6)) // 0.000526017

    const XXXpair = await createPair(XXX, WETH9[ChainId.MAINNET])
    const XXXroute = new Route([XXXpair], WETH9[XXX.chainId], XXX)
    console.log(XXXroute.midPrice.toSignificant(6)) // 1901.08
    console.log(XXXroute.midPrice.invert().toSignificant(6)) // 0.000526017


})();
*/

export const getCurPr = async () => {
    // To learn how to get Pair data, refer to the previous guide.
    const pair = await createPair(USDT, WETH9[ChainId.MAINNET])
    const route = new Route([pair], WETH9[USDT.chainId], USDT)
    const XXXpair = await createPair(XXX, WETH9[ChainId.MAINNET])
    const XXXroute = new Route([XXXpair], WETH9[XXX.chainId], XXX)

    const USDTPrice = parseFloat(route.midPrice.toSignificant(6));
    const XXXPrice = parseFloat(XXXroute.midPrice.toSignificant(6));


    console.log("test price " + USDTPrice / XXXPrice);


/*
    console.log(route.midPrice.toSignificant(6)) // 1901.08
    console.log(route.midPrice.invert().toSignificant(6)) // 0.000526017
*/

/*
    console.log(XXXroute.midPrice.toSignificant(6)) // 1901.08
    console.log(XXXroute.midPrice.invert().toSignificant(6)) // 0.000526017
*/

}
