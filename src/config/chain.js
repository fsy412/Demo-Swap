const networks = {
    BSC: {
        Name: "BSCTEST",
        ChanId: 97,
        SwapAddress: "0x8eEF8F8a6a800A8bd5f7051D5e31DC91D34DA6d6",
        USDCAddress: "0xB33f8CEE067392aBD54b1Ecec75edc2d6b193473",
        Rpc: "https://data-seed-prebsc-1-s1.binance.org:8545"
    },
    ETH: {
        Name: "RINKEBY",
        ChanId: 4,
        SwapAddress: "0xd84cd8a13f616b9AD8cBa814c2715Bc1e22660f2",
        USDCAddress: "0xD2ccfe099E19Dc03e0802C659A446db720C01D71",
        Rpc: "https://rinkeby.infura.io/v3/f6673495815e4dcbbd271ef93de098ec"
    },
    TokenList: [
        {
            Name: "BSCTEST",
            List: [
                { "name": "USDC", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0xB33f8CEE067392aBD54b1Ecec75edc2d6b193473" },
                { "name": "BNB", "icon": "https://anyswap.exchange/static/media/BNB.c6c25fc0.svg", "address": "0x34D55579d378456a572ce9C267d73944c13830c8" },
            ]
        },
        {
            Name: "RINKEBY",
            List: [
                { "name": "USDC", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0xD2ccfe099E19Dc03e0802C659A446db720C01D71" },
                { "name": "ETH", "icon": "https://anyswap.exchange/static/media/ETH.cec4ef9a.svg", "address": "0x34D55579d378456a572ce9C267d73944c13830c8" },
            ]
        },
    ],
    FaucetTokenList: [
        {
            Name: "BSCTEST",
            List: [
                { "name": "DANT", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0xB33f8CEE067392aBD54b1Ecec75edc2d6b193473" },
            ]
        },
        {
            Name: "RINKEBY",
            List: [
                { "name": "DANT", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0xD2ccfe099E19Dc03e0802C659A446db720C01D71" },
            ]
        },
    ]
}

export const CONFIG = networks
