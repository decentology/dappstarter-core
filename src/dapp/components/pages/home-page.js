import CustomElement from '../shared/custom-element';

export default class HomePage extends CustomElement {

    constructor(...args) {
        const self = super(...args);
    }

    render() {
        let self = this;
        let content = `

        <!--Main layout-->
        <div class="container">
          <!--First row-->
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
          <!--/.First row-->
      
          <hr class="extra-margins">
      
          <!--Second row-->
          <div class="row">
            <!--First columnn-->
            <div class="col-lg-4">
              <!--Card-->
              <div class="card wow fadeIn" data-wow-delay="0.2s">
      
                <!--Card image-->
                <img class="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/Architecture/4-col/img%20(3).jpg"
                  alt="Card image cap">
      
                <!--Card content-->
                <div class="card-body">
                  <!--Title-->
                  <h4 class="card-title">FAQ</h4>
                  <!--Text-->
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
                    content.</p>
                  <a href="#" class="btn btn-primary">Read more</a>
                </div>
      
              </div>
              <!--/.Card-->
            </div>
            <!--First columnn-->
      
            <!--Second columnn-->
            <div class="col-lg-4">
              <!--Card-->
              <div class="card wow fadeIn" data-wow-delay="0.4s">
      
                <!--Card image-->
                <img class="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/Architecture/4-col/img%20(1).jpg"
                  alt="Card image cap">
      
                <!--Card content-->
                <div class="card-body">
                  <!--Title-->
                  <h4 class="card-title">Guides</h4>
                  <!--Text-->
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
                    content.</p>
                  <a href="#" class="btn btn-primary">Read more</a>
                </div>
      
              </div>
              <!--/.Card-->
      
            </div>
            <!--Second columnn-->
      
            <!--Third columnn-->
            <div class="col-lg-4">
              <!--Card-->
              <div class="card wow fadeIn" data-wow-delay="0.6s">
      
                <!--Card image-->
                <img class="img-fluid" src="https://mdbootstrap.com/img/Photos/Horizontal/Architecture/4-col/img%20(4).jpg"
                  alt="Card image cap">
      
                <!--Card content-->
                <div class="card-body">
                  <!--Title-->
                  <h4 class="card-title">Docs</h4>
                  <!--Text-->
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
                    content.</p>
                  <a href="#" class="btn btn-primary">Read more</a>
                </div>
      
              </div>
              <!--/.Card-->
            </div>
            <!--Third columnn-->
          </div>
          <!--/.Second row-->
        </div>
        <!--/.Main layout-->
      
`
        self.innerHTML = content;
    }
}


customElements.define('home-page', HomePage);