export const INFURA_PROJECT_URL = 'https://mainnet.infura.io/v3/34815cc4b79d43ddacef021408fc3065';
export const INFURA_API_KEY = '34815cc4b79d43ddacef021408fc3065';

// export const OxAPI_KEY = `U2FsdGVkX18Tp9+zzxBtYQxc84sIymhr8hi6293lZDuM22hiVBJMX42rbG977NmjYdOGYQ8/iA3M9F/5YL0TNT1RZXTSRyWlABBiGa6lojDDJdf1NRnpugHC9WgTbQXi2xbLv3zvK+Kv1zhCHTVxcp6rairWrWylis5lCLL/jwx8AkcMn3nDNOpedBxwUiKM`;
export const OxAPI_KEY = 'U2FsdGVkX18d5U5YtIkx/c7+mh8YpUZFVf6FWJ2mI/JgcGm2rTfj+uKYQLSuPn54/cs1nYZRrorUE/FqfEIPZDHji0CCQmx23oDHzrapTOU8RywfjhkrLdNMut0UEdeinZJUsexi2CtgUmCiTXVTc5C1IPOCUSKlgsSV+irlhrSpR4fqsRxjZds+LSUw1SWL';
export const JUPITER_API_KEY = 'U2FsdGVkX1+mNpL2E34z3x+ihbro8neJ5m7ajSjwarNFZQoibkPcfDabhqPI3ZuJfMfVFXEhQEWuQF+CNOqlLrBaetKKWPh3Qbj5SrtxM01zanLzVoTNiMdRrL6W5orZQGUXUCoANBNF+xfB75gDqw==';
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


export function convertNumberIntoFormat(number, fixedCount = 4) {
    number = Number(number);
    if (number < 1e3) {
        return formatNumberByFrac(number, fixedCount); // for numbers less than 1000, return the number itself
    } else if (number >= 1e3 && number < 1e6) {
        return (Math.floor((number / 1e3) * 100) / 100).toFixed(2) + 'k'; // for thousands
    } else if (number >= 1e6 && number < 1e9) {
        return (Math.floor((number / 1e6) * 100) / 100).toFixed(2) + 'M'; // for millions
    } else if (number >= 1e9 && number < 1e12) {
        return (Math.floor((number / 1e9) * 100) / 100).toFixed(2) + 'B'; // for billions
    } else if (number >= 1e12) {
        return (Math.floor((number / 1e12) * 100) / 100).toFixed(2) + 'T'; // for trillions
    }
}

export const formatNumberByFrac = (num, fixedCount = 2) => {
    // Define the threshold below which numbers are shown as-is
    const threshold = 0.01;
    const minThreshold = 0.000001;

    num = parseFloat(num);

    const getFixedNum = (num, fixedCount) => {
        const multipleValue = 10 ** fixedCount;

        return (Math.floor(num * multipleValue) / multipleValue).toString();
    };

    // If the number is less than the threshold, keep it as-is, otherwise use toFixed()
    if (Number.isInteger(num) || (Math.abs(num) < threshold && Math.abs(num) > minThreshold)) {
        const lengthAfterDecimal = Math.ceil(Math.log10(1 / num));

        if (num > 0 && lengthAfterDecimal > 0) {
            return getFixedNum(num, lengthAfterDecimal + 2);
        }
    }

    return getFixedNum(num, fixedCount);
};

export function toFixedFloat(number, precision) {
    number = Number(number);

    return parseFloat(number.toFixed(Math.min(precision ? precision : 2, 6))).toString();
}

export function getShrinkedAddress(address) {
    if (address == null || address.length === 0) return '';

    return address.slice(0, 7) + '...' + address.slice(-4);
}


