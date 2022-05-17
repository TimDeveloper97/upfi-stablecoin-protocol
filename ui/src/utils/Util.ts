import { ethers } from "ethers";

export const shortAddress = (address: string): string => {
    return address.substr(0, 6) + '...' + address.substr(address.length - 4, address.length);

}

export function truncateDecimal(val: number, decimals = 3) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (decimals) + '})?');
    let withDecimalFraction = val.toString().match(re)[0]
    return parseFloat(withDecimalFraction)
}

export const numberToDecimals = (val: number, decimals: number): string => {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (decimals) + '})?');
    let withDecimalFraction = val.toString().match(re)[0]
    let amount = ethers.utils.parseUnits(withDecimalFraction, decimals);
    let output = ethers.utils.formatUnits(amount, 0)
    return output
}