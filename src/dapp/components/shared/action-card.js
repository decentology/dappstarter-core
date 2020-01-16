import CustomElement from './custom-element';
import DappLib from '../../../lib/dapp-lib';

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

    static do(p) {
        console.log('Function called', p); 
    }

    render() {
        let self = this;
        let content = `
<div class="row mb-4">
    <div class="col-lg-8 mb-4">
        <div class="card">
            <div class="white-text card-header blue-gradient">
                <h5>${self.title}</h5>
            </div>
            <div class="card-body">
                ${self.innerHTML}
                <div id="result-${self.action}"></div>
            </div>
            <div class="rounded-bottom mdb-color lighten-5 pt-2 pb-2 pr-2">
                <div class="row pl-2 pr-2">
                    <div class="col-lg-8 d-flex align-items-center">
                        <h6>${self[ActionCard.ATTRIBUTE_DESCRIPTION]}</h6>
                    </div>
                    <div class="col-lg-4 text-right">
                        <button id="button-${self[ActionCard.ATTRIBUTE_ACTION]}" class="btn-primary btn Ripple-parent">GO</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`
        self.innerHTML = content; 

        if (self.action) {
            document.querySelector(`#button-${self[ActionCard.ATTRIBUTE_ACTION]}`).addEventListener('click', async () => {

                let values = {};
                let fields = self.fields.split(' ');
                fields.map((field) => {
                    if (field) {
                        let fieldElement = self.querySelector(`[data-field=${field}]`);
                        if (fieldElement) {
                            values[field] = fieldElement.value;
                        }    
                    }
                });   
                if (DappLib[self.action]) {
                    try {
                        let account = 0;
                        let data = await DappLib[self.action].call(null, account, values);
                        document.getElementById(`result-${self.action}`).innerHTML = `<strong>Result:</strong> ${data}`;
                    }
                    catch(e) {
                        document.getElementById(`result-${self.action}`).innerHTML = `<strong>${e.name}:</strong> ${e.message}`;
                    }
                } else {
                    console.error('Action not found');
                }
            });
        }
    }

}

customElements.define('action-card', ActionCard);