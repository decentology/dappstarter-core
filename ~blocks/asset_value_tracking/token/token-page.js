///(page-loader-import
import '../pages/token-page.js';
///)

///(page-pre-content
import '../shared/action-card.js';
import '../widgets/page-widget.js';
import '../widgets/account-widget.js';
import '../widgets/number-widget.js';
import DappLib from '../../../lib/dapp-lib';

export default class TokenPage extends CustomElement {

    constructor(...args) {
        super([], ...args);
        this.eventHandlerRegistered = false;
    }

    render() {
        let self = this;

        let uiHtml = {
            [CustomElement.UI_READ]: '',
            [CustomElement.UI_WRITE]: '',
            [CustomElement.UI_ADMIN]: ''
        }
///)
///(ui-read
        uiHtml[CustomElement.UI_READ] =
`
            <action-card 
                id="card-totalSupply"
                title="Total Supply" description="Get total supply of tokens"
                action="totalSupply" method="${CustomElement.METHOD_GET}" fields="" return="unitResult">
            </action-card>

            <action-card 
                title="Balance" description="Get token balance for current account"
                action="balance" method="${CustomElement.METHOD_GET}" fields="" return="unitResult">
            </action-card>

            <action-card 
                title="Balance for Account" description="Get token balance for any account"
                action="balanceOf" method="${CustomElement.METHOD_GET}" fields="account" return="unitResult">

                    <account-widget 
                        field="account" label="Account" placeholder="Account address">
                    </account-widget>

            </action-card>

`
///)
///(ui-write
            uiHtml[CustomElement.UI_WRITE] =
`
            <action-card
                title="Transfer" description="Transfer tokens to another account"
                action="transfer" method="${CustomElement.METHOD_POST}" fields="to amount">

                    <account-widget
                        field="to" label="To" placeholder="Recipient's account address">
                    </account-widget>

                    <number-widget
                        field="amount" label="Amount" placeholder="Number of tokens to transfer">
                    </number-widget>
                
            </action-card>
`
///)
///(ui-admin
///)
///(page-post-content
        let content = 
`
        <page-widget title="${self.title}" category="${self.category}" description="${self.description}">
            ${uiHtml[CustomElement.UI_READ]}
            ${uiHtml[CustomElement.UI_WRITE]}
            ${uiHtml[CustomElement.UI_ADMIN]}
        </page-widget>
        <panel-widget id="resultPanel"></panel-widget>
`
        self.innerHTML = content;

        if (!self.eventHandlerRegistered) {
            self.eventHandlerRegistered = true;
            DappLib.onApproval((result) => {
                let resultPanel = self.querySelector('#resultPanel');
                resultPanel.append(DappLib.getFormattedResultNode(result));
                resultPanel.open();
            });    
            DappLib.onTransfer((result) => {
                let resultPanel = self.querySelector('#resultPanel');
                resultPanel.append(DappLib.getFormattedResultNode(result));
                resultPanel.open();
            });    
        }

    }
} 

customElements.define('token-page', TokenPage);
///)