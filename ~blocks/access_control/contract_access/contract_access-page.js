///(page
import '../shared/action-card.js';

export default class ContractAccessPage extends CustomElement {

    constructor(...args) {
        super([], ...args);
    }

    render() {
        let self = this;
        let content = 
`
    <section>
        <h5>${self.category}</h5>
        <h2 class="mb-5"><strong>${self.title}</strong></h2>



      </section>
`
        self.innerHTML = content;
    }
}


customElements.define('contract_access-page', ContractAccessPage);
///)