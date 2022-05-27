const networks = {
    BSC: {
        Name: "BSCTEST",
        ChanId: 97,
        SwapAddress: "0x9700922186b64cF220B1ac42Ea8B1B9a1AFafeCA",
        DANTAddress: "0x9D3919000E621135a3ab35217dDDa0e6F98E699f",
        Rpc: "https://data-seed-prebsc-1-s1.binance.org:8545"
    },
    ETH: {
        Name: "RINKEBY",
        ChanId: 4,
        SwapAddress: "0x845417D7061d65174E3e5b802583754C30Cce0A3",
        DANTAddress: "0x4372FFc9839C5F22459cDB8298601960a760e511",
        Rpc: "https://rinkeby.infura.io/v3/f6673495815e4dcbbd271ef93de098ec"
    },
    TokenList: [
        {
            Name: "BSCTEST",
            List: [
                { "name": "DANT", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0x9D3919000E621135a3ab35217dDDa0e6F98E699f" },
                { "name": "BNB", "icon": "https://anyswap.exchange/static/media/BNB.c6c25fc0.svg", "address": "0x34D55579d378456a572ce9C267d73944c13830c8" },
            ]
        },
        {
            Name: "RINKEBY",
            List: [
                { "name": "DANT", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0x4372FFc9839C5F22459cDB8298601960a760e511" },
                { "name": "ETH", "icon": "https://anyswap.exchange/static/media/ETH.cec4ef9a.svg", "address": "0x34D55579d378456a572ce9C267d73944c13830c8" },
            ]
        },
    ],
    FaucetTokenList: [
        {
            Name: "BSCTEST",
            List: [
                { "name": "DANT", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0x9D3919000E621135a3ab35217dDDa0e6F98E699f" },
            ]
        },
        {
            Name: "RINKEBY",
            List: [
                { "name": "DANT", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0x4372FFc9839C5F22459cDB8298601960a760e511" },
            ]
        },
    ]
}

export const CONFIG = networks
