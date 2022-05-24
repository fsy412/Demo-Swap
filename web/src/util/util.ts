import { CONFIG } from '../config/chain'

function formatNumber(num: string | number, decimal: number = 0): string {
    num = String(num)
    if (num === '' || num === '0') return num
    const arr = num.split('.')
    const integerPart: string = arr[0]
    const decimalPart: string = arr[1] || ''
    const len = integerPart.length

    let str: string = ''

    if (len > 2) {
        integerPart.split('').forEach((item: string, index: number) => {
            if (index > 0 && (len - index) % 3 === 0) str += ''
            str += item
        })
    } else {
        str = integerPart
    }

    if (decimal === 0) return str
    str += '.'

    const decimalLen = decimalPart.length
    if (decimal === decimalLen) {
        str += decimalPart
    } else if (decimal > decimalLen) {
        str += decimalPart + new Array(decimal - decimalLen).fill('0').join('')
    } else {
        str += decimalPart.substr(0, decimal)
    }

    return str
}

const getChainImg = (chain: string) => {
    if (chain == "BSCTEST") {
        return "https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"
    } else if (chain == "RINKEBY") {
        return "https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"
    }
}

const shortAddress = (val: string) => {
    return val.substring(0, 6) + '...' + val.substring(val.length - 4, val.length)
}

const getTokenName = (address: string, chain: string) => {
    // console.log('address', address, 'chain', chain)
    let list = CONFIG.TokenList.filter(k => (k.Name === chain))[0]?.List
    let name
    if (list) {
        name = list.filter(k => (k.address === address))[0]?.name
    }
 
 
    return name
}

const changeNetwork = (name) => {
    if (name == "BSCTEST") {
        window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
                chainId: '0x61',
                rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                chainName: "Binance Smart Chain Testnet",
                nativeCurrency: {
                    name: "BNB",
                    symbol: "TBNB",
                    decimals: 18
                },
                blockExplorerUrls: ["https://testnet.bscscan.com"]
            }]
        });
    } else {
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: '0x4',
            }]
        });
    }
}

 
const getTokenAddr = (chainName, tokenName) => {
    if (chainName) {
        let list = CONFIG.FaucetTokenList.filter(k => (k.Name === chainName))[0].List

        console.log(`list`,list)
        let tokenAddress = list.filter(k => (k.name == tokenName))[0].address;
        console.log(`tokenAddress`,tokenAddress)
        console.log(`getTokenAddr token:${tokenName} address:${tokenAddress}, chain:${chainName}`)
        return tokenAddress
    }
}

 
export {
    formatNumber,
    getChainImg,
    shortAddress,
    getTokenName,
 
    changeNetwork,
    getTokenAddr
 
}


