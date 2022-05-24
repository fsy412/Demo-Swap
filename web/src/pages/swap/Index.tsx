import { Container, Dropdown, Table, Row, Col, Toast, DropdownButton, InputGroup, FormGroup, FormControl } from "react-bootstrap"
import { useEffect, useState, useContext, useRef } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import "./index.scss"
import { ethers } from 'ethers'
import { CONFIG } from '../../config/chain'
import { Order } from "../../models/models"
import { Button } from "../../components/Button/Button"
import Selection from "../../components/Selection/Selection"
import { formatNumber } from "../../util/util"
import { useDispatch, useSelector } from 'react-redux';
import { walletActions } from "../../redux/actions"
import { walletSelectors } from "../../redux/selectors";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changeNetwork } from "../../util/util"

const Swap = () => {
    const { account, chainName, approveSwap, getOrderList, createOrder, matchOrder, getSwapAddress, getBalance } = useContext(Web3Context);
    const [fromChainId, setFormChainId] = useState('BSCTEST');
 
    const [fromAsset, setFormAsset] = useState('DANT');
    const [fromBalance, setFromBalance] = useState('0');

    const [toChainId, setToChainId] = useState('RINKEBY');
    const [toAsset, setToAsset] = useState('DANT');
 
    const [toBalance, setToBalance] = useState('0');

    const [orders, setOrders] = useState<Order[]>([]);
    const refFromAmount = useRef<HTMLInputElement>(null);
    const refToAmount = useRef<HTMLInputElement>(null);
    const [creatingOrder, setCreatingOrder] = useState<boolean>(false);
    const [disableCreate, setDisableCreate] = useState<boolean>(true);

    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [createBtnTxt, setCreateBtnTxt] = useState('Create Order');

    const notify = (msg) => toast.success(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifyError = (msg) => toast.error(msg, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

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
        console.log("onFromTokenSelect", token)
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
    const onToChainSelect = async (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let chain = (e.target as HTMLInputElement).textContent;
        setToChainId(chain)
    }
    const onFromInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        const re = /^[0-9\b]+$/;
        console.log(val, e.currentTarget.validity.valid)
        setDisableCreate(false)
        setFromAmount(val)
        setToAmount(val)
    }

    const onToInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        const re = /^[0-9\b]+$/;
        console.log(val, e.currentTarget.validity.valid)
        setDisableCreate(false)
        setFromAmount(val)
        setToAmount(val)
    }

    const getFromAssetAddress = () => {
        console.log('fromAsset', fromAsset, 'chain', chainName)
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

    // const changeNetwork = (name) => {
    //     if (name == "BSCTEST") {
    //         window.ethereum.request({
    //             method: "wallet_addEthereumChain",
    //             params: [{
    //                 chainId: '0x61',
    //                 rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    //                 chainName: "Binance Smart Chain Testnet",
    //                 nativeCurrency: {
    //                     name: "BNB",
    //                     symbol: "TBNB",
    //                     decimals: 18
    //                 },
    //                 blockExplorerUrls: ["https://testnet.bscscan.com"]
    //             }]
    //         });
    //     } else {
    //         window.ethereum.request({
    //             method: "wallet_switchEthereumChain",
    //             params: [{
    //                 chainId: '0x4',
    //             }]
    //         });
    //     }
    // }

    const onCreateOrder = async () => {
        // if (fromChainId !== chainName) {
        //     changeNetwork(chainName)
        // }
        setCreatingOrder(true)
        console.log('onCreateOrder')
        console.log('from asset:', getFromAssetAddress(), ' chain:', fromChainId, 'amount:', fromAmount)
        console.log('to asset:', getToAssetAddress(), ' chain:', toChainId, 'amount:', toAmount)
        console.log('swap address:', getSwapAddress(chainName))

        // approve swap 
        setCreateBtnTxt("Approving")
        let amount = ethers.utils.parseEther(fromAmount.toString())
        approveSwap(getFromAssetAddress(), getSwapAddress(chainName), amount).then(() => {
            // create order
            let chain_from = fromChainId
            let asset_from = getFromAssetAddress()
            let amount_from = amount
            let chain_to = toChainId
            let asset_to = getToAssetAddress()
            let amount_to = ethers.utils.parseEther(toAmount)
            setCreateBtnTxt("Creating Order")
            createOrder(chain_from, asset_from, amount_from, chain_to, asset_to, amount_to).then(() => {
                setCreatingOrder(false)
                notify('Order Created')
                setCreateBtnTxt("Create Order")
            }).catch(e => {
                notifyError(e.message)
                setCreateBtnTxt("Create Order")
                setCreatingOrder(false)
            })
        }).catch(e => {
            notifyError(e.message);
            setCreateBtnTxt("Create Order")
            setCreatingOrder(false)
        })
    }
    const onChangeDir = () => {
        console.log(chainName, fromChainId)
        if (chainName === fromChainId) {
            changeNetwork(toChainId)
        }
        let toChainId_ = toChainId
        setToChainId(fromChainId)
        setFormChainId(toChainId_)
    }
    const onFromBalance = () => {
        getBalance(fromAsset, fromChainId).then((balance => {
            // console.log(formatNumber(ethers.utils.formatEther(balance.toString()), 3))
            setFromAmount(formatNumber(ethers.utils.formatEther(balance.toString()), 3))
        })).catch(err => console.error(err))
    }
    const onToBalance = () => {
        getBalance(toAsset, toChainId).then((balance => {
            // console.log(formatNumber(ethers.utils.formatEther(balance.toString()), 3))
            setToAmount(formatNumber(ethers.utils.formatEther(balance.toString()), 3))
        })).catch(err => console.error(err))
    }

    return (
        <Container className="container-fluid swap">
            <ToastContainer />
            <div className="selectionWrapper">
                <div className="title">
                    <span className="text">
                        Swap Assets
                    </span>
                </div>
                <Selection dir={"from"} onSelectChain={onFromChainSelect} onTokenSelect={onFromTokenSelect} chain={fromChainId} setInput={onFromInputChange} amount={fromAmount} onMaxClick={onFromBalance} />
                <div className="direction"><img src="https://cbridge.celer.network/static/media/arrowupdown.963b18ea.svg" onClick={onChangeDir} /></div>
                <Selection dir={"to"} onSelectChain={onToChainSelect} onTokenSelect={onToTokenSelect} chain={toChainId} setInput={onToInputChange} amount={toAmount} onMaxClick={onToBalance} />
                <Button display={createBtnTxt} spinner={creatingOrder} onclick={onCreateOrder} disable={disableCreate}></Button>
 
            </div>
            <div className="tip">
                <a href="https://github.com/dantenetwork/Demo-Swap/blob/dev/tutorial.md" target="_blank" className='tip'>How to use</a>
 
            </div>
        </Container>
    )
}
export default Swap