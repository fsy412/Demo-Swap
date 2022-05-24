const networks = {
    BSC: {
        Name: "BSCTEST",
        ChanId: 97,
        SwapAddress: "0x8eEF8F8a6a800A8bd5f7051D5e31DC91D34DA6d6",
 
        DANTAddress: "0x9D3919000E621135a3ab35217dDDa0e6F98E699f",
 
        Rpc: "https://data-seed-prebsc-1-s1.binance.org:8545"
    },
    ETH: {
        Name: "RINKEBY",
        ChanId: 4,
        SwapAddress: "0xd84cd8a13f616b9AD8cBa814c2715Bc1e22660f2",
 
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
                { "name": "DANT", "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png", "address": "0xD2ccfe099E19Dc03e0802C659A446db720C01D71" },
                { "name": "ETH", "icon": "https://anyswap.exchange/static/media/ETH.cec4ef9a.svg", "address": "0x4372FFc9839C5F22459cDB8298601960a760e511" },
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
