const Web3 = require('web3');
const ethereum = require('./ethereum');
const CONFIG = require('../config.json');
const web3 = new Web3('https://rinkeby.infura.io/v3/f6673495815e4dcbbd271ef93de098ec');
var Swap = require("../../build/contracts/Swap.json");

let PrivateKey = '0x43cde662689acde2dfb0519fdbe3892168b58e0a273176b0e5483d994c16bcff'
console.log("eth swap address:", CONFIG.ETH.SwapAddress)
console.log("crossChainContractAddress:", CONFIG.ETH.CrossChainContractAddress)

const swapContract = new web3.eth.Contract(Swap.abi, CONFIG.ETH.SwapAddress);

async function registerAction(destinationChainName, contractActionName, actionParamsType, actionParamsName, actionABI) {
  // Set cross chain contract address
  await ethereum.sendTransaction(swapContract, 'setCrossChainContract', PrivateKey, [CONFIG.ETH.CrossChainContractAddress]);
  // Register contract info for sending messages to other chains
  await ethereum.sendTransaction(swapContract, 'registerDestnContract', PrivateKey, [contractActionName, destinationChainName, CONFIG.BSC.SwapAddress, contractActionName]);
  await ethereum.sendTransaction(swapContract, 'registerMessageABI', PrivateKey, [destinationChainName, CONFIG.BSC.SwapAddress, contractActionName, actionParamsType, actionParamsName]);
  // Register contract info for receiving messages from other chains.
  const actionABI = '{"inputs":[{"internalType":"uint256","name":"order_id","type":"uint256"},{"internalType":"address","name":"payee_address","type":"address"},{"internalType":"address","name":"from_chain_payee","type":"address"},{"internalType":"address","name":"from_chain_asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"receive_match_order","outputs":[],"stateMutability":"nonpayable","type":"function"}';
  await ethereum.sendTransaction(swapContract, 'registerPermittedContract', PrivateKey, [destinationChainName, CONFIG.BSC.SwapAddress, contractActionName]);
  await ethereum.sendTransaction(swapContract, 'registerContractABI', PrivateKey, [contractActionName, actionABI]);
}

(async function init() {
  // destination chain name
  const destinationChainName = 'BSCTEST';
  // swap contract action name
  const contractActionName = 'receive_match_order';
  // swap action each param type
  // receive_match_order(uint256 order_id, address payee_address, address from_chain_payee, address from_chain_asset, uint256 amount, bytes32 hash)
  const actionParamsType = 'uint256|address|address|address|uint256|bytes32';
  // swap action each param name
  const actionParamsName = 'order_id|payee_address|from_chain_payee|from_chain_asset|amount|hash';
  // Set cross chain contract address
  await ethereum.sendTransaction(swapContract, 'setCrossChainContract', PrivateKey, [CONFIG.ETH.CrossChainContractAddress]);

  // Register contract info for sending messages to other chains
  await ethereum.sendTransaction(swapContract, 'registerDestnContract', PrivateKey, [contractActionName, destinationChainName, CONFIG.BSC.SwapAddress, contractActionName]);
  await ethereum.sendTransaction(swapContract, 'registerMessageABI', PrivateKey, [destinationChainName, CONFIG.BSC.SwapAddress, contractActionName, actionParamsType, actionParamsName]);

  // Register contract info for receiving messages from other chains.
  const actionABI = '{"inputs":[{"internalType":"uint256","name":"order_id","type":"uint256"},{"internalType":"address","name":"payee_address","type":"address"},{"internalType":"address","name":"from_chain_payee","type":"address"},{"internalType":"address","name":"from_chain_asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"receive_match_order","outputs":[],"stateMutability":"nonpayable","type":"function"}';
  await ethereum.sendTransaction(swapContract, 'registerPermittedContract', PrivateKey, [destinationChainName, CONFIG.BSC.SwapAddress, contractActionName]);
  await ethereum.sendTransaction(swapContract, 'registerContractABI', PrivateKey, [contractActionName, actionABI]);
}());
