import CustomElement from './custom-element';

export default class PageFooter extends CustomElement {

    constructor(...args) {
        const self = super(...args);
    }

    render() {
        let self = this;
        let content = `
<footer class="page-footer blue text-center font-small darken-1 fixed-bottom">
    <p class="footer-copyright mb-0 py-3 text-center">Built for you with <span role="img" aria-label="Heart">❤️</span> by <a href="https://www.trycrypto.com/dappstarter">DappStarter</a></p>
</footer>
`
        self.innerHTML = content;
    }
}


customElements.define('page-footer', PageFooter);