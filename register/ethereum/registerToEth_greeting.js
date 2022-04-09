const Web3 = require('web3');
const ethereum = require('./ethereum');
const CONFIG = require('../config.json');
const web3 = new Web3('https://rinkeby.infura.io/v3/f6673495815e4dcbbd271ef93de098ec');
var Swap = require("../../build/contracts/Swap.json");

let PrivateKey = '0x43cde662689acde2dfb0519fdbe3892168b58e0a273176b0e5483d994c16bcff'
console.log("eth swap address:", CONFIG.ETH.SwapAddress)
console.log("crossChainContractAddress:", CONFIG.ETH.CrossChainContractAddress)

const swapContract = new web3.eth.Contract(Swap.abi, CONFIG.ETH.SwapAddress);

(async function init() {
  // destination chain name
  const destinationChainName = 'BSCTEST';
  const contractActionName = 'receiveGreeting';

  // greeting action each param type
  const actionParamsType = 'string,string,string,string';

  // greeting action each param name
  const actionParamsName = 'fromChain,title,content,date';

  // greeting action abi (receiveGreeting)
  const actionABI = '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}';
  // Set cross chain contract address
  await ethereum.sendTransaction(swapContract, 'setCrossChainContract', PrivateKey, [CONFIG.ETH.CrossChainContractAddress]);

  // Register contract info for sending messages to other chains
  await ethereum.sendTransaction(swapContract, 'registerDestnContract', PrivateKey, [contractActionName, destinationChainName, CONFIG.BSC.SwapAddress, contractActionName]);
  await ethereum.sendTransaction(swapContract, 'registerMessageABI', PrivateKey, [destinationChainName, CONFIG.BSC.SwapAddress, contractActionName, actionParamsType, actionParamsName]);

  // Register contract info for receiving messages from other chains.
  await ethereum.sendTransaction(swapContract, 'registerPermittedContract', PrivateKey, [destinationChainName, CONFIG.BSC.SwapAddress, contractActionName]);
  await ethereum.sendTransaction(swapContract, 'registerContractABI', PrivateKey, [contractActionName, actionABI]);
}());
