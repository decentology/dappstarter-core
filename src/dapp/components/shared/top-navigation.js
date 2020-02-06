import CustomElement from './custom-element';

export default class TopNavigation extends CustomElement {

    static get ATTRIBUTE_COLLAPSE() {
        return 'collapse'
    }

    static get observedAttributes() {
        return TopNavigation.attributes; 
    }

    static get attributes() {
        return [
            TopNavigation.ATTRIBUTE_COLLAPSE
        ];
    }

    constructor(...args) {
        super(TopNavigation.attributes, ...args);
    }

    render() {
        let self = this;
        let content = `
<nav class="navbar-light scrolling-navbar navbar navbar-expand-md flexible-navbar" role="navigation">
    <a class="navbar-brand active">
        <strong>DappStarter</strong>
    </a>
    <button type="button" class="navbar-toggler">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse collapse" style="">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <a rel="noopener noreferrer" class="nav-link Ripple-parent" href="https://www.trycrypto.com/dappstarter" target="_blank">About</a>
            </li>
            <li class="nav-item">
                <a rel="noopener noreferrer" class="nav-link Ripple-parent" href="https://support.trycrypto.com" target="_blank">Support</a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a class="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://facebook.com/trycrypto/"><i class="fab fa-facebook"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://twitter.com/trycrypto"><i class="fab fa-twitter"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link navbar-link" rel="noopener noreferrer" href="https://github.com/trycrypto/dappstarter" target="_blank"><i class="fab fa-github mr-2"></i></a>
            </li>
            <!--li class="nav-item">
                <a class="btn peach-gradient nav-link Ripple-parent" rel="noopener noreferrer" href="https://demo.photoblock.org/" target="_blank">Sign in with PhotoBlock</a>
            </li-->
        </ul>
    </div>
</nav>
`
        self.innerHTML = content;
        self.querySelector('button').addEventListener('click', () => {
            self.collapse = !self.collapse;
            if (self.collapse) {
                self.querySelector('.navbar-collapse').classList.add('collapse');
            } else {
                self.querySelector('.navbar-collapse').classList.remove('collapse');
            }
        });
    }
}


customElements.define('top-navigation', TopNavigation);