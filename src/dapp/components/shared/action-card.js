import DappLib from '../../../lib/dapp-lib';
import CustomElement from './custom-element';
import Wait from '../widgets/wait-widget';

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
    static get observedAttributes() {
        return ActionCard.attributes; 
    }

    static get attributes() {
        return [
            ActionCard.ATTRIBUTE_ACTION,
            ActionCard.ATTRIBUTE_METHOD,
            ActionCard.ATTRIBUTE_FIELDS
        ];
    }

    constructor(...args) {
        super(ActionCard.attributes, ...args);
    }

    static content(me) {
        return `
    <div class="card">
    <div class="white-text card-header blue-gradient">
        <h5>${ me[ActionCard.ATTRIBUTE_METHOD] === ActionCard.METHOD_POST ? '🖋' : '👓'}  ${me.title}</h5>
    </div>
    <div class="${ me.innerHTML.indexOf('<') > -1 ? 'card-body-padded' : 'card-body'}" id="card-body-${me.action}">
        ${me.innerHTML}
    </div>
    <div class="rounded-bottom grey lighten-2 pt-2 pb-2 pr-2">
        <div class="row pl-2 pr-2">
            <div class="col-lg-8 d-flex align-items-center">
                <wait-widget size="50" title="${me[ActionCard.ATTRIBUTE_DESCRIPTION]}" waiting-title="Waiting for transaction"></wait-widget>
            </div>
            <div class="col-lg-4 text-right">
                <button id="button-${me[ActionCard.ATTRIBUTE_ACTION]}" class="${me[ActionCard.ATTRIBUTE_METHOD] === ActionCard.METHOD_POST ? 'btn-warning btn-deep-orange' : 'btn-info'} btn Ripple-parent">${ (me[ActionCard.ATTRIBUTE_METHOD] ? me[ActionCard.ATTRIBUTE_METHOD] : 'Go').toUpperCase()}</button>
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

                // Remove prior results or error messages
                self.querySelectorAll(`#card-result-${self.action}`).forEach(e => e.parentNode.removeChild(e));

                // Capture values of all fields of interest
                let values = {};
                let fields = self.fields.split(' ');
                let validFields = 0;
                fields.map((field) => {
                    if (field) {
                        validFields++;
                        let fieldElement = self.querySelector(`[data-field=${field}]`);
                        if (fieldElement) {
                            values[field] = fieldElement.value;
                        }    
                    }
                });   
                if (DappLib[self.action]) {
                    self.querySelector('wait-widget').waiting = true;
                    let cardBody = document.getElementById(`card-body-${self.action}`);
                    let resultClass = validFields > 0 ? '' : 'm-3';
                    console.log(fields, fields.length, resultClass);
                    try {
                        let account = 0;
                        let data = await DappLib[self.action].call(null, account, values);
                        cardBody.innerHTML += `<div id="card-result-${self.action}" class="${resultClass} mt-3"> 👍🏼 <strong>Result:</strong> ${data}</div>`;
                    }
                    catch(e) {
                        if (e.message.indexOf('run Out of Gas') > -1) {

                            e.message = 'Can\'t access the blockchain. Check that access to it isn\'t blocked. During development this error usually means your test blockchain is not running or has test accounts that don\'t match the accounts in your development configuration.';                            
                        }
                        cardBody.innerHTML += `<div id="card-result-${self.action}" class="${resultClass} mt-3"> 😖 <strong>${e.name}:</strong> ${e.message}</div>`;
                    }
                    finally {
                        self.querySelector('wait-widget').waiting = false;
                    }
                } else {
                    console.error('😕 Action not found');
                }
            });
        }
    }

}

customElements.define('action-card', ActionCard);