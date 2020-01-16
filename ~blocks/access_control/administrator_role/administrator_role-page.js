///(page
import '../shared/action-card.js';

export default class AdministratorRolePage extends CustomElement {

    constructor(...args) {
        super([], ...args);
    }

    render() {
        let self = this;
        let content = 
`
<div>Administrator Role Page</div>
`
        self.innerHTML = content;
    }
}


customElements.define('administrator_role-page', AdministratorRolePage);
///)