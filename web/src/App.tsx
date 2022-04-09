import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route } from 'react-router-dom'
import Web3Context, { Web3Provider } from './context/Web3Context';
import Swap from './pages/CrossSwap/Index'
import PageHead from "./components/PageHead/PageHead"

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <BrowserRouter>
          <PageHead></PageHead>
          <Route path="/" exact component={() => <Swap />} />
        </BrowserRouter>
      </Web3Provider>
    </div>
  )
}

export default App
