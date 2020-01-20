///(page
import '../shared/action-card.js';
import '../widgets/page-widget.js';
import '../widgets/account-widget.js';

export default class ContractAccessPage extends CustomElement {

    constructor(...args) {
        super([], ...args);
    }

    render() {
        let self = this;

        let content = 
`
        <page-widget title="${self.title}" category="${self.category}">

            <action-card 
                title="Is Contract Authorized" description="Check if a contract is authorized"
                action="isContractAuthorized" method="${CustomElement.METHOD_GET}" fields="account">

                    <account-widget 
                        field="account" label="Contract" placeholder="Contract address">
                    </account-widget>

            </action-card>

            <action-card 
                title="Authorize Contract" description="Authorize a contract (functions must check using requireContractAuthorized()"
                action="authorizeContract" method="${CustomElement.METHOD_POST}" fields="account">

                    <account-widget
                        field="account" label="Contract" placeholder="Account address of contract to authorize">
                    </account-widget>
                
            </action-card>

            <action-card 
                title="Remove Contract Admin" description="Deauthorize a contract"
                action="deauthorizeContract" method="${CustomElement.METHOD_POST}" fields="account">

                    <account-widget
                        field="account" label="Account" placeholder="Account address of contract to deauthorize">
                    </account-widget>
                
            </action-card>
        </page-widget>
`
        self.innerHTML = content;
    }
}


customElements.define('contract-access-page', ContractAccessPage);
///)