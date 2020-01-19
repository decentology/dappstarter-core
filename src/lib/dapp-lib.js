'use strict';
import Blockchain from './blockchain';
import BN from "bn.js";

///+import

export default class DappLib {

  static get DAPP_STATE_CONTRACT() {
    return 'dappStateContract'
  }
  static get DAPP_CONTRACT() {
    return 'dappContract'
  }

  ///+functions


  static async get(contract, action, account, ...data) {
    let blockchain = await Blockchain.init();
    let options = Object.assign({}, {
        from: typeof account === 'string' ? account : blockchain.accounts[account]
    });
    return await blockchain[contract].methods[action](...data).call(options);
  }

  static async post(contract, action, account, ...data) {
      let blockchain = await Blockchain.init();
      let options = Object.assign({}, {
          from: typeof account === 'string' ? account : blockchain.accounts[account]
      });
      console.log(blockchain.accounts, options);
      return await blockchain[contract].methods[action](...data).send(options);
  }

  static formatNumber(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
}