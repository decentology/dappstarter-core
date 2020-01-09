'use strict';
import DappStateContract from '../../build/contracts/DappState.json';
import DappContract from '../../build/contracts/Dapp.json';
import Config from '../dapp-config.json';
import Web3 from 'web3';
///+import

export default class DappLib {

  constructor(options) {
    
    let config = options || Config;

    this.web3 = {
      http: new Web3(new Web3.providers.HttpProvider(config.url)),
      ws: new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')))
    }

    this.dappStateContract = new this.web3.http.eth.Contract(DappStateContract.abi, config.dappStateContractAddress);
    this.dappContract = new this.web3.http.eth.Contract(DappContract.abi, config.dappContractAddress);
    this.owner = null;
    this.initialize();

  }

  initialize() {
    let self = this;
    self.web3.http.eth.getAccounts((error, accts) => {
      self.owner = accts[0];
      self.accounts = accts;
    });
  }

  isActive(callback) {
    let self = this;
    self.dappStateContract.methods
      .isActive()
      .call({
        from: self.owner
      }, callback);
  }

  ///+functions

}