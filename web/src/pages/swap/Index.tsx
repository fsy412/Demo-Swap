import { Container, Dropdown, Table, Row, Col, Toast, DropdownButton, InputGroup, FormGroup, FormControl } from "react-bootstrap"
import { useEffect, useState, useContext, useRef } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import "./index.scss"
import { ethers } from 'ethers'
import { CONFIG } from '../../config/chain'
import { Order } from "../../models/models"
import { Button } from "../../components/Button/Button"
// import { Selection } from "../../components/Selection/Selection"
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
        <Container className="container-fluid swap">
            <div className="selectionWrapper">
                <div className="title">
                    <span className="text">
                        Bridge Assets
                    </span>
                </div>


                <div className="selectionGroup">
                    <div className="fromGroup">
                        <div className="textFrom">
                            <span>From</span>
                        </div>
                        <div className="dropdownWrapper">
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
                        </div>
                    </div>

                    <div className="SelectionBox" >
                        <div className="balanceInfo">
                            <div>
                                <span>
                                    Send
                                </span>
                            </div>
                            <div>
                                <span>
                                    max
                                </span>
                            </div>
                        </div>
                        <div className="selectionWrapper">
                            <div>
                                <div className="inputWrapper"><input /></div>
                            </div>
                            <div className="menuWrapper">
                                <div className="menu">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title="Dropdown"
                                        id="input-group-dropdown-2"
                                        align="end"
                                    >
                                        <Dropdown.Item href="#">Action</Dropdown.Item>
                                        <Dropdown.Item href="#">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">Separated link</Dropdown.Item>
                                    </DropdownButton></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="direction"><img src="https://cbridge.celer.network/static/media/arrowupdown.963b18ea.svg" /></div>

                <div className="selectionGroup">
                    <div className="fromGroup">
                        <div className="textFrom">
                            <span>To</span>
                        </div>
                        <div className="dropdownWrapper">
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
                        </div>
                    </div>

                    <div className="SelectionBox" >
                        <div className="balanceInfo">
                            <div>
                                <span>
                                    Send
                                </span>
                            </div>
                            <div>
                                <span>
                                    max
                                </span>
                            </div>
                        </div>
                        <div className="selectionWrapper">
                            <div>
                                <div className="inputWrapper"><input /></div>
                            </div>
                            <div className="menuWrapper">
                                <div className="menu">
                                    <DropdownButton
                                        variant="outline-secondary"
                                        title="Dropdown"
                                        id="input-group-dropdown-2"
                                        align="end"
                                    >
                                        <Dropdown.Item href="#">Action</Dropdown.Item>
                                        <Dropdown.Item href="#">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item href="#">Separated link</Dropdown.Item>
                                    </DropdownButton></div>
                            </div>
                        </div>
                    </div>
                </div>

                <Button display={"Create Order"} spinner={creatingOrder} onclick={onCreateOrder}></Button>





            </div>
        </Container>
    )
}
export default Swap