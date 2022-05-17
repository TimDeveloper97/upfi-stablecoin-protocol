import React, { useEffect, useState } from 'react'
import './index.less'
import Logo from '../../assets/image/logo.png'
import { useWallet } from '../../context/useWallet'
import { shortAddress } from '../../utils/Util'
import ButtonConnect from '../Button/ButtonConnect'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const [currentPage, setCurrentPage] = useState('home')
  let location = useLocation()

  usePageViews()

  function usePageViews() {
    useEffect(() => {
      switch (location.pathname) {
        case '/faucet':
          setCurrentPage('faucet')
          break
        case '/guide':
          setCurrentPage('guide')
          break
        default:
          setCurrentPage('home')
      }
    }, [location])
  }

  function getLinkClass(page: string) {
    if (page == currentPage) {
      return 'item-active'
    }
    return ''
  }

  return (
    <div className="header">
      <img className="logo" src={Logo} />
      <div className="header-item">
        <Link className={getLinkClass('home')} to={'/'}>
          Stablecoin
        </Link>
        <Link className={getLinkClass('faucet')} to={'/faucet'}>
          Faucet
        </Link>
        <Link className={getLinkClass('guide')} to={'/guide'}>
          Guide
        </Link>
      </div>
      <ButtonConnect />
    </div>
  )
}

export default Header
