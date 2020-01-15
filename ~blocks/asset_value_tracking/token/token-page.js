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
        <h2 class="mb-5">${self.category}: <strong>${self.title}</strong></h2>

        <action-card 
            action="Get Total Supply" 
            description="Get total supply of tokens"
            templateId="totalSupply"
            onClick={() => { let self = this; self.props.showResultPanel(category, 'Get Total Supply'); }}
        >
        </action-card>

        <action-card 
            action="Get Balance" 
            description="Get token balance for current account"
            templateId="balance"
            onClick={() => { this.props.showResultPanel(category, 'Get Balance'); }}
        >
        </action-card>

        <action-card 
            action="Get Balance for Account" 
            description="Get token balance for any account"
            templateId="balanceOf"
            onClick={() => { this.props.showResultPanel(category, 'Get Balance for Account'); }}
        >
        </action-card>

        <action-card 
            action="Transfer" 
            description="Transfer tokens to another account"
            templateId="transfer"
            onClick={() => { this.props.showResultPanel(category, 'Get Document Details'); }}
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