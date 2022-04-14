const networks = {
    BSC: {
        Name: "BSCTEST",
        ChanId: 97,
        SwapAddress: "0xEA6e8D5C70F0cF56Be0B5f685B35a5aAA4564f8a",
        USDCAddress: "0xB33f8CEE067392aBD54b1Ecec75edc2d6b193473",
    },
    ETH: {
        Name: "RINKEBY",
        ChanId: 4,
        SwapAddress: "0x4Cf2A95791d1048312c66B574960B78eA1c1B9e1",
        USDCAddress: "0xD2ccfe099E19Dc03e0802C659A446db720C01D71",
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
    ]
}

export const CONFIG = networks
