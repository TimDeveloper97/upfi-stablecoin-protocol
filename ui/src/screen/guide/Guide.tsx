import React from 'react'
import './index.less'

const Guide = () => {
  return (
    <div className="faucet-content">
      <div>
        <div className="section-header border-top-radius">
          Follow these steps for started
        </div>
        <div className="section-content border-bottom-radius">
          <div>
            <ol>
              <li>
                <span>
                  Add Emerald Testnet to your wallet (Recommend to use
                  Metamask):{' '}
                </span>
                <a
                  href="https://docs.oasis.dev/general/developer-resources/emerald-paratime/"
                  target={'_blank'}
                >
                  https://docs.oasis.dev/general/developer-resources/emerald-paratime/
                </a>
              </li>

              <li>
                <span>
                  Get gas fee for Emerald Testnet: Go to{' '}
                  <a href="https://faucet.testnet.oasis.dev/" target={'_blank'}>
                    https://faucet.testnet.oasis.dev/
                  </a>
                  <span>
                    {' '}
                    then select{' '}
                    <span style={{ fontWeight: 'bold' }}> Emerald</span>
                  </span>
                </span>
              </li>
              <li>
                <span>Switch your wallet to Emerald Testnet network </span>
              </li>
              <li>
                <span>Connect UPFI to your wallet. Enjoy!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Guide
