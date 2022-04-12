const Web3 = require('web3');
const bsc = require('./bsc');
const CONFIG = require('../config.json');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
var Swap = require("../../build/contracts/Swap.json");

let PrivateKey = '0x43cde662689acde2dfb0519fdbe3892168b58e0a273176b0e5483d994c16bcff'
console.log("bsc swap address:", CONFIG.BSC.SwapAddress)
console.log("crossChainContractAddress:", CONFIG.BSC.CrossChainContractAddress)

const swapContract = new web3.eth.Contract(Swap.abi, CONFIG.BSC.SwapAddress);

(async function init() {
  // destination chain name
  const destinationChainName = 'RINKEBY';
  // swap contract action name
  const contractActionName = 'receive_match_order';
  // swap action each param type
  // receive_match_order(uint256 order_id, address payee_address, address from_chain_payee, address from_chain_asset, uint256 amount, bytes32 hash)
  const actionParamsType = 'uint256|address|address|address|uint256|bytes32';
  // swap action each param name
  const actionParamsName = 'order_id|payee_address|from_chain_payee|from_chain_asset|amount|hash';
  // Set cross chain contract address
  await bsc.sendTransaction(swapContract, 'setCrossChainContract', PrivateKey, [CONFIG.BSC.CrossChainContractAddress]);

  // Register contract info for sending messages to other chains
  await bsc.sendTransaction(swapContract, 'registerDestnContract', PrivateKey, [contractActionName, destinationChainName, CONFIG.ETH.SwapAddress, contractActionName]);
  await bsc.sendTransaction(swapContract, 'registerMessageABI', PrivateKey, [destinationChainName, CONFIG.ETH.SwapAddress, contractActionName, actionParamsType, actionParamsName]);

  // Register contract info for receiving messages from other chains.
  const actionABI = '{"inputs":[{"internalType":"uint256","name":"order_id","type":"uint256"},{"internalType":"address","name":"payee_address","type":"address"},{"internalType":"address","name":"from_chain_payee","type":"address"},{"internalType":"address","name":"from_chain_asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"receive_match_order","outputs":[],"stateMutability":"nonpayable","type":"function"}';
  await bsc.sendTransaction(swapContract, 'registerPermittedContract', PrivateKey, [destinationChainName, CONFIG.ETH.SwapAddress, contractActionName]);
  await bsc.sendTransaction(swapContract, 'registerContractABI', PrivateKey, [contractActionName, actionABI]);

  //
  {
    const contractActionName = 'receive_transfer_asset';
    const actionParamsType = 'uint256|bytes32';
    const actionParamsName = 'order_id|hash';
    const actionABI = '{"inputs":[{"internalType":"uint256","name":"order_id","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"receive_transfer_asset","outputs":[],"stateMutability":"nonpayable","type":"function"}';

    // Register contract info for sending messages to other chains
    await bsc.sendTransaction(swapContract, 'registerDestnContract', PrivateKey, [contractActionName, destinationChainName, CONFIG.ETH.SwapAddress, contractActionName]);
    await bsc.sendTransaction(swapContract, 'registerMessageABI', PrivateKey, [destinationChainName, CONFIG.ETH.SwapAddress, contractActionName, actionParamsType, actionParamsName]);
    // Register contract info for receiving messages from other chains.
    await bsc.sendTransaction(swapContract, 'registerPermittedContract', PrivateKey, [destinationChainName, CONFIG.ETH.SwapAddress, contractActionName]);
    await bsc.sendTransaction(swapContract, 'registerContractABI', PrivateKey, [contractActionName, actionABI]);
  }
}());
