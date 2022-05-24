import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, Tab, Tabs } from 'react-bootstrap'
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import "./trade.scss"
import { Order } from "../../models/models"
import { getChainImg, shortAddress, formatNumber, getTokenName, changeNetwork } from "../../util/util"
import HashModal from "../../components/Modal/HashModal"
import UnlockModal from "../../components/Modal/UnlockModal"
import { ethers } from 'ethers'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Trade = () => {
    const { account, chainName, approveSwap, getOrderList, createOrder, matchOrder, getSwapAddress, getBalance, unlockAsset } = useContext(Web3Context);
    const [orders, setOrders] = useState<Order[]>([]);
    const [unFilledOrders, setUnFilledOrders] = useState<Order[]>([]);
    const [myOrders, setMyOrders] = useState<Order[]>([]);
    const [filledOrders, setFilledOrders] = useState<Order[]>([]);
    const [modalShow, setModalShow] = useState(Boolean);
    const [unlockModalShow, setUnlockModalShow] = useState(Boolean);
    const [buyOrder, setBuyOrder] = useState<Order>(null);
    const [unlockOrder, setUnlockOrder] = useState<Order>(null);

    const notifyError = (msg) => toast.error(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    useEffect(() => {
        const fetchOrders = async () => {
            let orderList = await getOrderList()
            setOrders(orderList)
            setUnFilledOrders(orderList.filter((order) => { return (order.status == "Open" || order.status == "Locked") && order.sender !== account }))
            setFilledOrders(orderList.filter((order) => { return order.status == "Filled" }))
            setMyOrders(orderList.filter((order) => { return order.sender == account }))
        }
        fetchOrders();

        const timer = window.setInterval(async () => {
            fetchOrders()
        }, 2000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const onConfirmBuy = async (hashKey: string) => {
        console.log('onConfirmBuy hashKey', hashKey, 'buyOrder', buyOrder)
        setModalShow(false)
        try {
            await approveSwap(buyOrder.toTokenContract, getSwapAddress(chainName), buyOrder.toAmount.toString())
            await matchOrder(buyOrder.fromChainId, buyOrder.toChainId, +buyOrder.orderId.toString(), buyOrder.toTokenContract, buyOrder.toAmount, buyOrder.sender, hashKey)
        } catch (error) {
            console.log('error', error.data.message)
            notifyError(error.data.message)
        }
    }

    const onUnlock = async (hashKey: string) => {
        console.log('onUnlock  ', unlockOrder)
        setUnlockModalShow(false)
        let hash = ethers.utils.sha256(ethers.utils.solidityPack(["string"], [hashKey]))
        console.log(unlockOrder.hashlock, hash)
        if (unlockOrder.hashlock != hash) {
            notifyError("Unlock failed hash doesn't match!")
            return
        }
        await unlockAsset(unlockOrder.fromChainId, unlockOrder.toChainId, +unlockOrder.orderId.toString(), hashKey, unlockOrder.sender)
    }

    const actionBtn = (order) => {
        if (order.status == "Open") {
            return (
                <td className="text-center"> <button className='actionBtn' onClick={() => {
                    // if (order.sender == account) {
                    //     console.log('self trade')
                    //     notifyError("Self trade!")
                    //     return
                    // }

                    if (order.toChainId != chainName) {
                        changeNetwork(order.toChainId)
                    }
                    setBuyOrder(order)
                    setModalShow(true)
                }}>Buy</button></td>
            )
        }
        if (order.status == "Locked" && order.payee == account) {
            return (
                <td className="text-center" > <button className="actionBtn" onClick={() => { setUnlockOrder(order); setUnlockModalShow(true) }}>Unlock</button></td>
            )
        } else {
            // return (
            //     <td className="text-center" >   </td>
            // )
        }

        if (order.status == "Filled") {
            return (
                <td className="text-center" ></td>
            )
        }
        return (
            <td className="text-center" ></td>
        )
    }

    return (
        <div className='container'>
            <Tabs defaultActiveKey="market" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="market" title="Order Book">
                    <div className=' '>
                        <Table bordered hover borderless variant="dark">
                            <thead>
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Sender</th>
                                    <th className="text-center">Amount</th>
                                    <th className="text-center">From</th>
                                    <th className="text-center">To</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unFilledOrders.map((order: Order) => {
                                    return (
                                        <tr className="tableBody" key={order.orderId.toString() + order.fromChainId}>
                                            <td className="text-center">{order.orderId.toString()}</td>
                                            <td className="text-center">{shortAddress(order.sender)}</td>
                                            <td className="text-center"><span>{formatNumber(ethers.utils.formatEther(order.toAmount.toString()), 3)} {getTokenName(order.toTokenContract, order.toChainId)}</span></td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.fromChainId)}></img>{order.fromChainId}</span>}</td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.toChainId)}></img>{order.toChainId}</span>}</td>
                                            <td className="text-center">{order.status}</td>
                                            {actionBtn(order)}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
                <Tab eventKey="openOrder" title="My Order">
                    <div className=' '>
                        <Table bordered hover borderless variant="dark">
                            <thead>
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Sender</th>
                                    <th className="text-center">Amount</th>
                                    <th className="text-center">From</th>
                                    <th className="text-center">To</th>
                                    <th className="text-center">Status</th>
                                    {/* <th className="text-center">Operation</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {myOrders.map((order: Order) => {
                                    return (
                                        <tr className="tableBody" key={order.orderId.toString() + order.fromChainId}>
                                            <td className="text-center">{order.orderId.toString()}</td>
                                            <td className="text-center">{shortAddress(order.sender)}</td>
                                            <td className="text-center"><span>{formatNumber(ethers.utils.formatEther(order.toAmount.toString()), 3)} {getTokenName(order.toTokenContract, order.toChainId)}</span></td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.fromChainId)}></img>{order.fromChainId}</span>}</td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.toChainId)}></img>{order.toChainId}</span>}</td>
                                            <td className="text-center">{order.status}</td>
                                            {/* <td className="text-center"> <button className='actionBtn' onClick={() => { setBuyOrder(order); setModalShow(true) }}>Buy</button></td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Tab>

                <Tab eventKey="Recent Market Trades" title="Recent Market Trades">
                    <div className=' '>
                        <Table bordered hover borderless variant="dark">
                            <thead>
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Sender</th>
                                    <th className="text-center">Amount</th>
                                    <th className="text-center">From</th>
                                    <th className="text-center">To</th>
                                    <th className="text-center">Receiver</th>
                                    {/* <th className="text-center">Status</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {filledOrders.map((order: Order) => {
                                    return (
                                        <tr className="tableBody" key={order.orderId.toString() + order.fromChainId}>
                                            <td className="text-center">{order.orderId.toString()}</td>
                                            <td className="text-center">{shortAddress(order.sender)}</td>
                                            <td className="text-center"><span>{formatNumber(ethers.utils.formatEther(order.toAmount.toString()), 3)} {getTokenName(order.toTokenContract, order.toChainId)}</span></td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.fromChainId)}></img>{order.fromChainId}</span>}</td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.toChainId)}></img>{order.toChainId}</span>}</td>
                                            {/* <td className="text-center">{order.status}</td> */}
                                            <td className="text-center">{shortAddress(order.payee)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>

                </Tab>
            </Tabs>

            <ToastContainer />
            <HashModal showModal={modalShow} onHide={() => setModalShow(false)} onConfirm={(val) => onConfirmBuy(val)} />
            <UnlockModal showModal={unlockModalShow} onHide={() => setUnlockModalShow(false)} onConfirm={(val) => onUnlock(val)} />
        </div>
    )
}

export default Trade