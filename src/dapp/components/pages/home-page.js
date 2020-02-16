import CustomElement from '../shared/custom-element';
import canvas from '../../assets/img/canvas.jpg';

export default class HomePage extends CustomElement {

    constructor(...args) {
        const self = super(...args);
    }

    render() {
        let self = this;
        let content = `

        <div class="container">
            <div class="row fadeIn">
                <div class="col-md-10">
                    <div class="jumbotron">
                        <h2 class="h2-responsive">🎉 Dappiness!</h2>

                        <h5 class="mt-3">Your Dapp canvas is ready, and the world is waiting for you to create something amazing.</h5>
                        
                        <img class="mt-3 mb-3 img-fluid" src="${canvas}" alt="Blank canvas" />
                    
                        <p class="m-3">Register for DappStarter's free "Blockchain Bootcamp" for greater insights on dapp development.</p>
                        
                        <a target="_blank" href="https://www.trycrypto.com/dappstarter" class="btn btn-primary"
                        rel="nofollow"><i class="fas fa-graduation-cap fa-2x left"></i> Register</a>
                    </div>
                </div>
            </div>
        </div>
      
`
        self.innerHTML = content;
    }
}


customElements.define('home-page', HomePage);