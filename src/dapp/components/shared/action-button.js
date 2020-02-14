import DappLib from '../../../lib/dapp-lib';
import CustomElement from './custom-element';
import ClipboardJS from 'clipboard';

export default class ActionButton extends CustomElement {

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
    static get ATTRIBUTE_RETURN() {
        return 'return'
    }
    static get ATTRIBUTE_SOURCE() {
        return 'source'
    }
    static get ATTRIBUTE_TEXT() {
        return 'text'
    }
    static get EVENT_CLICK() {
        return 'event-click'
    }
    static get observedAttributes() {
        return ActionButton.attributes;
    }

    static get attributes() {
        return [
            ActionButton.ATTRIBUTE_ACTION,
            ActionButton.ATTRIBUTE_METHOD,
            ActionButton.ATTRIBUTE_FIELDS,
            ActionButton.ATTRIBUTE_MESSAGE,
            ActionButton.ATTRIBUTE_RETURN,
            ActionButton.ATTRIBUTE_SOURCE,
            ActionButton.ATTRIBUTE_TEXT
        ];
    }

    constructor(...args) {
        super(ActionButton.attributes, ...args);
        this.clicked = false;
    }

    render() {
        let self = this;
        self.clicked = false;
        self.classList.remove('disabled');
        if (DappLib[self.action] && self.source) {
            self.innerHTML = `<button class="${self[ActionButton.ATTRIBUTE_METHOD].indexOf(ActionButton.METHOD_POST) > -1 ? (self[ActionButton.ATTRIBUTE_METHOD] === ActionButton.METHOD_POST ? 'btn-warning btn-deep-orange' : 'btn-danger') : 'btn-info'} btn Ripple-parent">${ (self[ActionButton.ATTRIBUTE_TEXT] ? self[ActionButton.ATTRIBUTE_TEXT] : self[ActionButton.ATTRIBUTE_METHOD]).toUpperCase()}</button>`;
            self.addEventListener('click', self.clickHandler);
        } else {
            console.error('😕 Action or Source not found');
        }
    }

    async clickHandler() {
        let self = this;
        if (self.clicked === true) {
            return;
        }
        self.clicked = true;
        self.removeEventListener('click', self.clickHandler);
        self.innerHTML = '<span class="spinner-border spinner-border-sm mr-2"></span>';
        self.classList.add('disabled');

        // Capture values of all fields of interest
        let source = document.querySelector(self.source);
        let values = {};
        let fields = self.fields.split(' ');
        fields.map((field) => {
            if (field) {
                let fieldElement = source.querySelector(`[data-field=${field}]`);
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

        let closeMarkup = '<div onclick="this.parentNode.parentNode.removeChild(this.parentNode)" title="Dismiss" class="text-right mb-1 mr-2" style="cursor:pointer;">X</div>';
        try {
            
            //console.log('Last call, values: ', self.action, values);
            let retVal = await DappLib[self.action].call(null, values);

            let formatted = '';
            switch (retVal.type) {
                case DappLib.DAPP_RESULT_BIG_NUMBER:
                    formatted = self.return ?
                                        DappLib.formatNumber(retVal[self.return].toString(10)) :
                                        DappLib.formatNumber(retVal.result.toString(10));
                    break;
                case DappLib.DAPP_RESULT_TX_HASH:
                    formatted = DappLib.formatTxHash(retVal.result);
                    break;
                case DappLib.DAPP_RESULT_ACCOUNT:
                    formatted = DappLib.formatAccount(retVal.result);
                    break;
                case DappLib.DAPP_RESULT_BOOLEAN:
                    formatted = DappLib.formatBoolean(retVal.result);
                    break;
                case DappLib.DAPP_RESULT_IPFS_HASH_ARRAY:
                    formatted = DappLib.formatArray(
                        retVal.result,
                        ['TxHash', 'IpfsHash', 'Text-10-5'],
                        ['Transaction', 'IPFS URL', 'Doc Id'],
                        ['transactionHash', 'ipfsHash', 'docId']
                    );
                    break;
                case DappLib.DAPP_RESULT_SIA_HASH_ARRAY:
                    formatted = DappLib.formatArray(
                        retVal.result,
                        ['TxHash', 'SiaHash', 'Text-10-5'],
                        ['Transaction', 'Sia URL', 'Doc Id'],
                        ['transactionHash', 'docId', 'docId']
                    );
                    break;
                case DappLib.DAPP_RESULT_ARRAY:
                    formatted = DappLib.formatArray(
                        retVal.result,
                        retVal.formatter ? retVal.formatter : ['Text'],
                        null,
                        null
                    );
                    break;
                case DappLib.DAPP_RESULT_OBJECT:
                    formatted = DappLib.formatObject(retVal.result);
                    break;
            }

            let resultNode = document.createElement('div');
            resultNode.className = `note note-success m-3`;     
            resultNode.innerHTML = closeMarkup + '👍🏼 ' + (Array.isArray(retVal.result) ? 'Result' : retVal.label) + ': ' + formatted + DappLib.formatHint(retVal.hint);

            // Wire-up clipboard copy
            new ClipboardJS('.copy-target', {
                text: function (trigger) {
                    return trigger.getAttribute('data-copy');
                }
            });
            self.fireClickEvent(retVal, resultNode);

        } catch (e) {
            if (e.message.indexOf('run Out of Gas') > -1) {
                e.message = 'Can\'t access the blockchain. Check that access to it isn\'t blocked. During development this error usually means your test blockchain is not running or has test accounts that don\'t match the accounts in your development configuration.';
            }
            let resultNode = document.createElement('div');
            resultNode.className = `note note-danger m-3`;     
            resultNode.innerHTML =  closeMarkup + '😖 ' + e.message;

            self.fireClickEvent({ type: DappLib.DAPP_RESULT_ERROR, result: e }, resultNode);
        } finally {
            self.render();
        }
    }

    fireClickEvent(data, node) {
        let self = this;
        let clickEvent = new CustomEvent(
            ActionButton.EVENT_CLICK, 
            {
                detail: {
                    info: data,
                    node: node
                }
            }
        );
        self.dispatchEvent(clickEvent);

    }

}

customElements.define('action-button', ActionButton);