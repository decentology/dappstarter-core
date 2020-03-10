import CustomElement from '../../lib/components/shared/custom-element';
import './components/page-panel.js';
import '../../lib/components/shared/action-card.js';
import './components/page-body.js';

export default class AdminPage extends CustomElement {

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

///+ui-admin

        let content = 
`
        <page-body title="${self.title}" category="" description="Contract administrative features">
            ${uiHtml[CustomElement.UI_ADMIN]}
        </page-body>
        <page-panel id="resultPanel"></page-panel>

`
        self.innerHTML = content;
    }
}

customElements.define('admin-page', AdminPage);

