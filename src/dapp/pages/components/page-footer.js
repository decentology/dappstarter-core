import CustomElement from '../../../lib/components/shared/custom-element';

export default class PageFooter extends CustomElement {

    constructor(...args) {
        const self = super(...args);
    }

    render() {
        let self = this;
        let content = `
<footer class="page-footer text-center font-small fixed-bottom">
    <!--p>
        <a href="https://www.trycrypto.com/dappstarter?utm_source=dapp" target="_new">
            <img src="https://dappstarter.trycrypto.com/trycrypto-logo-1024.png?r=ds" 
                alt="TryCrypto class="text-center fixed-bottom mb-3" style="margin-left:55px;max-width:160px;" />
        </a>
    </p-->
    <p class="footer-copyright blue darken-1 mb-0 py-3 text-center">Built for you with <span role="img" aria-label="Heart">❤️</span> by <a href="https://www.trycrypto.com">TryCrypto</a></p>
</footer>
`
        self.innerHTML = content;
    }
}


customElements.define('page-footer', PageFooter);