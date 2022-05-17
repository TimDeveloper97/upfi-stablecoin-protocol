import React, { useContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from "@coinbase/wallet-sdk"
interface IAppState {
  connect: () => void
  disconnect: () => void
  fetching: boolean
  address: string
  web3: Web3
  provider: any
  connected: boolean
  chainId: number
  networkId: number
  showModal: boolean
  pendingRequest: boolean
  result: any | null
}

const INITIAL_STATE: IAppState = {
  connect() {},
  disconnect() {},
  fetching: false,
  address: '',
  web3: new Web3(window.ethereum), // default web3
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  showModal: false,
  pendingRequest: false,
  result: null,
}

const WalletContext = React.createContext<IAppState>(INITIAL_STATE)

function initWeb3(provider: any) {
  const web3: Web3 = new Web3(provider)

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId'
      },
    ],
  })

  return web3
}

const providerOptions = {
  // walletconnect: {
  //   package: WalletConnectProvider,
  //   options: {
  //     infuraId: '112dd7aca32e427ab164061e3204c639'
  //   },
  // },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "UPFI App",
    }
  }
}

export function WalletProvider({ children = null as any }) {
  const [state, setState] = useState<IAppState>(INITIAL_STATE)

  const web3Modal = new Web3Modal({
    network: '',
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  })

  // useEffect(() => {
  //   if(web3Modal.cachedProvider != null) connect()
  // }, [])

  const connect = async () => {
    const provider = await web3Modal.connect()

    await subscribeProvider(provider)

    await provider.enable()
    const web3: any = initWeb3(provider)

    const accounts = await web3.eth.getAccounts()

    const address = accounts[0]

    const networkId = await web3.eth.net.getId()

    const chainId = await web3.eth.chainId()

    setState((e) => ({
      ...e,
      fetching: false,
      address: address,
      web3: web3,
      provider: provider,
      connected: true,
      chainId: chainId,
      networkId: networkId,
      showModal: false,
      pendingRequest: false,
      result: null,
    }))
  }
  const disconnect = async () => {
    resetApp() 
  }
  async function resetApp() {
    const { web3 } = state
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close()
    }
    web3Modal.clearCachedProvider()
    setState({ ...INITIAL_STATE })
  }

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return
    }
    provider.on('close', () => {
      console.log('closed')
      resetApp()
    })
    provider.on('accountsChanged', async (accounts: string[]) => {
      if(accounts[0]) {
        setState((e) => ({
          ...e,
          address: accounts[0],
        }))
      } else {
        resetApp()
      }
    })
    provider.on('chainChanged', async (chainId: number) => {
      const { web3 } = state
      const networkId = await web3.eth.net.getId()
      setState((e) => ({
        ...e,
        networkId,
      }))
    })

    provider.on('networkChanged', async (networkId: number) => {
      const { web3 } = state
      const chainId = await web3.eth.chainId()
      setState((e) => ({
        ...e,
        chainId,
      }))
    })
    provider.on('disconnect', async (networkId: number) => {
      const { web3 } = state
      console.log('disconnected')
    })
  }
  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect: connect,
        disconnect: disconnect

      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const {
    web3,
    provider,
    connected,
    address,
    networkId,
    chainId,
    connect,
    disconnect
  } = useContext(WalletContext)
  return {
    web3,
    provider,
    connected,
    address,
    networkId,
    chainId,
    connect,
    disconnect
  }
}