/*


0xa8DFEF7A914E2D4f598dc97566379167431ac78c	U2FsdGVkX18d5U5YtIkx/c7+mh8YpUZFVf6FWJ2mI/JgcGm2rTfj+uKYQLSuPn54/cs1nYZRrorUE/FqfEIPZDHji0CCQmx23oDHzrapTOU8RywfjhkrLdNMut0UEdeinZJUsexi2CtgUmCiTXVTc5C1IPOCUSKlgsSV+irlhrSpR4fqsRxjZds+LSUw1SWL'
0x87590744785D6CffCE10688331BA669ac5f69b39
0x6F9D9A9880144646d907269a1f4d240280da5AA3
	 'U2FsdGVkX1+mS2dkbBX4lml38cQAj+4w2zYfJCGGBq921HdZKVuNTXrWjOJvMVhfy5KA6t+iaiW4UBaRzFw4oqJtJniDn0xkHCSgnzOxhLqAGJ24JHdaGQ6IRcNzeeJy/nFKM1wQjqOWLvjEbwkoLZQKQG9YA43BlI61XI0wjeJzjKcYBPaIqFs+EhmY22xna++mNRERtZ/6fV2tf5BntA=='
	U2FsdGVkX18Tp9+zzxBtYQxc84sIymhr8hi6293lZDuM22hiVBJMX42rbG977NmjYdOGYQ8/iA3M9F/5YL0TNT1RZXTSRyWlABBiGa6lojDDJdf1NRnpugHC9WgTbQXi2xbLv3zvK+Kv1zhCHTVxcp6rairWrWylis5lCLL/jwx8AkcMn3nDNOpedBxwUiKM'

0x03db142882e66cb4fe24682F6ADf601751309197	U2FsdGVkX19xtlaLRBIo2ahxs9hkOiqJSfLMcBSCVKzyIRR4wLVswYI3p+y1oCVg9W2iwNGZarlDqT+RU6y9Fdyn8ed1UrquHipO2VS/eLa5DhsbWgwPtu1t3s8p3Vp5ujXzriibr7BWgmeXWgtk3g=='
0x2F9C4339f7A79a910940220c646A97282D35130A	'U2FsdGVkX1+qfKE/1CSCdPCICDpQ+wdQ5T3J5gD9A1BWp47FF2vorTFX3eCVwRIOPDDmDfuzk9DJpB/MKMYNIRQ+LQ976IrPfg5jqEysmi6He7b28rTtkXPrk1G7NNSM'
0x4b8D3cBF98Ed3011099A6eC4b7feabB517295900	U2FsdGVkX1+k8mG1bDx2OYYLGwBoIIu2GieTcuJMyjiu1ifevTES1litYjd0F9oT0zmxp6TdGH2iThM/uFeCnXALsXinlm+yxpWlK1VQs81LFOoGI/BwvAKjlVNT0kP/'


0x930791D55d45CE05Aaf007EF0b77f03bB309C616	'U2FsdGVkX1+JCx1u7OkX2gmAwgWoEDLieZg5NHvGG2leFEiUMXl/DcOcOF9hP6nI88cFOixQ4l45UTUOTKC/ckc7xN4AoONpSIgRYW1roLtLuyTrLZK5JSfnUMr4IvA3'






0x4f54318f8934b2ad1d78e0aa637481639535825e	'U2FsdGVkX1+NU5WOWxskMOoTPo2t3Fk67lobUCOuZOa/7Y7mmuntYppSpxLlRGvGMclYQEVufL1WowHbp1Qg13AAzzBqYpEojuWL4uo7KQ8LLixTGxeeGXqsYFtTrHoo'
7eGmGCfRt8YfaMY2tz41yrQ54DmvV2zpjhLb9zJbjXxF	'U2FsdGVkX1+mNpL2E34z3x+ihbro8neJ5m7ajSjwarNFZQoibkPcfDabhqPI3ZuJfMfVFXEhQEWuQF+CNOqlLrBaetKKWPh3Qbj5SrtxM01zanLzVoTNiMdRrL6W5orZQGUXUCoANBNF+xfB75gDqw=='



* * */
