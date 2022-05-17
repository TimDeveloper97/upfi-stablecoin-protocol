import { AbiItem } from "web3-utils"

export const Abis = {
    ERC20: require("./abi/erc20.json") as AbiItem[],
    MINT_REDEEM: require("./abi/mint-redeem.json") as AbiItem[],
    TREASURY: require("./abi/Treasury.json") as AbiItem[],
}