import { Container, Dropdown, Table, Row, Col } from "react-bootstrap"
import { useEffect, useState, useContext } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import "./index.scss"
import { ethers } from 'ethers'
import { CONFIG } from '../../config/chain'
import { Order } from "../../models/models"

const Swap = () => {
    const { account, chainName, approveSwap, getOrderList, createOrder, matchOrder, getSwapAddress } = useContext(Web3Context);
    const [formChainId, setFormChainId] = useState('Select Chain');
    const [formAsset, setFormAsset] = useState('Select Token');
    const [fromAmount, setFromAmount] = useState(0);

    const [toChainId, setToChainId] = useState('Select Chain');
    const [toAsset, setToAsset] = useState('Select Token');
    const [toAmount, setToAmount] = useState(0);

    const [orders, setOrders] = useState<Order[]>([]);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            let orderList = await getOrderList()
            setOrders(orderList)
        }
        fetchOrders();

        const timer = window.setInterval(async () => {
            let orderList = await getOrderList()
            setOrders(orderList)
        }, 2000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const onFromTokenSelect = (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let token = (e.target as HTMLInputElement).textContent;
        setFormAsset(token)
    }
    const onFromChainSelect = (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let chain = (e.target as HTMLInputElement).textContent;
        setFormChainId(chain)
    }
    const onToTokenSelect = (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let token = (e.target as HTMLInputElement).textContent;
        setToAsset(token)
    }
    const onToChainSelect = (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let chain = (e.target as HTMLInputElement).textContent;
        setToChainId(chain)
    }
    const onFromInputChange = (e) => { console.log('onFromInputChange') }

    const onToInputChange = (e) => { console.log('onToInputChange') }
 
    const getFromAssetAddress = () => {
        let list = CONFIG.TokenList.filter(k => (k.Name === chainName))[0].List
        let tokenAddress = list.filter(k => (k.name == formAsset))[0].address;
        // console.log(`token:${formAsset} address:${tokenAddress}, chain:${chainName}`)
        return tokenAddress
    }
    const getToAssetAddress = () => {
        let list = CONFIG.TokenList.filter(k => (k.Name === chainName))[0].List
        let tokenAddress = list.filter(k => (k.name == formAsset))[0].address;
        // console.log(`token:${formAsset} address:${tokenAddress}, chain:${chainName}`)
        return tokenAddress
    }

    const onCreateOrder = async () => {
        console.log('onCreateOrder')
        console.log('from asset:', getFromAssetAddress(), 'from chain:', formChainId)
        console.log('to asset:', getToAssetAddress(), 'to chain:', toChainId)
        console.log('swap address:', getSwapAddress(chainName))
        // approve swap 
        let amount = ethers.utils.parseEther('1')
        await approveSwap(getToAssetAddress(), getSwapAddress(chainName), amount)
        console.log('approve done')
        // create order
        let chain_from = formChainId
        let asset_from = getFromAssetAddress()
        let amount_from = ethers.utils.parseEther('1')
        let chain_to = toChainId
        let asset_to = getToAssetAddress()
        let amount_to = ethers.utils.parseEther('1')

        console.log('createOrder start')
        await createOrder(chain_from, asset_from, amount_from, chain_to, asset_to, amount_to)

        return
        // TEST
        // approve swap 
        // let amount = ethers.utils.parseEther('1')
        // await approveSwap(CONFIG.BSC.USDCAddress, CONFIG.BSC.SwapAddress, amount)
        // console.log('approve done')
        // // create order
        // let chain_from = "BSCTEST"
        // let asset_from = CONFIG.BSC.USDCAddress
        // let amount_from = ethers.utils.parseEther('1')
        // let chain_to = "RINKEBY" // ethereum rinkeby
        // let asset_to = CONFIG.ETH.USDCAddress
        // let amount_to = ethers.utils.parseEther('1')

        // console.log('createOrder start')
        // await createOrder(chain_from, asset_from, amount_from, chain_to, asset_to, amount_to)
    }

    const onBuyOrder = async (order) => {
        console.log('swap address', getSwapAddress(chainName), 'token', order.tokenContract, 'orderId', order.orderId.toString(), 'amount', order.amount.toString())
        await approveSwap(order.toTokenContract, getSwapAddress(chainName), order.amount.toString())
        await matchOrder(order.fromChainId, order.toChainId, +order.orderId.toString(), order.toTokenContract, order.amount)
    }
    return (
        <Container className="container">
            <div className="SelectionBox" >
                <div className="textBox">
                    <span className="textFrom">
                        From
                    </span>
                    <span className="textBalance">
                        Balance 2.3
                    </span>
                </div>
                <div className="inputBox">
                    <div className="inputWrapper">
                        <input className="inputControl" type="number" onChange={onFromInputChange}></input>
                    </div>
                    <div className="selectWrapper">
                        <Dropdown className="tokenSelect" onSelect={onFromTokenSelect}>
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                {formAsset}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href=""><img className="icon" src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"></img>USDC</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="tokenSelect" onSelect={onFromChainSelect}>
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                {formChainId}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href=""><img className="icon" src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"></img>RINKEBY</Dropdown.Item>
                                <Dropdown.Item className="dropdownItem" href=""><img className="icon" src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"></img>BSCTEST</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className="SelectionBox" >
                <div className="textBox">
                    <span className="textFrom">
                        To
                    </span>
                    <span className="textBalance">
                        Balance
                    </span>
                </div>
                <div className="inputBox">
                    <div className="inputWrapper">
                        <input className="inputControl" type="number" onChange={onToInputChange}></input>
                    </div>
                    <div className="selectWrapper">
                        <Dropdown className="tokenSelect" onSelect={onToTokenSelect}>
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                {toAsset}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href=""><img className="icon" src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"></img>USDC</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="tokenSelect" onSelect={onToChainSelect}>
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                {toChainId}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href=""><img className="icon" src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"></img>RINKEBY</Dropdown.Item>
                                <Dropdown.Item className="dropdownItem" href=""><img className="icon" src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"></img>BSCTEST</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div>
                <button className="createButton" onClick={onCreateOrder}>Create Order</button>
            </div>

            <div>
                <Table striped bordered hover variant="">
                    <thead className="tableHeader">
                        <tr>
                            <th>Id</th>
                            <th>Coin</th>
                            <th>Amount</th>
                            <th>From Chain</th>
                            <th>To Chain</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        {orders.map((order: Order) => {
                            return (
                                <tr key={order.orderId.toString()}>
                                    <td>{order.orderId.toString()}</td>
                                    <td>USDC</td>
                                    <td>{+order.amount.toString() / 10 ** 18}</td>
                                    <td>{order.fromChainId}</td>
                                    <td>{order.toChainId}</td>
                                    <td className="buyButtonWrapper" ><button className="buyButton" onClick={() => onBuyOrder(order)}>Buy</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </Container>
    )
}
export default Swap