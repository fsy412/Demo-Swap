# Demo Swap

This is an simple swap demo based on Dante protocol stack.

## Usage

Dependencies:
* @dante-contracts
* [@openzeppelin-contracts v4.4.2](https://github.com/OpenZeppelin/openzeppelin-contracts)
* [@truffle/hdwallet-provider v2.0.0](https://www.npmjs.com/package/@truffle/hdwallet-provider)

### Install
```
npm install -g truffle
npm install -d
```

### Compile smart contract
```
truffle compile
```

### Deploy smart contract to Avalanche FUJI testnet
```
truffle migrate --network avalancheFuji --reset --skip-dry-run
```