///(page
import '../shared/action-card.js';

export default class TokenPage extends CustomElement {

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
        <div class="row">
        <action-card 
            title="Total Supply" 
            description="Get total supply of tokens"
            action="totalSupply"
            method="${TokenPage.METHOD_GET}"
            fields=""
            class="col-md-8 col-sm-12 mb-5"
        ></action-card>

        <action-card 
            title="Balance" 
            description="Get token balance for current account"
            action="balance"
            method="${TokenPage.METHOD_GET}"
            fields=""             
            class="col-md-8 col-sm-12 mb-5"

        ></action-card>

        <action-card 
            title="Balance for Account" 
            description="Get token balance for any account"
            action="balanceOf"
            method="${TokenPage.METHOD_GET}"
            fields="account"            
            class="col-md-8 col-sm-12 mb-5"
            >
            <article>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Account</span>
                    </div>
                    <input type="text" data-field="account" class="form-control" placeholder="Account address">
                </div>
            </article>

        </action-card>
        <action-card 
            title="Transfer" 
            description="Transfer tokens to another account"
            action="transfer"
            method="${TokenPage.METHOD_POST}"
            fields="to amount"            
            class="col-md-8 col-sm-12 mb-5"
            >
            <article>        
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">To</span>
                    </div>
                    <input type="text" data-field="to" class="form-control" placeholder="Recipient's account">
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Amount</span>
                    </div>
                    <input type="text" data-field="amount" class="form-control" placeholder="Amount">
                </div>
            </article>
        </action-card>
        
        </div>

      </section>
`
        self.innerHTML = content;
    }
}


customElements.define('token-page', TokenPage);
///)