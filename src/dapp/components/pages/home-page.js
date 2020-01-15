import {
    CustomElement
} from '../shared/dapp-ui';

export default class HomePage extends CustomElement {

    constructor(...args) {
        const self = super(...args);
    }

    render() {
        let self = this;
        let content = `
<div>Hello World</div>
`
        self.innerHTML = content;
    }
}


customElements.define('home-page', HomePage);