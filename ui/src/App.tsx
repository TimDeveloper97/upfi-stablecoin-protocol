import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Redirect,
} from 'react-router-dom'
import Header from './component/header/Header'
import Faucet from './screen/faucet/Faucet'
import Guide from './screen/guide/Guide'

import StableCoin from './screen/stablecoin/StableCoin'

console.log = function no_console() { };


function App() {
  return (
    <Router>

    <div className="main">
      <div className="gradient-silky">
        <Header />
        <div className="app ">
            <Switch>
              <Route path={'/'} exact component={StableCoin} />
              <Route path={'/faucet'} component={Faucet} />
              <Route path={'/guide'} component={Guide} />

            </Switch>
        </div>
      </div>
    </div>
    </Router>

  )
}

export default App
