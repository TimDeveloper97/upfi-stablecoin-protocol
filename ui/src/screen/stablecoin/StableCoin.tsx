import React from 'react'
import './index.less'
import { useState } from 'react'
import NumberFormat from 'react-number-format'
import Logo from '../../assets/image/logo.png'
import { useEffect } from 'react'
import PrimaryButton from '../../component/Button/PrimaryButton'
import { BN } from 'bn.js'
import Mint from './Mint'
import Redeem from './Redeem'
import { CONTRACT } from '../../contracts/Contract'
import { ethers } from 'ethers'
import { useWallet } from '../../context/useWallet'
import { CONTRACTS_ADDRESS } from '../../contracts/Address'
import { ASSETS_ADDRESS, useBalances } from '../../context/useBalance'

const TOKEN_SHARE = ['BTC', 'ETH', 'ROSE', 'UPO']

const StableCoin = () => {
  const [tab, setTab] = useState(1)
  const [tcr, setTcr] = useState(0)
  const [ecr, setEcr] = useState(0)
  const [mintingFee, setmintingFee] = useState(0)
  const [redeemFee, setRedeemFee] = useState(0)
  const { address } = useWallet()
  const {getBalances} = useBalances()
  const [tokenSharePrice, setTokenSharePrice] = useState<{
    [symbol: string]: number
  }>({})
  const [loadingMint, setLoadingMint] = useState(false)
  const [loadingRedeem, setLoadingRedeem] = useState(false)

  async function fetchData() {
    let treasuryInfo = await CONTRACT.TREASURY.methods.info().call()
    console.log({ treasuryInfo }) // [usdcPrice, upfi_total_supply, tcr, ecr, mint_fee, redeem_fee]
    setTcr(Number(ethers.utils.formatUnits(treasuryInfo[2], '6')) * 100)
    setEcr(Number(ethers.utils.formatUnits(treasuryInfo[3], '6')) * 100)
    setmintingFee(Number(ethers.utils.formatUnits(treasuryInfo[4], '6')))
    setRedeemFee(Number(ethers.utils.formatUnits(treasuryInfo[5], '6')))
    let pool = await CONTRACT.MINT_REDEEM.methods.info().call()
    console.log({ pool })
    let prices = tokenSharePrice
    await Promise.all(
      TOKEN_SHARE.map(async (symbol) => {
        const price = await await CONTRACT.MINT_REDEEM.methods
          .getTokenSharePrice(symbol)
          .call()
        const price_number = Number(ethers.utils.formatUnits(price, '6'))
        prices[symbol] = price_number
      }),
    )
    setTokenSharePrice(prices)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const requestMint = async (
    collateralInput: number,
    shareInput: number,
    minAmountOut: number,
    tokenShare: string,
  ) => {
    console.log([
      ethers.utils.parseUnits(collateralInput.toString(), 18).toString(),
      ethers.utils.parseUnits(shareInput.toString(), 18).toString(),
      ethers.utils.parseUnits(minAmountOut.toString(), 18).toString(),
      tokenShare,
    ])
    setLoadingMint(true)
    try {
      const _collateral_amount = ethers.utils.parseUnits(collateralInput.toString(), 18).toString()
      const _share_amount = ethers.utils.parseUnits(shareInput.toString(), 18).toString()
      const _dollar_out_min = ethers.utils.parseUnits(minAmountOut.toString(), 18).toString()

      let price = await CONTRACT.MINT_REDEEM.methods.getTokenSharePrice(tokenShare).call()
      console.log({price})

      await CONTRACT.MINT_REDEEM.methods
        .mint(_collateral_amount, _share_amount, _dollar_out_min, tokenShare)
        .send({
          from: address,
          gas: 600000,
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
      setLoadingMint(false)
      getBalances()
    }
  }

  const requestRedeem = async (
    input: number,
    minShareOut: number,
    minCollaterOut: number,
    tokenShare: string,
  ) => {
    setLoadingRedeem(true)
    try {
      const _dollar_amount = ethers.utils.parseUnits(input.toString(), 18);
      const _share_out_min = ethers.utils.parseUnits(minShareOut.toString(), 18);
      const _collateral_out_min = ethers.utils.parseUnits(minCollaterOut.toString(), 18);

      await CONTRACT.MINT_REDEEM.methods
        .redeem(_dollar_amount, _share_out_min, _collateral_out_min, tokenShare)
        .send({
          from: address,
          gas: 600000,
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
      setLoadingRedeem(false)
      getBalances()
    }
  }

  return (
    <div className={'stable-content'}>
      <div className="stake-main">
        <div className="tabs">
          <div
            onClick={() => setTab(1)}
            className={tab === 1 ? 'tab tab-active' : 'tab'}
          >
            Mint
          </div>
          <div
            onClick={() => setTab(2)}
            className={tab === 2 ? 'tab tab-active' : 'tab'}
          >
            Redeem
          </div>
        </div>
        <div>
          {tab == 1 ? (
            <Mint
              tokenSharePrice={tokenSharePrice}
              loading={loadingMint}
              mintingFee={mintingFee}
              tcr={tcr}
              mint={(collateralInput: number, shareInput: number, minAmountOut: number, tokenShare: string) => {
                requestMint(
                  collateralInput,
                  shareInput,
                  minAmountOut,
                  tokenShare,
                )
              }}
            />
          ) : (
            <Redeem
              loading={loadingRedeem}
              tokenSharePrice={tokenSharePrice}
              ecr={ecr}
              redeemFee={redeemFee}
              redeem={(input: number, mintCollaterOut: number, minShareOut: number, tokenShare: string) => {
                requestRedeem(input, mintCollaterOut, minShareOut, tokenShare)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default StableCoin
