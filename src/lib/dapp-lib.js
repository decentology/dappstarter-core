'use strict';
import Blockchain from './blockchain';
import BN from 'bn.js';   // Required for injected code
import config from '../dapp-config.json';
import SvgIcons from '../dapp/components/widgets/svg-icons';

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
  static get DAPP_RESULT_BOOLEAN() {
    return 'boolean'
  }

  static formatHint(hint) {
    if (hint) {
      return `<p class="mt-3 grey-text"><strong>Hint:</strong> ${hint}</p>`;
    } else {
      return '';
    }
  }
  static formatNumber(n) {
    var parts = n.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `<strong class="p-1 blue-grey-text number copy-target" style="font-size:1.1rem;" title="${n}">${parts.join(".")}</strong>`;
  }

  static formatAccount(a) {
      return `<strong class="green accent-1 p-1 blue-grey-text number copy-target" title="${a}">${a.substr(0,6)}...${a.substr(a.length-4, 4)}</strong>${ DappLib.addClippy(a)}`;
  }

  static formatTxHash(a) {
    return `<strong class="teal lighten-5 p-1 blue-grey-text number copy-target" title="${a}">${a.substr(0,6)}...${a.substr(a.length-4, 4)}</strong>${ DappLib.addClippy(a)}`;
  }

  static formatBoolean(a) {
    return (a ? 'YES' : 'NO');
  }

  static addClippy(data) {
    let icon = SvgIcons.clippy;
    return icon.replace('<svg ', `<svg data-copy="${data}" `)
  }

  ///+functions

}