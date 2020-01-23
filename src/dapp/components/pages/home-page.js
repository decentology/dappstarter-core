import CustomElement from '../shared/custom-element';

export default class HomePage extends CustomElement {

    constructor(...args) {
        const self = super(...args);
    }

    render() {
        let self = this;
        let content = `

        <div class="container">
          <div class="row wow fadeIn" data-wow-delay="0.2s">
            <div class="col-md-12">
              <div class="jumbotron">
                <h2 class="h2-responsive">🎉 Dappiness!</h2>
                <br>
                <p>Nice work! Your dapp is up and running.</p>
                <hr>
                <p>Register for DappStarter's free "Blockchain Bootcamp" for greater insights on dapp development.</p>
                
                <a target="_blank" href="https://www.trycrypto.com/dappstarter" class="btn btn-primary"
                  rel="nofollow"><i class="fas fa-graduation-cap fa-2x left"></i> Learn more</a>
              </div>
            </div>
          </div>    
        </div>
      
`
        self.innerHTML = content;
    }
}


customElements.define('home-page', HomePage);