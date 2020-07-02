///(page-post-content
import "./components/page-panel.js";
import "./components/page-body.js";
import "../../lib/components/shared/action-card.js";
import "../../lib/components/widgets/account-widget.js";
import "../../lib/components/widgets/number-widget.js";
import DappLib from "@trycrypto/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('basic-nft-page')
export default class BasicNftPage extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >
       <h1 style="margin-bottom:20px;color:#cc0000;font-size:1.2rem;">The user interface is currently in development. The items below are for illustrative purposes only.</h1>
        

        <action-card
          title="Account Query Example"
          description="An example of how to query an account during development"
          action="getAccountInfo"
          method="get"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Account Action Example"
          description="An example of how to perform an action on an account during development"
          action="transfer"
          method="post"
          fields="to amount"
        >
          <account-widget
            field="to"
            label="To"
            placeholder="Recipient's account address"
          >
          </account-widget>

          <number-widget
            field="amount"
            label="Amount"
            placeholder="Some numeric info"
          >
          </number-widget>
        </action-card>
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)