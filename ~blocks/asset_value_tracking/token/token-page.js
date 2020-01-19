///(page
import '../shared/action-card.js';
import '../widgets/page-widget.js';
import '../widgets/account-widget.js';

export default class TokenPage extends CustomElement {

    constructor(...args) {
        super([], ...args);
    }

    render() {
        let self = this;

        let content = 
`
        <page-widget title="${self.title}" category="${self.category}">

            <action-card 
                title="Total Supply" description="Get total supply of tokens"
                action="totalSupply" method="${TokenPage.METHOD_GET}" fields="">
            </action-card>

            <action-card 
                title="Balance" description="Get token balance for current account"
                action="balance" method="${TokenPage.METHOD_GET}" fields="">
            </action-card>

            <action-card 
                title="Balance for Account" description="Get token balance for any account"
                action="balanceOf" method="${TokenPage.METHOD_GET}" fields="account">

                    <account-widget 
                        field="account" label="Account" placeholder="Account address">
                    </account-widget>

            </action-card>

            <action-card 
                title="Transfer" description="Transfer tokens to another account"
                action="transfer" method="${TokenPage.METHOD_POST}" fields="to amount">

                    <account-widget class="mb-3"
                        field="to" label="To" placeholder="Recipient's account address">
                    </account-widget>

                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Amount</span>
                        </div>
                        <input type="text" data-field="amount" class="form-control" placeholder="Amount">
                    </div>
                
            </action-card>
        </page-widget>
`
        self.innerHTML = content;
    }
}


customElements.define('token-page', TokenPage);
///)