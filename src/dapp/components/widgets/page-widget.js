import CustomElement from '../shared/custom-element';

export default class PageWidget extends CustomElement {
    
    constructor(...args) {
        super([], ...args);
    }


    render() {
        let self = this;
        let content = `
        <section>
            <h5>${self.category}</h5>
            <h2 class="mb-5"><strong>${self.title}</strong></h2>
            <div class="row">
                ${self.innerHTML}
            </div>
        </section>
`
        self.innerHTML = content;
    }
}


customElements.define('page-widget', PageWidget);