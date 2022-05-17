import Web3 from 'web3'
import { Abis } from '../abis/Abis'
import { CONTRACTS_ADDRESS } from './Address'
const web3 = new Web3(window.ethereum)

export const CONTRACT = {
    ERC20: (adddress: string) => new web3.eth.Contract(Abis.ERC20, adddress),
    TREASURY: new web3.eth.Contract(Abis.TREASURY, CONTRACTS_ADDRESS.TREASURY),
    MINT_REDEEM: new web3.eth.Contract(Abis.MINT_REDEEM, CONTRACTS_ADDRESS.MINT_REDEEM)
}