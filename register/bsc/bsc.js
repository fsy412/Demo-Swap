const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-2-s2.binance.org:8545');
web3.eth.handleRevert = true;

const chainId = 97;// testnet

module.exports = {
  // sign the transaction with the pk
  async sendTransaction(targetContract, methodName, accountPrivateKey, arguments) {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(accountPrivateKey).address;  // export the pk
      // console.log('account', account)
      const to = targetContract.options.address;
      const nonce = web3.utils.numberToHex(await web3.eth.getTransactionCount(account));  //  generate nonce
      const data = targetContract.methods[methodName].apply(targetContract.methods, arguments).encodeABI();  // encode ABI
      const gas = 2100000;
      let gasPrice = await web3.eth.getGasPrice();
      gasPrice = 50000000000;
      // prepare transaction data
      const tx = { account, to, chainId, data, nonce, gasPrice, gas };
      // console.log(tx);
      // sign the transaction
      let signTx = await web3.eth.accounts.signTransaction(tx, accountPrivateKey);
      let ret = await web3.eth.sendSignedTransaction(signTx.rawTransaction);
      console.log('gasUsed: ' + methodName + ' ' + ret.gasUsed);
      return ret;
    } catch (e) {
      console.error(e);
    }
  },
  // query info from blockchain node
  async contractCall(targetContract, method, arguments) {
    let methodObj = targetContract.methods[method].apply(targetContract.methods, arguments);
    let ret = await methodObj.call({});
    return ret;
  }
}