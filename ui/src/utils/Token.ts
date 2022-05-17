import Usdc from '../assets/image/tokens/usdc.png'
import Upo from '../assets/image/tokens/upo.png'
import Upfi from '../assets/image/tokens/upfi.png'
import Btc from '../assets/image/tokens/btc.webp'
import Eth from '../assets/image/tokens/eth.webp'
import Rose from '../assets/image/tokens/rose.png'
import { CONTRACTS_ADDRESS } from '../contracts/Address'

export const TOKEN = {
    USDC: {
        address: CONTRACTS_ADDRESS.USDC,
        symbol: 'USDC',
        decimals: 18,
        icon: Usdc
    },
    UPO: {
        address: CONTRACTS_ADDRESS.UPO,
        symbol: 'UPO',
        decimals: 18,
        icon: Upo
    },
    UPFI: {
        address: CONTRACTS_ADDRESS.UPFI,
        symbol: 'UPFI',
        decimals: 18,
        icon: Upfi
    },
    BTC: {
        address: CONTRACTS_ADDRESS.BTC,
        symbol: 'BTC',
        decimals: 18,
        icon: Btc
    },
    ETH: {
        address: CONTRACTS_ADDRESS.ETH,
        symbol: 'ETH',
        decimals: 18,
        icon: Eth
    },
    ROSE: {
        address: CONTRACTS_ADDRESS.ROSE,
        symbol: 'ROSE',
        decimals: 18,
        icon: Rose
    },
}