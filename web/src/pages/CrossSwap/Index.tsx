import { Container, Dropdown, Table, Row, Col } from "react-bootstrap"
import "./index.scss"
import { useEffect, useState, useContext } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import { ethers } from 'ethers'
import { CONFIG } from '../../config/chain'
import { Order } from "../../models/models"

const Swap = () => {
    const { account, getChainName, approveSwap, getOrderList, createOrder } = useContext(Web3Context);
    const [formChainId, setFormChainId] = useState('');
    const [formAsset, setFormAsset] = useState('');
    const [toChainId, setToChainId] = useState('');
    const [toAsset, setToAsset] = useState('');
    const [swapAddress, setSwapAddress] = useState('');
    const [fromAmount, setFromAmount] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            let orderList = await getOrderList()
            console.log(orderList)
            setOrders(orderList)
        }
        // console.log(orders)
        fetchOrders();

        const timer = window.setInterval(async () => {
            console.log('tick')
            let orderList = await getOrderList()
            setOrders(orderList)
        }, 2000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    // useEffect(() => {
    //     if (orderCount > 0) {
    //         const fetchOrders = async () => {
    //             let orderList = await getOrderList(BscSwapAddress)
    //             orderList.map((order) => {
    //                 setOrders([...orders, order])
    //             })
    //         }
    //         console.log(orders)
    //         fetchOrders();
    //     }
    // }, [orderCount]);

    const onCreateOrder = async () => {
        console.log('onCreateOrder')
        // approve swap 
        let amount = ethers.utils.parseEther('1')
        await approveSwap(CONFIG.BSC.USDCAddress, CONFIG.BSC.SwapAddress, amount)
        console.log('approve done')
        // create order
        let chain_from = "BSC"
        let asset_from = CONFIG.BSC.USDCAddress
        let amount_from = ethers.utils.parseEther('1')
        let chain_to = "ETH" // ethereum rinkeby
        let asset_to = CONFIG.ETH.USDCAddress
        let amount_to = ethers.utils.parseEther('1')

        console.log('createOrder start')
        await createOrder(chain_from, asset_from, amount_from, chain_to, asset_to, amount_to)
    }

    const onBuyOrder = async (order) => {
        console.log('onBuyOrder', order)
        // approve swap 
        let amount = ethers.utils.parseEther(order.amount)
        console.log('1111', amount)
        await approveSwap(CONFIG.ETH.USDCAddress, CONFIG.ETH.SwapAddress, amount)
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
                        <input className="inputControl" type="text"></input>
                    </div>
                    <div className="selectWrapper">
                        <Dropdown className="tokenSelect">
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                Select Token
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href="#/action-1"> <img className="icon" src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"></img> USDC        </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="tokenSelect">
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                Select Chain
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href="#/action-1"> <img className="icon" src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"></img> Ethereum        </Dropdown.Item>
                                <Dropdown.Item className="dropdownItem" href="#/action-1"> <img className="icon" src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"></img> BSC        </Dropdown.Item>
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
                        <input className="inputControl" type="text"></input>
                    </div>
                    <div className="selectWrapper">
                        <Dropdown className="tokenSelect">
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                Select Token
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href="#/action-1"> <img className="icon" src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"></img> USDC        </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="tokenSelect">
                            <Dropdown.Toggle className="dropdownToggle" id="dropdown-basic">
                                Select Chain
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdownMenu">
                                <Dropdown.Item className="dropdownItem" href="#/action-1"> <img className="icon" src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"></img> Ethereum        </Dropdown.Item>
                                <Dropdown.Item className="dropdownItem" href="#/action-1"> <img className="icon" src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"></img> BSC        </Dropdown.Item>
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
                                <tr key={order.createTime.toString()}>
                                    <td>{order.createTime.toString()}</td>
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