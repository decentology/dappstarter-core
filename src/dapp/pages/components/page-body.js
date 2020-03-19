import CustomElement from '../../../lib/components/shared/custom-element';

export default class PageBody extends CustomElement {
    
    constructor(...args) {
        super([], ...args);
    }


    render() {
        let self = this;
        let content = `
        <section>
            <h5>${self.category}</h5>
            <h2 class="mb-2"><strong>${self.title}</strong></h2>
            <div class="row">
                <div class="col-lg-8 col-md-10 col-sm-12 mb-5 blue-grey-text">
                    ${self.description}
                </div>
            </div>
            <div class="row">
                ${self.innerHTML}
            </div>
        </section>
`
        self.innerHTML = content;
    }

}


customElements.define('page-body', PageBody);