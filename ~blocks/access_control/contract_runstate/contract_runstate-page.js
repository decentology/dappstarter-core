///(page-loader-import
import '../pages/contract_runstate-page.js';
///)

///(page-pre-content
import '../shared/action-card.js';
import '../widgets/page-widget.js';
import '../widgets/switch-widget.js';
import DappLib from '../../../lib/dapp-lib';

export default class ContractRunStatePage extends CustomElement {

    constructor(...args) {
        super([], ...args);
        this.eventHandlerRegistered = false;
    }

    async render() {
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
/*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT RUN STATE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
        uiHtml[CustomElement.UI_ADMIN] += 
`
            <action-card 
                title="Is Contract Run State Active" description="Check if contract run state is active"
                action="isContractRunStateActive" method="${CustomElement.METHOD_GET}" fields="">
            </action-card>

            <action-card 
                title="Set Contract Run State" description="Set contract run state to active or inactive"
                action="setContractRunState" method="${CustomElement.METHOD_POST}" fields="mode">

                    <switch-widget
                        field="mode" label="Contract Run State" placeholder="">
                    </switch-widget>
                
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
        // Set 'Run State' switch value to correct state
        let currentRunState = Boolean((await DappLib.isContractRunStateActive()).result);
        self.innerHTML = content;

        self.querySelector('[data-field=mode]').checked = currentRunState;

        if (!self.eventHandlerRegistered) {
            self.eventHandlerRegistered = true;
            DappLib.onContractRunStateChange((result) => {
                let resultPanel = self.querySelector('#resultPanel');
                resultPanel.append(DappLib.getFormattedResultNode(result));
                resultPanel.open();
            });    
        }
    }
}

customElements.define('contract-runstate-page', ContractRunStatePage);
///)