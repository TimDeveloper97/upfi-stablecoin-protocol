import React, { useEffect, useState } from 'react'
import PrimaryButton from '../../component/Button/PrimaryButton'
import { useWallet } from '../../context/useWallet'
import Web3 from 'web3'
import { CONTRACT } from '../../contracts/Contract'
import { CONTRACTS_ADDRESS } from '../../contracts/Address'
import { useBalances } from '../../context/useBalance'
import './index.less'
import { TOKEN } from '../../utils/Token'
import { EXPLORER } from '../../utils/Constants'

const ASSETS = ['BTC', 'ETH', 'ROSE', 'UPFI', 'UPO', 'USDC']

const Faucet = () => {
  const { address, connected } = useWallet()
  const { balances, getBalances } = useBalances()
  console.log({ balances })

  async function requestAirdrop(erc20_address: string) {
    await CONTRACT.ERC20(erc20_address)
      .methods.airdrop(address)
      .send({ from: address, gas: 400000 })
    getBalances()
  }

  return (
    <div className="faucet-content">
      <div>
        <div className="section-header border-top-radius">Assets Balance</div>
        <div className="section-content border-bottom-radius">
          <table>
            <tr>
              <td>Token</td>
              <td>Contract</td>
              <td>Balance</td>
              <td></td>
            </tr>

            {ASSETS.map((token) => {
              return (
                <tr>
                  <td>
                    <img src={TOKEN[token].icon} className="token-icon" />
                    <span className="token-name">{TOKEN[token].symbol}</span>
                  </td>

                  <td>
                    <a
                      href={`${EXPLORER}/token/${TOKEN[token].address}`}
                      target={'_blank'}
                    >
                      {TOKEN[token].address}
                    </a>
                  </td>

                  <td>{balances[TOKEN[token].address]}</td>

                  <td>
                    <div className="btn-airdrop">
                      <PrimaryButton
                        status={(token == 'UPFI' || !connected) ? 'disable' : 'enable'}
                        action={() => requestAirdrop(TOKEN[token].address)}
                      >
                        Airdrop
                      </PrimaryButton>
                    </div>
                  </td>
                </tr>
              )
            })}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Faucet
