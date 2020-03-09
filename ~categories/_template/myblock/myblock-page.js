///(page-loader-import
import '../pages/myblock-page.js';
///)

///(page-pre-content
import '../widgets/page-widget.js';
import '../shared/action-card.js';
import DappLib from '../../../lib/dapp-lib';

export default class MyBlockPage extends CustomElement {

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
                title="Get XXXXX" description="Get XXXX "
                action="getXXXXX" method="${CustomElement.METHOD_GET}" fields="id">

                <number-widget 
                    field="id" label="XXXXX ID" placeholder="XXXXX ID">
                </number-widget>
            </action-card>
`
///)
///(ui-write
            uiHtml[CustomElement.UI_WRITE] =
`
            <action-card 
                title="Add XXXXX" description="Add  XXXXX"
                action="addXXXXX" method="${CustomElement.METHOD_POST}" fields="something"
                target="card-body-addXXXXX"
                message="Waiting...">
                    <text-widget
                        field="something" label="Something" 
                        placeholder="Enter something">
                    </text-widget>
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
            DappLib.onYOUR_EVENT_NAME((result) => {
                let resultPanel = self.querySelector('#resultPanel');
                resultPanel.append(DappLib.getFormattedResultNode(result));
                resultPanel.open();
            });    
        }

    }

}

customElements.define('myblock-page', MyBlockPage);
///)
