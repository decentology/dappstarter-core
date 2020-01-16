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

        <action-card 
            title="Get Total Supply" 
            description="Get total supply of tokens"
            action="totalSupply"
            fields=""
        ></action-card>

        <action-card 
            title="Get Balance" 
            description="Get token balance for current account"
            action="balance"
            fields=""
        ></action-card>

        <action-card 
            title="Get Balance for Account" 
            description="Get token balance for any account"
            action="balanceOf"
            fields="account">

        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">Account</span>
            </div>
            <input type="text" data-field="account" class="form-control" placeholder="Account address">
        </div>

        </action-card>

        <action-card 
            title="Transfer" 
            description="Transfer tokens to another account"
            action="transfer"
            fields="to amount">
        
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

        <!--
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">@</span>
            </div>
            <input type="text" class="form-control" placeholder="Username" aria-label="Username"
                aria-describedby="basic-addon1">
        </div>
   
   
        <label for="basic-url">Your vanity URL</label>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon3">https://example.com/users/</span>
            </div>
            <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3">
        </div>
   
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">$</span>
            </div>
            <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
            <div class="input-group-append">
                <span class="input-group-text">.00</span>
            </div>
        </div>
   
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">With textarea</span>
            </div>
            <textarea class="form-control" aria-label="With textarea"></textarea>
        </div>
        -->
        </action-card>
        


      </section>
`
        self.innerHTML = content;
    }
}


customElements.define('token-page', TokenPage);
///)