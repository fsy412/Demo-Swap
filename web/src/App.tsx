import 'bootstrap/dist/css/bootstrap.min.css'
import "./App.css"
import { BrowserRouter, Route } from 'react-router-dom'
import Web3Context, { Web3Provider } from './context/Web3Context';
import Swap from './pages/swap/Index'
import PageHead from "./components/PageHead/PageHead"
import Footer from "./components/Footer/Footer"
import Faucet from "./pages/faucet/faucet"
import { Provider } from 'react-redux';
import store from "./redux/store"
import Trade from './pages/trade/trade';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Web3Provider>
          <BrowserRouter>
            <PageHead></PageHead>
            <Route path="/" exact component={() => <Swap />} />
            <Route path="/trade" exact component={() => <Trade />} />
            <Route path="/faucet" exact component={() => <Faucet />} />
            <Footer></Footer>
          </BrowserRouter>
        </Web3Provider>
      </Provider>
    </div>
  )
}

export default App
