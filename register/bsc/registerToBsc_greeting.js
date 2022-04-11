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
  // greeting contract action name
  const contractActionName = 'receiveGreeting';

  // greeting action each param type
  const actionParamsType = 'string|string|string|string';

  // greeting action each param name
  const actionParamsName = 'fromChain|title|content|date';

  // greeting action abi (receiveGreeting)
  const actionABI = '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}';

  // Set cross chain contract address
  await bsc.sendTransaction(swapContract, 'setCrossChainContract', PrivateKey, [CONFIG.BSC.CrossChainContractAddress]);

  // Register contract info for sending messages to other chains
  await bsc.sendTransaction(swapContract, 'registerDestnContract', PrivateKey, [contractActionName, destinationChainName, CONFIG.ETH.SwapAddress, contractActionName]);
  await bsc.sendTransaction(swapContract, 'registerMessageABI', PrivateKey, [destinationChainName, CONFIG.ETH.SwapAddress, contractActionName, actionParamsType, actionParamsName]);

  // Register contract info for receiving messages from other chains.
  await bsc.sendTransaction(swapContract, 'registerPermittedContract', PrivateKey, [destinationChainName, CONFIG.ETH.SwapAddress, contractActionName]);
  await bsc.sendTransaction(swapContract, 'registerContractABI', PrivateKey, [contractActionName, actionABI]);
}());
