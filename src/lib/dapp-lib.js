'use strict';
import Blockchain from './blockchain';
import BN from "bn.js";   // Required for injected code

///+import

export default class DappLib {

  static get DAPP_STATE_CONTRACT() {
    return 'dappStateContract'
  }
  static get DAPP_CONTRACT() {
    return 'dappContract'
  }

  static get DAPP_RESULT_BIG_NUMBER() {
    return 'big-number'
  }
  static get DAPP_RESULT_TX_HASH() {
    return 'tx-hash'
  }


  /**
  * @dev Calls a read-only smart contract function
  */
  static async get(contract, action, account, ...data) {
    let blockchain = await Blockchain.init();
    let caller = typeof account === 'string' ? account : blockchain.accounts[account];
    let options = Object.assign({}, {
        from: caller
    });
    return {
      callAccount: caller,
      callData: await blockchain[contract]
                                .methods[action](...data)
                                .call(options)
    }
  }

  /**
  * @dev Calls a writeable smart contract function
  */
  static async post(contract, action, account, ...data) {
      let blockchain = await Blockchain.init();
      let caller = typeof account === 'string' ? account : blockchain.accounts[account];
      let options = Object.assign({}, {
          from: caller
      });
      return {
        callAccount: caller,
        callData: await blockchain[contract]
                                  .methods[action](...data)
                                  .send(options)
      }
  }

  static formatNumber(n) {
    var parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `<strong class="p-1 blue-grey-text number" style="font-size:1.1rem;">${parts.join(".")}</strong>`;
  }

  static formatAccount(a) {
      return `<strong class="green accent-1 p-1 blue-grey-text number" title="${a}">${a.substr(0,6)}...${a.substr(a.length-4, 4)}</strong>`;
  }

  static formatTxHash(a) {
    return `<strong class="teal lighten-5 p-1 blue-grey-text number" title="${a}">${a.substr(0,6)}...${a.substr(a.length-4, 4)}</strong>`;
  }

  ///+functions

}