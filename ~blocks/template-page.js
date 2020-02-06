///(page-content
import '../shared/action-card.js';

export default class TemplatePage extends CustomElement {

    constructor(...args) {
        super([], ...args);
    }

    render() {
        let self = this;
        let content = 
`
<div>Template Page</div>
`
        self.innerHTML = content;
    }
}


customElements.define('template-page', TemplatePage);
///)