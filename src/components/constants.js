export const INFURA_PROJECT_URL = 'https://mainnet.infura.io/v3/34815cc4b79d43ddacef021408fc3065';
export const INFURA_API_KEY = '34815cc4b79d43ddacef021408fc3065';

// export const OxAPI_KEY = `U2FsdGVkX18Tp9+zzxBtYQxc84sIymhr8hi6293lZDuM22hiVBJMX42rbG977NmjYdOGYQ8/iA3M9F/5YL0TNT1RZXTSRyWlABBiGa6lojDDJdf1NRnpugHC9WgTbQXi2xbLv3zvK+Kv1zhCHTVxcp6rairWrWylis5lCLL/jwx8AkcMn3nDNOpedBxwUiKM`;
export const OxAPI_KEY = 'U2FsdGVkX18d5U5YtIkx/c7+mh8YpUZFVf6FWJ2mI/JgcGm2rTfj+uKYQLSuPn54/cs1nYZRrorUE/FqfEIPZDHji0CCQmx23oDHzrapTOU8RywfjhkrLdNMut0UEdeinZJUsexi2CtgUmCiTXVTc5C1IPOCUSKlgsSV+irlhrSpR4fqsRxjZds+LSUw1SWL';
// export const OxAPI_KEY = 'U2FsdGVkX1+JCx1u7OkX2gmAwgWoEDLieZg5NHvGG2leFEiUMXl/DcOcOF9hP6nI88cFOixQ4l45UTUOTKC/ckc7xN4AoONpSIgRYW1roLtLuyTrLZK5JSfnUMr4IvA3';
export const MORALIS_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjNlZDA0YWVkLWQ1NzAtNDY3My1hYTYwLWFjMmE2OGYwZDkxYyIsIm9yZ0lkIjoiMzkzOTIyIiwidXNlcklkIjoiNDA0NzcyIiwidHlwZUlkIjoiNTRjY2EyMjYtY2ZhOS00ZTMyLTgwMWItYzU3ZTgzNzFmMWM3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTY4MTU4MTYsImV4cCI6NDg3MjU3NTgxNn0.R8miTjC54UMnv4OoqawRj59ggLnalawn2i_qOBy5Xu0';
export const DEFINED_API_KEY = "9dac34318cfc1c1a3d4f7dd76a126a7d17882d81";



export const mapUniswapV2RouterAddress = {
    1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // ETH
    42161: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // arbitrum
    43114: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // avax
    56: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // BNB
    8453: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24', // base
    10: '0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2', // Optimism
    137: '0xedf6066a2b290C185783862C7F4776A2C8077AD1', // Polygon
    81457: '0xBB66Eb1c5e875933D44DAe661dbD80e5D9B03035', // blast
};

export const mapPancakeswapV2RouterAddress = {
    56: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // BSC
    1: '0xEfF92A263d31888d860bD50809A8D171709b7b1c', // ETH
    42161: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb', // arbitrum
    59144: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb', // Linea
    8453: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb', // Base
    204: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb' // opBNB
};


export const nativeTokens = [{
    'networkId': 1,
    'name': 'Ethereum',
    'symbol': 'ETH',
    'decimals': 18,
    'coinGeckoId': 'ethereum'
}, {
    'networkId': 56,
    'name': 'Bnb',
    'symbol': 'BNB',
    'decimals': 18,
    'coinGeckoId': 'binancecoin'
}, {
    'networkId': 42161,
    'name': 'Ethereum',
    'symbol': 'ETH',
    'decimals': 18,
    'coinGeckoId': 'ethereum'
}, {
    'networkId': 137,
    'name': 'Matic',
    'symbol': 'MATIC',
    'decimals': 18,
    'coinGeckoId': 'matic-network'
}, {
    'networkId': 43114,
    'name': 'Avalanche',
    'symbol': 'AVAX',
    'decimals': 18,
    'coinGeckoId': 'avalanche-2'
}, {
    'networkId': 25,
    'name': 'Cronos',
    'symbol': 'CRO',
    'decimals': 18,
    'coinGeckoId': 'crypto-com-chain'
}, {
    'networkId': 10,
    'name': 'Ethereum',
    'symbol': 'ETH',
    'decimals': 18,
    'coinGeckoId': 'ethereum'
}, { 'networkId': 8453, 'name': 'Ethereum', 'symbol': 'ETH', 'decimals': 18, 'coinGeckoId': 'ethereum' }
];
