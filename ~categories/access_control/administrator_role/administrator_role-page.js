///(page-loader-import
import '../../pages/administrator_role-page.js';
///)

///(page-pre-content
import '../components/shared/action-card.js';
import '../components/widgets/page-widget.js';
import '../components/widgets/account-widget.js';

export default class AdministratorRolePage extends CustomElement {

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

/*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
        uiHtml[CustomElement.UI_ADMIN] += 
`
            <action-card
                title="Is Contract Admin" description="Check if an account is a contract administrator"
                action="isContractAdmin" method="${CustomElement.METHOD_GET}" fields="account">

                    <account-widget 
                        field="account" label="Account" placeholder="Account address">
                    </account-widget>

            </action-card>

            <action-card 
                title="Add Contract Admin" description="Add an account as a contract administrator"
                action="addContractAdmin" method="${CustomElement.METHOD_POST}" fields="account">

                    <account-widget
                        field="account" label="Account" placeholder="Account address of administrator to add">
                    </account-widget>
                
            </action-card>

            <action-card 
                title="Remove Contract Admin" description="Remove an account as a contract administrator"
                action="removeContractAdmin" method="${CustomElement.METHOD_POST}" fields="account">

                    <account-widget
                        field="account" label="Account" placeholder="Account address of administrator to remove">
                    </account-widget>
                
            </action-card>

            <action-card
                title="Remove Last Contract Admin" description="Remove an account as a contract administrator"
                action="removeLastContractAdmin" method="${CustomElement.METHOD_POST}" fields="account">

                    <h6 class="red accent-4 mb-3 p-4 text-white">
                        This transaction will remove the last remaining administrator. Any functions that use requireContractAdmin() will fail, 
                        effectively making this a fully decentralized contract. This action is irreversible. Proceed with caution.
                    </h6>

                    <account-widget
                        field="account" label="Account" placeholder="Account address of administrator to remove">
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

customElements.define('administrator-role-page', AdministratorRolePage);
///)