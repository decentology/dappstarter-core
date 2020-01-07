'use strict';
import { ethers } from 'ethers';
import DappMainContract from '../../build/contracts/DappMain.json';
import DappContract from '../../build/contracts/Dapp.json';
import Config from '../contract.json';
import Web3 from 'web3';
///+import

export default class DappLib {

  constructor(options) {
    this.options = options || {};
    this.options.network = this.options.network || 'localhost';

    let config = Config[this.options.network];

    this.web3 = {
      http: new Web3(new Web3.providers.HttpProvider(config.url)),
      ws: new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')))
    }

    this.dappMainContract = new this.web3.http.eth.Contract(DappMainContract.abi, config.dappMainContractAddress);
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
    self.dappMainContract.methods
      .isActive()
      .call({
        from: self.owner
      }, callback);
  }

  ///+functions

  /**
   * Generate Ethereum wallet
   * @returns {Wallet}
   */
  createWallet() {
    return ethers.Wallet.createRandom();
  }

}