import React, { useState, createContext, useEffect } from 'react';
import { ethers, Contract, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Token from "../contract/Token.json"
import Swap from "../contract/Swap.json"
import { getContract } from "../contract/index"
import { CONFIG } from '../config/chain'

const Web3Context = createContext(null);

export const Web3Provider = (props: any) => {
  const [account, setAccount] = useState('');
  const [signer, setSigner] = useState(null);
  const [blockchainId, setBlockchainId] = useState(0);
  const [chainName, setChainName] = useState('');

  const getChainSwapAddress = (chainId) => {
    if (chainId == CONFIG.BSC.Name) {
      return CONFIG.BSC.SwapAddress
    } else if (chainId == CONFIG.ETH.Name) {
      return CONFIG.ETH.SwapAddress
    }
  }

  const functionsToExport = {
    connectWallet: () => { },
    approveSwap: async (erc20, swap, amount) => { },
    getOrderList: (swapAddress) => { },
    createOrder: async (chainFrom, asset_from, amountFrom, chainTo, assetTo, amountTo) => { },
    matchOrder: async (fromChainId, chainId, orderId, asset, amount) => { },
    getSwapAddress: (chainId) => { },
  }

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const { chainId } = await provider.getNetwork();
        setBlockchainId(chainId);
        (chainId == 97) ? setChainName("BSCTEST") : setChainName("RINKEBY")
        // const addresses = await provider.listAccounts();
        // if (addresses.length) {
        //   setAccount(addresses[0]);
        // } else {
        //   return;
        // }
      }
    };
    checkConnection();
  }, [blockchainId]);

  functionsToExport.connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const { chainId } = await provider.getNetwork()

      setBlockchainId(chainId)
      setAccount(userAddress);
      setSigner(signer);
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.approveSwap = async (tokenAddress, swapAddress, amount) => {
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
    const transaction = await contract.approve(swapAddress, amount);
    await transaction.wait()
  };

  functionsToExport.getOrderList = async () => {
    let provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-2-s2.binance.org:8545");
    const contract = new ethers.Contract(CONFIG.BSC.SwapAddress, Swap.abi, provider)
    let orderList = await contract.query_all_orders()
    // console.log('getOrderList bsc orders', orderList)

    {
      let provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/f6673495815e4dcbbd271ef93de098ec");
      const contract = new ethers.Contract(CONFIG.ETH.SwapAddress, Swap.abi, provider)
      let orders = await contract.query_all_orders()
      // console.log('getOrderList eth orders', orders)
      orderList = orderList.concat(orders)
    }
    return orderList
  };

  // function create_order(uint256 chain_from, address asset_from, uint256 amount_from, uint256 chain_to, address asset_to, uint amount_to) public returns (bool) {
  functionsToExport.createOrder = async (chainFrom, assetFrom, amountFrom, chainTo, assetTo, amountTo) => {
    let swapContract = getContract(getChainSwapAddress(chainFrom), Swap.abi)
    const transaction = await swapContract.create_order(chainFrom, assetFrom, amountFrom, chainTo, assetTo, amountTo)
    await transaction.wait()
  };

  functionsToExport.matchOrder = async (fromChainId, chainId, orderId, asset, amount) => {
    console.log("matchOrder", 'from chain:', fromChainId, 'current chain:', chainId, 'orderId', orderId, 'asset:', asset, 'amount:', amount.toString())
    let swapContract = getContract(getChainSwapAddress(chainId), Swap.abi)
    const transaction = await swapContract.match_order(fromChainId, orderId, asset, amount.toString())
    await transaction.wait()
  };

  functionsToExport.getSwapAddress = (chainId) => {
    return getChainSwapAddress(chainId);
  };

  return (<Web3Context.Provider value={{ account, chainName, ...functionsToExport }}>
    {props.children}
  </Web3Context.Provider>)
}

export default Web3Context;
