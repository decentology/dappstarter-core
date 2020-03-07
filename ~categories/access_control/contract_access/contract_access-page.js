///(page-loader-import
import '../pages/contract_access-page.js';
///)

///(page-pre-content
import '../shared/action-card.js';
import '../widgets/page-widget.js';
import '../widgets/account-widget.js';

export default class ContractAccessPage extends CustomElement {

    constructor(...args) {
        super([], ...args);
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
///)
///(ui-write
///)
///(ui-admin

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT ACCESS  <<<<<<<<<<<<<<<<<<<<<<<<<<<*/
        uiHtml[CustomElement.UI_ADMIN] += 
`
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
            title="Deauthorize Contract" description="Deauthorize a contract"
            action="deauthorizeContract" method="${CustomElement.METHOD_POST}" fields="account">

                <account-widget
                    field="account" label="Account" placeholder="Account address of contract to deauthorize">
                </account-widget>
            
        </action-card>        
        <div class="col-12 m-5"></div>

`
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
    }
}

customElements.define('contract-access-page', ContractAccessPage);
///)