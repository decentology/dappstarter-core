'use strict';
const Blockchain = require( './blockchain');
const dappConfig = require( './dapp-config.json');
const ClipboardJS = require( 'clipboard');
const BN = require('bn.js'); // Required for injected code
const manifest = require('../manifest.json');
///+import

module.exports = class DappLib {

///+functions


/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DAPP LIBRARY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static get DAPP_STATE_CONTRACT() {
        return 'dappStateContract'
    }
    static get DAPP_CONTRACT() {
        return 'dappContract'
    }

    static get DAPP_STATE_CONTRACT_WS() {
        return 'dappStateContractWs'
    }
    static get DAPP_CONTRACT_WS() {
        return 'dappContractWs'
    }

    static get DAPP_RESULT_BIG_NUMBER() {
        return 'big-number'
    }

    static get DAPP_RESULT_ACCOUNT() {
        return 'account'
    }

    static get DAPP_RESULT_TX_HASH() {
        return 'tx-hash'
    }

    static get DAPP_RESULT_IPFS_HASH_ARRAY() {
        return 'ipfs-hash-array'
    }

    static get DAPP_RESULT_SIA_HASH_ARRAY() {
        return 'sia-hash-array'
    }

    static get DAPP_RESULT_ARRAY() {
        return 'array'
    }

    static get DAPP_RESULT_OBJECT() {
        return 'object'
    }

    static get DAPP_RESULT_STRING() {
        return 'string'
    }

    static get DAPP_RESULT_ERROR() {
        return 'error'
    }

    static async addEventHandler(contract, event, params, callback) {
            Blockchain.handleEvent({
                config: DappLib.getConfig(),
                contract: contract,
                params: params || {}
            }, 
            event, 
            (error, result) => {
                                if (error) {
                                    callback({
                                        event: event,
                                        type: DappLib.DAPP_RESULT_ERROR,
                                        label: 'Error Message',
                                        result: error
                                    });    
                                } else {
                                    callback({
                                        event: event,
                                        type: DappLib.DAPP_RESULT_OBJECT,
                                        label: 'Event ' + event,
                                        result: DappLib.getObjectNamedProperties(result)
                                    });    
                                }
                            }
            );
    }

    static getTransactionHash(t) {
        if (!t) { return ''; }
        let value = '';
        if (typeof t === 'string') {                
            value = t;
        } else if (typeof t === 'object') {    
            if (t.hasOwnProperty('transactionHash')) {
                    value = t.transactionHash;       // Ethereum                
            } else {
                value = JSON.stringify(t);
            }
        }
        return value;
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
        return `<strong class="green accent-1 p-1 blue-grey-text number copy-target" title="${a}">${DappLib.toCondensed(a, 6, 4)}</strong>${ DappLib.addClippy(a)}`;
    }

    static formatTxHash(a) {
        let value = DappLib.getTransactionHash(a);
        return `<strong class="teal lighten-5 p-1 blue-grey-text number copy-target" title="${value}">${DappLib.toCondensed(value, 6, 4)}</strong>${ DappLib.addClippy(value)}`;
    }

    static formatBoolean(a) {
        return (a ? 'YES' : 'NO');
    }

    static formatText(a, copyText) {
        if (!a) { return; }
        if (a.startsWith('<')) {
            return a;
        }
        return `<span class="copy-target" title="${copyText ? copyText : a}">${a}</span>${DappLib.addClippy(copyText ? copyText : a)}`;
    }

    static formatStrong(a) {
        return `<strong>${a}</strong>`;
    }

    static formatPlain(a) {
        return a;
    }

    static formatObject(a) {
        let data = [];
        let labels = [ 'Item', 'Value' ];
        let keys = [ 'item', 'value' ];
        let formatters = [ 'Strong', 'Text-20-5' ]; // 'Strong': Bold, 'Text-20-5': Compress a 20 character long string down to 5
        let reg = new RegExp('^\\d+$'); // only digits
        for(let key in a) {
            if (!reg.test(key)) {
                data.push({
                    item: key.substr(0,1).toUpperCase() + key.substr(1),
                    value: a[key]
                });
            }
        }
        return DappLib.formatArray(data, formatters, labels, keys);
    }

    static formatArray(h, dataFormatters, dataLabels, dataKeys) {

        let output = '<table class="table table-striped">';

        if (dataLabels) {
            output += '<thead><tr>';
            for(let d=0; d<dataLabels.length; d++) {
                output += `<th scope="col">${dataLabels[d]}</th>`;
            }    
            output += '</tr></thead>';
        }
        output += '<tbody>';
        h.map((item) => {
            output += '<tr>';
            for(let d=0; d<dataFormatters.length; d++) {
                let text = String(dataKeys && dataKeys[d] ? item[dataKeys[d]] : item);
                let copyText =  dataKeys && dataKeys[d] ? item[dataKeys[d]] : item;
                if (text.startsWith('<')) {
                    output += (d == 0 ? '<th scope="row">' : '<td>') + text + (d == 0 ? '</th>' : '</td>');
                } else {
                    let formatter = 'format' + dataFormatters[d];
                    if (formatter.startsWith('formatText')) {
                        let formatterFrags = formatter.split('-');
                        if (formatterFrags.length === 3) {
                            text = DappLib.toCondensed(text, Number(formatterFrags[1]), Number(formatterFrags[2]));
                        } else if (formatterFrags.length === 2) {
                            text = DappLib.toCondensed(text, Number(formatterFrags[1]));
                        }
                        formatter = formatterFrags[0];    
                    }
                    output += (d == 0 ? '<th scope="row">' : '<td>') + DappLib[formatter](text, copyText) + (d == 0 ? '</th>' : '</td>');                        
                }
            }    
            output += '</tr>';
        })
        output += '</tbody></table>';
        return output;
    }

    static getFormattedResultNode(retVal, key) {

        let returnKey = 'result';
        if (key && (key !== null) && (key !== 'null') && (typeof(key) === 'string')) {
            returnKey = key;
        }
        let formatted = '';
        switch (retVal.type) {
            case DappLib.DAPP_RESULT_BIG_NUMBER:
                formatted = DappLib.formatNumber(retVal[returnKey].toString(10));
                break;
            case DappLib.DAPP_RESULT_TX_HASH:
                formatted = DappLib.formatTxHash(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_ACCOUNT:
                formatted = DappLib.formatAccount(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_BOOLEAN:
                formatted = DappLib.formatBoolean(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_IPFS_HASH_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey],
                    ['TxHash', 'IpfsHash', 'Text-10-5'], //Formatter
                    ['Transaction', 'IPFS URL', 'Doc Id'], //Label
                    ['transactionHash', 'ipfsHash', 'docId'] //Values
                );
                break;
            case DappLib.DAPP_RESULT_SIA_HASH_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey],
                    ['TxHash', 'SiaHash', 'Text-10-5'], //Formatter
                    ['Transaction', 'Sia URL', 'Doc Id'], //Label
                    ['transactionHash', 'docId', 'docId'] //Values
                );
                break;
            case DappLib.DAPP_RESULT_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey],
                    retVal.formatter ? retVal.formatter : ['Text'],
                    null,
                    null
                );
                break;
            case DappLib.DAPP_RESULT_STRING:
                formatted = DappLib.formatPlain(
                    retVal[returnKey]
                );
                break;
            case DappLib.DAPP_RESULT_OBJECT:
                formatted = DappLib.formatObject(retVal[returnKey]);
                break;
            default:
                formatted = retVal[returnKey];
                break;
        }

        let resultNode = document.createElement('div');
        resultNode.className = `note text-xs ${retVal.type === DappLib.DAPP_RESULT_ERROR ? 'bg-red-400' : 'bg-green-400'} m-3 p-3`; 
        let closeMarkup = '<div class="float-right" onclick="this.parentNode.parentNode.removeChild(this.parentNode)" title="Dismiss" class="text-right mb-1 mr-2" style="cursor:pointer;">X</div>';    
        resultNode.innerHTML = closeMarkup + `${retVal.type === DappLib.DAPP_RESULT_ERROR ? '☹️' : '👍️'} ` + (Array.isArray(retVal[returnKey]) ? 'Result' : retVal.label) + ': ' + formatted + DappLib.formatHint(retVal.hint);
        // Wire-up clipboard copy
        new ClipboardJS('.copy-target', {
            text: function (trigger) {
                return trigger.getAttribute('data-copy');
            }
        });

        return resultNode;
    }

    static getObjectNamedProperties(a) {
        let reg = new RegExp('^\\d+$'); // only digits
        let newObj = {};
        for(let key in a) {
            if (!reg.test(key)) {
                newObj[key] = a[key];
            }
        }
        return newObj;
    }
    
    static addClippy(data) {
        return `
        <svg data-copy="${data}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 22.1 23.5" style="enable-background:new 0 0 22.1 23.5;cursor:pointer;" class="copy-target" width="19px" height="20.357px" xml:space="preserve">
        <style type="text/css">
            .st99{fill:#777777;stroke:none;stroke-linecap:round;stroke-linejoin:round;}
        </style>
        <path class="st99" d="M3.9,17.4h5.4v1.4H3.9V17.4z M10.7,9.2H3.9v1.4h6.8V9.2z M13.4,13.3v-2.7l-4.1,4.1l4.1,4.1V16h6.8v-2.7H13.4z
             M7.3,12H3.9v1.4h3.4V12z M3.9,16h3.4v-1.4H3.9V16z M16.1,17.4h1.4v2.7c0,0.4-0.1,0.7-0.4,1c-0.3,0.3-0.6,0.4-1,0.4H2.6
            c-0.7,0-1.4-0.6-1.4-1.4V5.2c0-0.7,0.6-1.4,1.4-1.4h4.1c0-1.5,1.2-2.7,2.7-2.7s2.7,1.2,2.7,2.7h4.1c0.7,0,1.4,0.6,1.4,1.4V12h-1.4
            V7.9H2.6v12.2h13.6V17.4z M3.9,6.5h10.9c0-0.7-0.6-1.4-1.4-1.4h-1.4c-0.7,0-1.4-0.6-1.4-1.4s-0.6-1.4-1.4-1.4S8,3.1,8,3.8
            S7.4,5.2,6.6,5.2H5.3C4.5,5.2,3.9,5.8,3.9,6.5z"/>
        </svg>
        `;
    }

    static getAccounts() {
        let accounts = dappConfig.accounts;
        return accounts;
    }

    static fromAscii(str, padding) {

        if (Array.isArray(str)) {
            return DappLib.arrayToHex(str);
        }

        if (str.startsWith('0x') || !padding) {
            return str;
        }

        if (str.length > padding) {
            str = str.substr(0, padding);
        }

        var hex = '0x';
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }
        return hex + '0'.repeat(padding*2 - hex.length + 2);
    };


    static toAscii(hex) {
        var str = '',
            i = 0,
            l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i+=2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if (code === 0) continue; // this is added
            str += String.fromCharCode(code);
        }
        return str;
    };
    
    static arrayToHex(bytes) {
        if (Array.isArray(bytes)) {
            return '0x' + 
                Array.prototype.map.call(bytes, function(byte) {
                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
                }).join('')
        } else {
            return bytes;
        }
    }
    
    static hexToArray(hex) {
        if ((typeof hex === 'string') && (hex.beginsWith('0x'))) {
            let bytes = [];
            for (let i = 0; i < hex.length; i += 2) {
              bytes.push(parseInt(hex.substr(i, 2), 16));
            }
            return bytes;
        } else {
            return hex;
        }
    }

    static toCondensed(s, begin, end) {
        if (!s) { return; }
        if (s.length && s.length <= begin + end) {
            return s;
        } else {
            if (end) {
                return `${s.substr(0, begin)}...${s.substr(s.length-end, end)}`;
            } else {
                return `${s.substr(0, begin)}...`;
            }
        }
    }

    static getManifest() {
        return manifest;
    }

    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static getUniqueId() {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    static getConfig() {
        return dappConfig;
    }

    // Return value of this function is used to dynamically re-define getConfig()
    // for use during testing. With this approach, even though getConfig() is static
    // it returns the correct contract addresses as its definition is re-written
    // before each test run. Look for the following line in test scripts to see it done:
    //  DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);
    static getTestConfig(testDappStateContract, testDappContract, testAccounts) {

        return Object.assign(
            {}, 
            dappConfig,
            {
                dappStateContractAddress: testDappStateContract.address,
                dappContractAddress: testDappContract.address,
                accounts: testAccounts,
                owner: testAccounts[0],
                admins: [
                    testAccounts[1],
                    testAccounts[2],
                    testAccounts[3]
                ],
                users: [
                    testAccounts[4],
                    testAccounts[5],
                    testAccounts[6],
                    testAccounts[7],
                    testAccounts[8]
                ]
///+test
            }
        );
    }

}