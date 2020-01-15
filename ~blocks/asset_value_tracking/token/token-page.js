///(page

import '../shared/action-card.js';

export default class TokenPage extends CustomElement {

    constructor(...args) {
        super([], ...args);
    }

    render() {
        let self = this;
        let content = 
`
    <section>
        <h5>${self.category}</h5>
        <h2 class="mb-5"><strong>${self.title}</strong></h2>

        <action-card 
            action="Get Total Supply" 
            description="Get total supply of tokens"
            templateId="totalSupply"
            handler="() => { console.log('I am the handler for Total Supply'); }"
        >
        </action-card>

        <action-card 
            action="Get Balance" 
            description="Get token balance for current account"
            templateId="balance"
            handler="() => { console.log('I am the handler for Balance'); }"
        >
        </action-card>

        <action-card 
            action="Get Balance for Account" 
            description="Get token balance for any account"
            templateId="balanceOf"
            handler="() => { console.log('I am the handler for Account Balance'); }"
        >
        </action-card>

        <action-card 
            action="Transfer" 
            description="Transfer tokens to another account"
            templateId="transfer"
            handler="() => { console.log('I am the handler for Transfer'); }"
        >
        </action-card>
        
        <template id="totalSupply"></template>

        <template id="balance"></template>

        <template id="balanceOf">
          Account: <input type="text"></input>
        </template>

        <template id="transfer">
          To: <input type="text"></input>
        </template>


      </section>
`
        self.innerHTML = content;
    }
}


customElements.define('token-page', TokenPage);
///)