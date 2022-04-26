import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, Tab, Tabs } from 'react-bootstrap'
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import "./trade.scss"
import { Order } from "../../models/models"

import { getChainImg, shortAddress } from "../../util/util"


const Trade = () => {
    const { account, chainName, approveSwap, getOrderList, createOrder, matchOrder, getSwapAddress, getBalance } = useContext(Web3Context);
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        setTimeout(() => {
            // dispatch(walletActions.initialize());
        }, 0);

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
                                {orders.map((order: Order) => {
                                    return (
                                        <tr className="tableBody" key={order.orderId.toString() + order.fromChainId}>
                                            <td className="text-center">{order.orderId.toString()}</td>
                                            <td className="text-center">{shortAddress(order.sender)}</td>
                                            <td className="text-center"><span>10 USDC</span></td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.fromChainId)}></img>{order.fromChainId}</span>}</td>
                                            <td className="text-center">{<span><img className='chainImg' src={getChainImg(order.toChainId)}></img>{order.toChainId}</span>}</td>
                                            <td className="text-center">{order.filled ? "Filled" : "Open"}</td>
                                            <td className="text-center"> <button className='actionBtn'>Buy</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
                <Tab eventKey="openOrder" title="Open Order">
                    {/* <Sonnet /> */}
                </Tab>

                <Tab eventKey="Recent Market Trades" title="Recent Market Trades">
                    {/* <Sonnet /> */}
                </Tab>
            </Tabs>


        </div>
    )
}

export default Trade