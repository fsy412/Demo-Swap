const Web3 = require('web3');
const fs = require('fs');
const avalanche = require('./avalanche');

const web3 = new Web3('https://data-seed-prebsc-2-s2.binance.org:8545');
const crossChainContractAddress = '0x27ED6b8E928Fb7d393EBE4C1ddBc353424a5F3ae';
const ethSwapContractAddress = '0x';

// Test account
let testAccountPrivateKey = '0x43cde662689acde2dfb0519fdbe3892168b58e0a273176b0e5483d994c16bcff'

// Greeting smart contract address
import {CONFIG} from  "./address"
const bscSwapContractAddress = CONFIG.bscSwapContractAddress

// Load contract abi, and init greeting contract object
const swapRawData = fs.readFileSync('../../build/contracts/Greetings.json');
const swapAbi = JSON.parse(greetingRawData).abi;
const swapContract = new web3.eth.Contract(swapAbi, bscSwapContractAddress);

(async function init() {
  // destination chain name
  const destinationChainName = 'ETH';

  // swap contract action name
  const contractActionName = 'match_order';

  // swap action each param type
  const actionParamsType = 'string,uint256,address,address,uint,bytes32';

  // swap action each param name
  const actionParamsName = 'chain_id,order_id,payee_address,asset,amount,hash';

  // greeting action abi (receiveGreeting)
  const actionABI = '{"inputs":[{"name":"fromChain","type":"string"},{"name":"title","type":"string"},{"name":"content","type":"string"},{"name":"date","type":"string"}],"name":"receiveGreeting","type":"function"}';

  // Set cross chain contract address
  await avalanche.sendTransaction(swapContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);

  // Register contract info for sending messages to other chains
  await avalanche.sendTransaction(greetingContract, 'registerDestnContract', testAccountPrivateKey, [destinationChainName, ethSwapContractAddress, contractActionName]);
  await avalanche.sendTransaction(greetingContract, 'registerMessageABI', testAccountPrivateKey, [destinationChainName, ethSwapContractAddress, contractActionName, actionParamsType, actionParamsName]);

  // Register contract info for receiving messages from other chains.
  // await avalanche.sendTransaction(greetingContract, 'registerPermittedContract', testAccountPrivateKey, [destinationChainName, nearGreetingContractAddress, contractActionName]);
  // await avalanche.sendTransaction(greetingContract, 'registerContractABI', testAccountPrivateKey, [contractActionName, actionABI]);
}());
