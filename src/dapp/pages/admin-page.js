import CustomElement from '../components/shared/custom-element';
import '../components/widgets/panel-widget.js';
import '../components/shared/action-card.js';
import '../components/widgets/page-widget.js';

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
        <page-widget title="${self.title}" category="" description="Contract administrative features">
            ${uiHtml[CustomElement.UI_ADMIN]}
        </page-widget>
        <panel-widget id="resultPanel"></panel-widget>

`
        self.innerHTML = content;
    }
}

customElements.define('admin-page', AdminPage);

