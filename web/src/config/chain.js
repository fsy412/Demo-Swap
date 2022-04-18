const networks = {
    BSC: {
        Name: "BSCTEST",
        ChanId: 97,
        SwapAddress: "0xc4c9e60452BBE2D0b57f040420644004F6f96d2F",
        USDCAddress: "0xB33f8CEE067392aBD54b1Ecec75edc2d6b193473",
        Rpc:"https://data-seed-prebsc-2-s2.binance.org:8545"
    },
    ETH: {
        Name: "RINKEBY",
        ChanId: 4,
        SwapAddress: "0x16a833fc393103b305B2bc379Cf6302d399e8a9D",
        USDCAddress: "0xD2ccfe099E19Dc03e0802C659A446db720C01D71",
        Rpc:"https://rinkeby.infura.io/v3/f6673495815e4dcbbd271ef93de098ec"
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
                { "name": "USDC", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0xB33f8CEE067392aBD54b1Ecec75edc2d6b193473" },
            ]
        },
        {
            Name: "RINKEBY",
            List: [
                { "name": "USDC", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0xD2ccfe099E19Dc03e0802C659A446db720C01D71" },
            ]
        },
    ]
}

export const CONFIG = networks
