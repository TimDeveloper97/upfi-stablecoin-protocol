import React, { useEffect, useState } from 'react'
import './index.less'
import Logo from '../../assets/image/logo.png'
import { ethers } from 'ethers'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useWallet } from '../../context/useWallet'
import { shortAddress } from '../../utils/Util'
import {FaSignOutAlt} from 'react-icons/fa'
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {},
  },
}


const ButtonConnect = () => {
  const { connect, address, connected, disconnect } = useWallet()
  console.log(connected, address)
  return (
    <div>
      {connected ? (
        <div
          className="connect-btn"
          onClick={() => {
            disconnect()
          }}
        >
          <div className='btn-connected'>
          <div>{shortAddress(address)}</div>
          <FaSignOutAlt size={20}/>
          </div>
        </div>
      ) : (
        <div
          className="connect-btn"
          onClick={async () => {
            connect()
          }}
        >
          Connect Wallet
        </div>
      )}
    </div>
  )
}

export default ButtonConnect
