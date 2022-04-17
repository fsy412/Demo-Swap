import { Container, Dropdown, Table, Row, Col, Toast } from "react-bootstrap"
import { useEffect, useState, useContext, useRef } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import "./index.scss"
import { ethers } from 'ethers'
import { CONFIG } from '../../config/chain'
import { Order } from "../../models/models"
import { Button } from "../../components/Button/Button"
import { formatNumber } from "../../util/format"

const Swap = () => {
    const { account, chainName, approveSwap, getOrderList, createOrder, matchOrder, getSwapAddress, getBalance } = useContext(Web3Context);
    const [fromChainId, setFormChainId] = useState('Select Chain');
    const [fromAsset, setFormAsset] = useState('Select Token');
    const [fromBalance, setFromBalance] = useState('0');

    const [toChainId, setToChainId] = useState('Select Chain');
    const [toAsset, setToAsset] = useState('Select Token');
    const [toBalance, setToBalance] = useState('0');

    const [orders, setOrders] = useState<Order[]>([]);
    const refFromAmount = useRef<HTMLInputElement>(null);
    const refToAmount = useRef<HTMLInputElement>(null);
    const [creatingOrder, setCreatingOrder] = useState(Boolean);

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
    const onFromChainSelect = async (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let chain = (e.target as HTMLInputElement).textContent;
        if (fromAsset != 'Select Token') {
            let balance = await getBalance(fromAsset, chain)
            setFromBalance(formatNumber(ethers.utils.formatEther(balance.toString()), 3));
        }
        setFormChainId(chain)
    }
    const onToTokenSelect = (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let token = (e.target as HTMLInputElement).textContent;
        setToAsset(token)
    }
    const onToChainSelect = async (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let chain = (e.target as HTMLInputElement).textContent;
        if (toAsset != 'Select Token') {
            let balance = await getBalance(toAsset, chain);
            setToBalance(formatNumber(ethers.utils.formatEther(balance.toString()), 3));
        }
        setToChainId(chain)
    }
    const onFromInputChange = (e) => { }

    const onToInputChange = (e) => { }

    const getFromAssetAddress = () => {
        let list = CONFIG.TokenList.filter(k => (k.Name === chainName))[0].List
        let tokenAddress = list.filter(k => (k.name == fromAsset))[0].address;
        // console.log(`token:${formAsset} address:${tokenAddress}, chain:${chainName}`)
        return tokenAddress
    }
    const getToAssetAddress = () => {
        let list = CONFIG.TokenList.filter(k => (k.Name === toChainId))[0].List
        let tokenAddress = list.filter(k => (k.name == toAsset))[0].address;
        // console.log(`token:${formAsset} address:${tokenAddress}, chain:${chainName}`)
        return tokenAddress
    }

    const onCreateOrder = async () => {
        setCreatingOrder(true)
        console.log('onCreateOrder')
        console.log('from asset:', getFromAssetAddress(), ' chain:', fromChainId, 'amount:', refFromAmount.current?.value)
        console.log('to asset:', getToAssetAddress(), ' chain:', toChainId, 'amount:', refToAmount.current?.value)
        console.log('swap address:', getSwapAddress(chainName))

        // approve swap 
        let amount = ethers.utils.parseEther(refFromAmount.current?.value)
        await approveSwap(getFromAssetAddress(), getSwapAddress(chainName), amount)
        console.log('approve done')
        // create order
        let chain_from = fromChainId
        let asset_from = getFromAssetAddress()
        let amount_from = amount
        let chain_to = toChainId
        let asset_to = getToAssetAddress()
        let amount_to = ethers.utils.parseEther(refToAmount.current?.value)

        console.log('createOrder start')
        await createOrder(chain_from, asset_from, amount_from, chain_to, asset_to, amount_to)
        setCreatingOrder(false)
        return
        // TEST
        // setCreatingOrder(true)
        // let amount = ethers.utils.parseEther('1')
        // await approveSwap(CONFIG.BSC.USDCAddress, CONFIG.BSC.SwapAddress, amount)
        // console.log('approve done')
        // // create order
        // let chain_from = "BSCTEST"
        // let asset_from = CONFIG.BSC.USDCAddress
        // let chain_to = "RINKEBY" // ethereum rinkeby
        // let asset_to = CONFIG.ETH.USDCAddress
        // let amount_to = ethers.utils.parseEther('1')

        // console.log('createOrder start')
        // await createOrder(chain_from, asset_from, amount, chain_to, asset_to, amount_to)
        // setCreatingOrder(false)
    }

    const onBuyOrder = async (order) => {
        console.log('onBuyOrder', order)
        console.log('swap address', getSwapAddress(chainName), 'token', order.tokenContract, 'orderId', order.orderId.toString(), 'amount', order.amount.toString())
        await approveSwap(order.toTokenContract, getSwapAddress(chainName), order.amount.toString())
        await matchOrder(order.fromChainId, order.toChainId, +order.orderId.toString(), order.toTokenContract, order.amount)
    }

    const getTokenName = (address: string, chain: string) => {
        let list = CONFIG.TokenList.filter(k => (k.Name === chain))[0].List
        let name = list.filter(k => (k.address === address))[0]?.name
        return name
    }

    return (
        <Container className="container">
            <div className="SelectionBox" >
                <div className="textBox">
                    <span className="textFrom">
                        From
                    </span>
                    <span className="textBalance">
                        Balance: {formatNumber(fromBalance, 3)}
                    </span>
                </div>
                <div className="inputBox">
                    <div className="inputWrapper">
                        <input ref={refFromAmount} className="inputControl" type="number" onChange={onFromInputChange}></input>
                    </div>
                    <div className="selectWrapper">
                        <Dropdown className="tokenSelect" onSelect={onFromTokenSelect}>
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                {fromAsset}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href=""><img className="icon" src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"></img>USDC</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="tokenSelect" onSelect={onFromChainSelect}>
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                {fromChainId}
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
                        Balance: {toBalance}
                    </span>
                </div>
                <div className="inputBox">
                    <div className="inputWrapper">
                        <input ref={refToAmount} className="inputControl" type="number" onChange={onToInputChange}></input>
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
                {/* <button className="createButton" onClick={onCreateOrder}>Create Order</button> */}
                <Button display={"Create Order"} spinner={creatingOrder} onclick={onCreateOrder}></Button>
            </div>
            <div>
                <Table striped bordered hover variant="">
                    <thead className="tableHeader">
                        <tr>
                            <th>Id</th>
                            <th>Coin</th>
                            <th>From Chain</th>
                            <th>Amount</th>
                            <th>To Chain</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="tableBody">
                        {orders.map((order: Order) => {
                            return (
                                <tr key={order.orderId.toString()}>
                                    <td>{order.orderId.toString()}</td>
                                    <td>{getTokenName(order.tokenContract, order.fromChainId)}</td>
                                    <td>{order.fromChainId}</td>
                                    <td>{formatNumber(ethers.utils.formatEther(order.amount.toString()), 3)}</td>
                                    <td>{order.toChainId}</td>
                                    <td>{formatNumber(ethers.utils.formatEther(order.toAmount.toString()), 3)} {getTokenName(order.toTokenContract, order.toChainId)}</td>
                                    <td>{order.filled ? "Filled" : "Open"}</td>
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