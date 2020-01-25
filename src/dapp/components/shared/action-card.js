import DappLib from '../../../lib/dapp-lib';
import CustomElement from './custom-element';
import WaitWidget from '../widgets/wait-widget';
import SvgIcons from '../widgets/svg-icons';
import ClipboardJS from 'clipboard';

import DOM from './dom';

export default class ActionCard extends CustomElement {

    static get ATTRIBUTE_ACTION() {
        return 'action'
    }
    static get ATTRIBUTE_METHOD() {
        return 'method'
    }
    static get ATTRIBUTE_FIELDS() {
        return 'fields'
    }
    static get ATTRIBUTE_MESSAGE() {
        return 'message'
    }
    static get observedAttributes() {
        return ActionCard.attributes; 
    }

    static get attributes() {
        return [
            ActionCard.ATTRIBUTE_ACTION,
            ActionCard.ATTRIBUTE_METHOD,
            ActionCard.ATTRIBUTE_FIELDS,
            ActionCard.ATTRIBUTE_MESSAGE
        ];
    }

    constructor(...args) {
        super(ActionCard.attributes, ...args);
        self.clicked = false;
    }

    static content(me) {
        return `
    <div class="card">
    <div class="white-text card-header aqua-gradient d-flex justify-content-between align-items-center">
        <h5>${me.title}</h5>
        <span class="text-right circle-icon">${ me[ActionCard.ATTRIBUTE_METHOD] === ActionCard.METHOD_POST ? SvgIcons.readWrite : SvgIcons.readOnly }</span>
    </div>
    <div class="${ me.innerHTML.indexOf('<') > -1 ? 'card-body-padded' : 'card-body'}" id="card-body-${me.action}">
        ${me.innerHTML}
    </div>
    <div class="rounded-bottom grey lighten-2 pt-2 pb-2 pr-2">
        <div class="row pl-2 pr-2">
            <div class="col-lg-8 d-flex align-items-center">
                <wait-widget size="50" title="${me[ActionCard.ATTRIBUTE_DESCRIPTION]}" waiting-title="${me[ActionCard.ATTRIBUTE_MESSAGE] || 'Waiting for transaction'}"></wait-widget>
            </div>
            <div class="col-lg-4 text-right">
                <button id="button-${me[ActionCard.ATTRIBUTE_ACTION]}" class="${me[ActionCard.ATTRIBUTE_METHOD].indexOf(ActionCard.METHOD_POST) > -1 ? (me[ActionCard.ATTRIBUTE_METHOD] === ActionCard.METHOD_POST ? 'btn-warning btn-deep-orange' : 'btn-danger') : 'btn-info'} btn Ripple-parent">${ (me[ActionCard.ATTRIBUTE_METHOD] ? me[ActionCard.ATTRIBUTE_METHOD] : 'Go').toUpperCase()}</button>
            </div>
        </div>
    </div>
    </div>
`
    }


    render() {
        let self = this;
        self.innerHTML = ActionCard.content(self); 
        self.className = 'col-lg-8 col-md-10 col-sm-12 mb-5';
        if (self.action) {
            document.querySelector(`#button-${self[ActionCard.ATTRIBUTE_ACTION]}`).addEventListener('click', async () => {

                 if (self.clicked === true) { return; }

                // Remove prior results or error messages
                self.querySelectorAll(`#card-result-${self.action}`).forEach(e => e.parentNode.removeChild(e));

                if (DappLib[self.action]) {

                    self.clicked = true;
                    self.querySelector('wait-widget').waiting = true;
                        // Capture values of all fields of interest
                    let values = {};
                    let fields = self.fields.split(' ');
                    let validFields = 0;
                    fields.map((field) => {
                        if (field) {
                            validFields++;
                            let fieldElement = self.querySelector(`[data-field=${field}]`);
                            if (fieldElement) {
                                if (fieldElement.type === 'checkbox') {
                                    values[field] = fieldElement.checked;
                                } else if (fieldElement.type === 'uploader') {
                                    values[field] = fieldElement.files;
                                } else {
                                    values[field] = fieldElement.value || '';
                                }
                            }    
                        }
                    });   

                    let cardBody = document.getElementById(`card-body-${self.action}`);
                    let resultClass = validFields > 0 ? '' : 'm-3';
                    try {
                        let retVal = await DappLib[self.action].call(null, values);
                        //console.log('Last call and result: ', self.action, retVal);
                        let data = '';
                        switch(retVal.type) {
                            case DappLib.DAPP_RESULT_BIG_NUMBER:
                                data = DappLib.formatNumber(retVal.result.toString(10));
                                break;
                            case DappLib.DAPP_RESULT_TX_HASH:
                                data = DappLib.formatTxHash(retVal.result);
                                break;    
                            case DappLib.DAPP_RESULT_BOOLEAN:
                                data = DappLib.formatBoolean(retVal.result);
                                break;    
                            case DappLib.DAPP_RESULT_HASH_ARRAY:
                                data = DappLib.formatArray(
                                                                retVal.result,
                                                                ['TxHash', 'IpfsHash', 'Text-10-5'],
                                                                ['Transaction', 'IPFS URL', 'Doc Id'],
                                                                ['transactionHash', 'ipfsHash', 'docId']
                                                            );
                                break;
                            case DappLib.DAPP_RESULT_ARRAY:
                                data = DappLib.formatArray(
                                                                retVal.result,
                                                                retVal.formatter ? retVal.formatter : ['Text'],
                                                                null,
                                                                null
                                                            );
                                break;
                            case DappLib.DAPP_RESULT_OBJECT:
                                data = DappLib.formatObject(retVal.result);
                                break;
    
                        }
                        let resultElement = DOM.div({
                                                id: `card-result-${self.action}`,
                                                className: `${resultClass} mt-3 text-success`
                                            });
                        resultElement.innerHTML = ' 👍🏼 ' + (Array.isArray(retVal.result) ? 'Result' : retVal.label) + ': ' + data + DappLib.formatHint(retVal.hint);
                        cardBody.appendChild(resultElement);

                        // Wire-up clipboard copy
                        new ClipboardJS('.copy-target', {
                            text: function(trigger) {
                                return trigger.getAttribute('data-copy');
                            }
                        });
                    }
                    catch(e) {
                        if (e.message.indexOf('run Out of Gas') > -1) {
                            e.message = 'Can\'t access the blockchain. Check that access to it isn\'t blocked. During development this error usually means your test blockchain is not running or has test accounts that don\'t match the accounts in your development configuration.';                            
                        }
                        let errorElement = DOM.div({
                                                id: `card-result-${self.action}`,
                                                className: `${resultClass} mt-3 text-danger overflow-scroll`
                                            });
                        errorElement.innerHTML = ' 😖 ' + e.message;
                        cardBody.appendChild(errorElement);
                    }
                    finally {
                        self.querySelector('wait-widget').waiting = false;
                        self.clicked = false;
                    }
                } else {
                    console.error('😕 Action not found');
                }
            });
        }
    }

    
 
}

customElements.define('action-card', ActionCard);