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

export {
    formatNumber
}


