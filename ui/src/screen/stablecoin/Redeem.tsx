import React from 'react'
import { useState } from 'react'
import NumberFormat from 'react-number-format'
import IcAdd from '../../assets/image/ic_add.png'
import IcArrow from '../../assets/image/ic_arrow.png'
import { Select } from 'antd'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'

import { useEffect } from 'react'
import PrimaryButton from '../../component/Button/PrimaryButton'
import { TOKEN } from '../../utils/Token'
import { ASSETS_ADDRESS, useBalances } from '../../context/useBalance'
import { useWallet } from '../../context/useWallet'
import { CONTRACT } from '../../contracts/Contract'
import { CONTRACTS_ADDRESS } from '../../contracts/Address'
import { ethers } from 'ethers'
const { Option } = Select
const APPROVE_AMOUNT = ethers.utils.parseUnits('1000000', 18)

const Redeem = (props) => {
  const { redeem, ecr, redeemFee, tokenSharePrice, loading } = props
  const [input, setInput] = useState(null)
  const [collateralOutput, setCollateralOutput] = useState(null)
  const [shareOutput, setShareOutput] = useState(null)
  const [isLoadingEnUpfi, setLoadingEnUpfi] = useState(false)
  const [slippage, setSlippage] = useState(0.05)

  const [tokenShare, setTokenSahre] = useState('ROSE')
  const { address, connect, connected } = useWallet()
  const { balances } = useBalances()

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
      setAllowances({ ...newAllowances })
    }
  }

  useEffect(() => {
    getAllowance()
  }, [address])

  useEffect(() => {
    let _dollar_amount_post_fee = input * (1 - redeemFee)
    let collater_amount_value = _dollar_amount_post_fee * ecr / 100
    let collater_amount = collater_amount_value / 1
    let share_amount =
      (_dollar_amount_post_fee - collater_amount_value) / tokenSharePrice[tokenShare]
    setCollateralOutput(collater_amount)
    setShareOutput(share_amount)
  }, [tokenShare, input, redeemFee])

  const getBtnRedeemText = () => {
    if (!connected) {
      return 'Connect Wallet'
    }
    if (input > 0) {
      if (input > balances[TOKEN['UPFI'].address]) {
        return 'Insufficient UPFI balance'
      }
    } else {
      return 'Enter amount'
    }
    return 'Redeem'
  }

  const getBtnRedeemStatus = () => {
    if (!connected) return 'enable'
    if (loading) return 'loading'
    if (
      input > 0 &&
      input <= balances[TOKEN['UPFI'].address] &&
      allowances[TOKEN['UPFI'].address] > input
    ) {
      return 'enable'
    }
    return 'disable'
  }

  async function enableToken(token_address: string) {
    try {
      setLoadingEnUpfi(true)
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
      setLoadingEnUpfi(true)
      getAllowance()
    }
  }

  const EnableUpfiBtn = () => {
    if (allowances[TOKEN['UPFI'].address] < input && connected) {
      return (
        <div className="btn-mint-redeem" style={{ marginTop: 32 }}>
          <PrimaryButton
            status={isLoadingEnUpfi ? 'loading' : 'enable'}
            action={() => {
              enableToken(TOKEN['UPFI'].address)
            }}
          >
            {'Enable UPFI'}
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
          <span>Input</span>
          <span
            onClick={() => {
              setInput(balances[TOKEN['UPFI'].address])
            }}
          >
            <span>{`Balance: ${balances[TOKEN['UPFI'].address] || 0}`}</span>
          </span>
        </div>
        <div className="input-number">
          <NumberFormat
            value={input}
            placeholder="0.0"
            className="flex-max number-format"
            onValueChange={(values) => {
              const { floatValue } = values
              setInput(floatValue)
            }}
          />
          <div className="center-vertical">
            {/* <span
              className="half"
              onClick={() => {
                setInput(balances[TOKEN['UPFI'].address] / 2)
              }}
            >
              Half
            </span> */}
            <img src={TOKEN['UPFI'].icon} className="input-logo" />
            <span className="token-name bold">{TOKEN['UPFI'].symbol}</span>
          </div>
        </div>
      </div>

      <img src={IcArrow} className="add-arrow-ic" />

      <div className="input-amount">
        <div className="input-top">
          <span>
            Output <span className="input-rate">{ecr}%</span>
          </span>
          <span> {`Balance: ${balances[TOKEN['USDC'].address] || 0}`}</span>
        </div>
        <div className="input-number">
          <NumberFormat
            value={collateralOutput}
            disabled
            className="flex-max number-format"
          />
          <div className="center-vertical">
            <img src={TOKEN['USDC'].icon} className="input-logo" />
            <span className="token-name bold">{TOKEN['USDC'].symbol}</span>
          </div>
        </div>
      </div>

      <img src={IcAdd} className="add-arrow-ic" />

      <div className="input-amount">
        <div className="input-top">
          <span>
            Output
            <span className="input-rate">{Number(100 - ecr).toFixed(4)}%</span>
          </span>
          <span>{`Balance: ${balances[TOKEN[tokenShare].address] || 0}`}</span>
        </div>
        <div className="input-number">
          <NumberFormat
            value={shareOutput}
            disabled
            className="flex-max number-format"
          />
          <div className="token-select">
            <img src={TOKEN[tokenShare].icon} className="input-logo" />
            <span className="token-name bold">{TOKEN[tokenShare].symbol}</span>
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
      <div className="stable-fees">
        <div>
          <span>Redemption fee</span>
          <span>{`${redeemFee}%`}</span>
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
      <EnableUpfiBtn />
      <div className="btn-mint-redeem" style={{ marginTop: 32 }}>
        <PrimaryButton
          status={getBtnRedeemStatus()}
          action={() => {
            if (connected) {
              redeem(
                input,
                shareOutput * (1 - slippage),
                collateralOutput * (1 - slippage),
                tokenShare,
              )
            } else {
              connect()
            }
          }}
        >
          {getBtnRedeemText()}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default Redeem
