///(page
import '../shared/action-card.js';
import '../widgets/page-widget.js';
import '../widgets/switch-widget.js';

export default class ContractRunStatePage extends CustomElement {

    constructor(...args) {
        super([], ...args);
    }

    render() {
        let self = this;

        let content = 
`
        <page-widget title="${self.title}" category="${self.category}" description="${self.description}">

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

        </page-widget>
`
        self.innerHTML = content;
    }
}


customElements.define('contract-runstate-page', ContractRunStatePage);
///)