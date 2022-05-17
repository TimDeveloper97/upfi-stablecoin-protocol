import React, { useEffect } from 'react'
import { useState } from 'react'
import NumberFormat from 'react-number-format'
import IcAdd from '../../assets/image/ic_add.png'
import IcArrow from '../../assets/image/ic_arrow.png'

import PrimaryButton from '../../component/Button/PrimaryButton'
import { TOKEN } from '../../utils/Token'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { Select } from 'antd'
import { ASSETS_ADDRESS, useBalances } from '../../context/useBalance'
import { useWallet } from '../../context/useWallet'
import { CONTRACTS_ADDRESS } from '../../contracts/Address'
import { CONTRACT } from '../../contracts/Contract'
import { ethers } from 'ethers'
const PRECISION = 0.001
const { Option } = Select
const APPROVE_AMOUNT = ethers.utils.parseUnits('1000000', 18)
const Mint = (props) => {
  const { mint, tcr, tokenSharePrice, mintingFee, loading } = props
  const { address, connect, connected } = useWallet()
  const [collateralInput, setCollateralInput] = useState(0)
  const [shareInput, setShareInput] = useState(0)
  const [output, setOutput] = useState(0)
  const { balances } = useBalances()
  const [slippage, setSlippage] = useState(0.05)
  const [collateralPrice, setCollateralPrice] = useState(1)
  const [isLoadingEnUsdc, setLoadingEnUsdc] = useState(false)
  const [isLoadingEndShare, setLoadingEnShare] = useState(false)

  const [allowances, setAllowances] = useState<{
    [address: string]: number
  }>({})

  async function getAllowance() {
    if (address) {
      let newAllowances = allowances
      await Promise.all(
        ASSETS_ADDRESS.map(async (token_address) => {
          let erc20Contract = CONTRACT.ERC20(token_address)
          const allowance = await erc20Contract.methods
            .allowance(address, CONTRACTS_ADDRESS.MINT_REDEEM)
            .call()
          newAllowances[token_address] = parseFloat(
            ethers.utils.formatEther(allowance),
          )
        }),
      )
      setAllowances({...newAllowances})
    }
  }

  useEffect(() => {
    getAllowance()
  }, [address])


  const [tokenShare, setTokenSahre] = useState<string>('ROSE')

  useEffect(() => {
    if (tcr !== 100) {
      let rate = tcr / (100 - tcr)
      let ups = collateralInput / rate / tokenSharePrice[tokenShare]
      if (
        Math.abs(shareInput - ups) > PRECISION ||
        !shareInput ||
        !collateralInput
      ) {
        setShareInput(ups)
      }
    }
  }, [collateralInput])

  useEffect(() => {
    if (tcr !== 100) {
      let rate = tcr / (100 - tcr)
      let usdc = shareInput * tokenSharePrice[tokenShare] * rate
      if (
        Math.abs(collateralInput - usdc) > PRECISION ||
        !shareInput ||
        !collateralInput
      ) {
        setCollateralInput(parseFloat(usdc))
      }
    }
  }, [shareInput])

  async function getReturn() {
    let total_dollar_value =
      collateralInput * collateralPrice +
      shareInput * tokenSharePrice[tokenShare]
    let actual_dollar_value = total_dollar_value * (1 - mintingFee)
    setOutput(actual_dollar_value)
  }

  useEffect(() => {
    let price = tokenSharePrice[tokenShare]
    if (collateralInput > 0 && shareInput > 0 && price > 0) {
        getReturn()
    } else {
      setOutput(0)
    }
  }, [collateralInput, shareInput])

  useEffect(() => {
    setCollateralInput(null)
    setShareInput(null)
    setOutput(0)
  }, [tokenShare])

  const getBtnMintText = () => {
    if (!connected) {
      return 'Connect Wallet'
    }
    if (collateralInput > 0 && shareInput > 0) {
      if (collateralInput > balances[TOKEN['USDC'].address]) {
        return 'Insufficient USDC balance'
      } else if (shareInput > balances[TOKEN[tokenShare].address]) {
        return `Insufficient ${tokenShare} balance`
      }
    } else {
      return 'Enter amount'
    }
    return 'Mint'
  }

  const getBtnMintStatus = () => {
    if (!connected) return 'enable'
    if (loading) return 'loading'
    if (
      collateralInput > 0 &&
      collateralInput <= balances[TOKEN['USDC'].address] &&
      shareInput > 0 &&
      shareInput <= balances[TOKEN[tokenShare].address] &&
      allowances[TOKEN['USDC'].address] > collateralInput &&
      allowances[TOKEN[tokenShare].address] > shareInput
    ) {
      return 'enable'
    }
    return 'disable'
  }

  async function enableToken(token_address: string) {
    if (token_address == TOKEN['USDC'].address) {
      setLoadingEnUsdc(true)
    } else {
      setLoadingEnShare(true)
    }
    try {
      await CONTRACT.ERC20(token_address)
        .methods.approve(CONTRACTS_ADDRESS.MINT_REDEEM, APPROVE_AMOUNT)
        .send({
          from: address,
          gas: 400000,
        })
        .on('transactionHash', function (hash: string) {
          console.log('on transactionHash', hash)
        })
        .on('receipt', function (receipt: any) {
          console.log('on receipt', receipt)
        })
        .on('confirmation', function (
          confirmationNumber: number,
          receipt: any,
        ) {
          console.log('on confirmation', confirmationNumber, receipt)
        })
        .on('error', function (error: any) {
          console.log('on error', error)
        })
    } catch (error) {
    } finally {
      if (token_address == TOKEN['USDC'].address) {
        setLoadingEnUsdc(false)
      } else {
        setLoadingEnShare(false)
      }
      getAllowance()
    }
  }

  const EnableUsdcBtn = () => {
    if (allowances[TOKEN['USDC'].address] < collateralInput && connected) {
      return (
        <div className="btn-mint-redeem" style={{ marginTop: 32 }}>
          <PrimaryButton
            status={isLoadingEnUsdc ? 'loading' : 'enable'}
            action={() => {
              enableToken(TOKEN['USDC'].address)
            }}
          >
            {'Enable USDC'}
          </PrimaryButton>
        </div>
      )
    }
    return null
  }

  const EnableShareBtn = () => {
    if (allowances[TOKEN[tokenShare].address] < shareInput && connected) {
      return (
        <div className="btn-mint-redeem" style={{ marginTop: 16 }}>
          <PrimaryButton
            status={isLoadingEndShare ? 'loading' : 'enable'}
            action={() => {
              enableToken(TOKEN[tokenShare].address)
            }}
          >
            {`Enable ${tokenShare}`}
          </PrimaryButton>
        </div>
      )
    }
    return null
  }

  return (
    <div className="tab-content">
      <div className="input-amount">
        <div className="input-top">
          <span>
            Input <span className="input-rate">{tcr}%</span>
          </span>
          <span
            onClick={() => {
              setCollateralInput(balances[TOKEN['USDC'].address])
            }}
          >
            {`Balance: ${balances[TOKEN['USDC'].address] || 0}`}
          </span>
        </div>
        <div className="input-number">
          <NumberFormat
            value={collateralInput}
            placeholder="0.0"
            className="flex-max number-format"
            onValueChange={(values) => {
              const { floatValue } = values
              setCollateralInput(floatValue)
            }}
          />
          <div className="center-vertical">
            {/* <span
              className="half"
              onClick={() => {
                setCollateralInput(usnBalance / 2)
              }}
            >
              Half
            </span> */}
            <img src={TOKEN['USDC'].icon} className="input-logo" />
            <span className="token-name bold">{TOKEN['USDC'].symbol}</span>
          </div>
        </div>
      </div>

      <img src={IcAdd} className="add-arrow-ic" />

      <div className="input-amount">
        <div className="input-top">
          <span>
            Input <span className="input-rate">{100 - tcr}%</span>
          </span>
          <span
            onClick={() => {
              setShareInput(balances[TOKEN[tokenShare].address])
            }}
          >
            {`Balance: ${balances[TOKEN[tokenShare].address] || 0}`}
          </span>
        </div>
        <div className="input-number">
          <NumberFormat
            value={shareInput}
            placeholder="0.0"
            className="flex-max number-format"
            onValueChange={(values) => {
              const { floatValue } = values
              setShareInput(floatValue)
            }}
          />
          <div className="center-vertical">
            {/* <span
              className="half"
              onClick={() => {
                setShareInput(upnBalance / 2)
              }}
            >
              Half
            </span> */}
            <div className="token-select">
              <img src={TOKEN[tokenShare].icon} className="input-logo" />
              <span className="token-name bold">
                {TOKEN[tokenShare].symbol}
              </span>
              <MdOutlineKeyboardArrowDown size={20} />
              <Select
                defaultValue={tokenShare}
                style={{ width: 120 }}
                onChange={(value) => {
                  setTokenSahre(value)
                }}
              >
                {/* <Option value="UPO">UPO</Option> */}
                <Option value="ROSE">ROSE</Option>
                <Option value="BTC">BTC</Option>
                <Option value="ETH">ETH</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <img src={IcArrow} className="add-arrow-ic" />

      <div className="input-amount">
        <div className="input-top">
          <span>Output (estimated)</span>
          <span>{`Balance: ${balances[TOKEN['UPFI'].address] || 0}`}</span>
        </div>
        <div className="input-number">
          <NumberFormat
            value={output}
            disabled
            className="flex-max number-format"
          />
          <div className="center-vertical">
            <img src={TOKEN['UPFI'].icon} className="input-logo" />
            <span className="token-name bold">{TOKEN['UPFI'].symbol}</span>
          </div>
        </div>
      </div>

      <div className="stable-fees">
        <div>
          <span>Minting fee</span>
          <span>{`${mintingFee}%`}</span>
        </div>

        <div>
          <span>{`${tokenShare} price`}</span>
          <span>{`${tokenSharePrice[tokenShare]} USD`}</span>
        </div>
        <div>
          <span>{`Slippage Tolerance`}</span>
          <span>{`${slippage * 100}%`}</span>
        </div>
      </div>

      <EnableUsdcBtn />
      <EnableShareBtn />

      <div className="btn-mint-redeem" style={{ marginTop: 32 }}>
        <PrimaryButton
          status={getBtnMintStatus()}
          action={() => {
            if(connected) {
              mint(collateralInput, shareInput, output * (1 - slippage), tokenShare)
            } else {
              connect()
            }
          }}
        >
          {getBtnMintText()}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default Mint
