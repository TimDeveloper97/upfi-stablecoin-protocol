import React, { useContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { useWallet } from './useWallet'
import { CONTRACTS_ADDRESS } from '../contracts/Address'
import { Abis } from '../abis/Abis'
import { CONTRACT } from '../contracts/Contract'

interface BalanceContextProps {
  balances: {
    [address: string]: number
  }
  getBalances: () => void
}

const BalanceContext = React.createContext<BalanceContextProps>({
  balances: {},
  getBalances() {},
})

export const ASSETS_ADDRESS = [
  CONTRACTS_ADDRESS.BTC,
  CONTRACTS_ADDRESS.ETH,
  CONTRACTS_ADDRESS.ROSE,
  CONTRACTS_ADDRESS.UPFI,
  CONTRACTS_ADDRESS.USDC,
  CONTRACTS_ADDRESS.UPO,
]

export function BalanceProvider({ children = null as any }) {
  const [balances, setBalances] = useState<{
    [address: string]: number
  }>({})

  const { address } = useWallet()

  async function getBalances() {
    if (address) {
      let newBalances = balances
      await Promise.all(
        ASSETS_ADDRESS.map(async (contract_address) => {
          let erc20Contract = CONTRACT.ERC20(contract_address)
          const balance = await erc20Contract.methods.balanceOf(address).call()
          console.log(balance)
          newBalances[contract_address] = parseFloat(ethers.utils.formatEther(balance))
        }),
      )
      setBalances({...newBalances})
    }
  }


  useEffect(() => {
    getBalances()
  }, [address])

  return (
    <BalanceContext.Provider
      value={{
        balances,
        getBalances,
      }}
    >
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalances() {
  const { balances, getBalances } = useContext(BalanceContext)
  return {
    balances,
    getBalances,
  }
}
