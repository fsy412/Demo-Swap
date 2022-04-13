import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route } from 'react-router-dom'
import Web3Context, { Web3Provider } from './context/Web3Context';
import Swap from './pages/swap/Index'
import PageHead from "./components/PageHead/PageHead"
import Faucet from "./pages/faucet/faucet"

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <BrowserRouter>
          <PageHead></PageHead>
          <Route path="/" exact component={() => <Swap />} />
          <Route path="/faucet" exact component={() => <Faucet />} />
        </BrowserRouter>
      </Web3Provider>
    </div>
  )
}

export default App
