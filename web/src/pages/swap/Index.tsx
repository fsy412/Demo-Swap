import { Container, Dropdown, Table, Row, Col, Toast, DropdownButton, InputGroup, FormGroup, FormControl } from "react-bootstrap"
import { useEffect, useState, useContext, useRef } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import "./index.scss"
import { ethers } from 'ethers'
import { CONFIG } from '../../config/chain'
import { Order } from "../../models/models"
import { Button } from "../../components/Button/Button"
import { formatNumber } from "../../util/format"
import { useDispatch, useSelector } from 'react-redux';
import { walletActions } from "../../redux/actions"
import { walletSelectors } from "../../redux/selectors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'

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

    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => {
            dispatch(walletActions.initialize());
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

    const onFromTokenSelect = (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let token = (e.target as HTMLInputElement).textContent;
        setFormAsset(token)
    }
    const onFromChainSelect = (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let chain = (e.target as HTMLInputElement).textContent;
        if (fromAsset != 'Select Token') {
            getBalance(fromAsset, chain).then((balance => {
                setFromBalance(formatNumber(ethers.utils.formatEther(balance.toString()), 3));
            })).catch(err => console.error(err))
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
            getBalance(fromAsset, chain).then((balance => {
                setToBalance(formatNumber(ethers.utils.formatEther(balance.toString()), 3));
            })).catch(err => console.error(err))
        }
        setToChainId(chain)
    }
    const onFromInputChange = (e) => {
        const value = e.target.value.replace(/[^\d]/, "");
        console.log(value)
        if (+value !== 0) {

        }
    }

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
    }

    const onBuyOrder = async (order) => {
        console.log('onBuyOrder', order)
        console.log('approveSwap', getSwapAddress(chainName), 'token', order.toTokenContract, 'orderId', order.orderId.toString(), 'amount', order.toAmount.toString())
        console.log('matchOrder', 'fromChainId:', order.fromChainId, 'toChainId', order.toChainId, 'orderId', +order.orderId.toString(), 'token', order.toTokenContract, 'amount', order.toAmount.toString())

        await approveSwap(order.toTokenContract, getSwapAddress(chainName), order.toAmount.toString())
        await matchOrder(order.fromChainId, order.toChainId, +order.orderId.toString(), order.toTokenContract, order.toAmount, order.sender)
    }

    const getTokenName = (address: string, chain: string) => {
        // console.log('address', address, 'chain', chain)
        let list = CONFIG.TokenList.filter(k => (k.Name === chain))[0]?.List
        let name
        if (list) {
            name = list.filter(k => (k.address === address))[0]?.name
        }
        return name
    }

    return (
        <Container className="container">
            <div className="selectionWrapper">
                <div className="title">
                    <span className="text">
                        Bridge Assets
                    </span>
                </div>
                <div className="SelectionBox" >
                    <div className="textBox">
                        <span className="textFrom">
                            Send
                        </span>
                        <span className="textBalance">
                            {/* Balance: {formatNumber(fromBalance, 3)} */}
                        </span>
                    </div>
                    <div className="inputBox">
                        {/* <div className="tokenSelect">
                            <div className="dropdownWrapper">
                                <Dropdown onSelect={onFromChainSelect}>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        <span className="spanChain"> {fromChainId}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#"><img className="chainIcon" src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"></img>RINKEBY</Dropdown.Item>
                                        <Dropdown.Item href=""><img className="chainIcon" src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"></img>BSCTEST</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                        </div> */}

                        <InputGroup className="mb-3 inputGroup">
                            <DropdownButton
                                variant="outline-secondary"
                                title={
                                    <span>
                                        <img src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg" /> BSCTEST
                                    </span>
                                }
                                id="input-group-dropdown-1"
                            >
                                <Dropdown.Item href="#">
                                    <div ><img src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg" /></div>
                                    <div>BSCTEST</div>
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    <div ><img src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg" /></div>
                                    <div>RINKEBY</div>
                                </Dropdown.Item>
                            </DropdownButton>
                            <FormControl aria-label="Text input with dropdown button" />
                            <DropdownButton
                                variant="outline-secondary"
                                  title={
                                    <span >
                                        <img src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png" /> BSCTEST
                                    </span>
                                }
                                id="input-group-dropdown-2"
                                align="end"
                            >
                                <Dropdown.Item href="#">DANT</Dropdown.Item>
                            </DropdownButton>
                        </InputGroup>

                        {/* 
                        <div className="inputWrapper">
                            <input ref={refFromAmount} className="inputControl" type="number" min="0" onChange={onFromInputChange} onWheel={event => event.currentTarget.blur()}></input>
                        </div>
                        <div className="selectWrapper">
                            <Dropdown onSelect={onFromTokenSelect}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    <span className="spanChain">{fromAsset}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item className="dropdownItem" href=""><img className="chanIcon" src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"></img>USDC</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div> */}


                    </div>
                </div>
                <div className="iconWrapper">
                    <div className="iconArrow">
                        <FontAwesomeIcon className="font" icon={faArrowDown} />
                        <FontAwesomeIcon className="font" icon={faArrowUp} />
                    </div>
                </div>


                <div className="SelectionBox" >
                    <div className="textBox">
                        <span className="textFrom">
                            Receive
                        </span>
                        <span className="textBalance">
                            {/* Balance: {toBalance} */}
                        </span>
                    </div>
                    <div className="inputBox">

                        <InputGroup className="mb-3">
                            <DropdownButton
                                variant="outline-secondary"
                                title={
                                    <span>
                                        <img src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg" /> BSCTEST
                                    </span>
                                }
                                id="input-group-dropdown-1"
                            >
                                <Dropdown.Item href="#">BSCTESTNET</Dropdown.Item>
                                <Dropdown.Item href="#">RINKEBY</Dropdown.Item>
                            </DropdownButton>
                            <FormControl aria-label="Text input with dropdown button" />
                            <DropdownButton
                                variant="outline-secondary"
                                title="DANT"
                                id="input-group-dropdown-2"
                                align="end"
                            >
                                <Dropdown.Item href="#">DANT</Dropdown.Item>
                            </DropdownButton>
                        </InputGroup>
                        {/* <div className="tokenSelect">
                            <div className="dropdownWrapper">
                                <Dropdown onSelect={onToChainSelect}>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        <span className="spanChain"> {toChainId}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#"><img className="chainIcon" src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"></img>RINKEBY</Dropdown.Item>
                                        <Dropdown.Item href=""><img className="chainIcon" src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"></img>BSCTEST</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="inputWrapper">
                            <input ref={refFromAmount} className="inputControl" type="number" min="0" onChange={onFromInputChange} onWheel={event => event.currentTarget.blur()}></input>
                        </div>
                        <div className="selectWrapper">
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    <span className="spanChain">{toAsset}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#">RINKEBY</Dropdown.Item>
                                    <Dropdown.Item href="#">BSCTESTNET</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div> */}
                    </div>
                </div>
                <div>
                    {/* <button className="createButton" onClick={onCreateOrder}>Create Order</button> */}
                    <Button display={"Create Order"} spinner={creatingOrder} onclick={onCreateOrder}></Button>
                </div>
            </div>
            <div>
                {/* <Table striped bordered hover variant="">
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
                                <tr key={order.orderId.toString() + order.fromChainId}>
                                    <td>{order.orderId.toString()}</td>
                                    <td>{getTokenName(order.tokenContract, order.fromChainId)}</td>
                                    <td>{order.fromChainId}</td>
                                    <td>{formatNumber(ethers.utils.formatEther(order.amount.toString()), 3)}</td>
                                    <td>{order.toChainId}</td>
                                    <td>{formatNumber(ethers.utils.formatEther(order.toAmount.toString()), 3)} {getTokenName(order.toTokenContract, order.toChainId)}</td>
                                    <td>{order.filled ? "Filled" : "Open"}</td>
                                    {order.filled ? <td></td> : <td className="buyButtonWrapper" > <button className="buyButton" onClick={() => onBuyOrder(order)}>Buy</button></td>}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table> */}
            </div>
        </Container>
    )
}
export default Swap