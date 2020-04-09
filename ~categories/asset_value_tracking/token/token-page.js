import "../../lib/components/shared/action-card.js";
import "./components/page-body.js";
import "../../lib/components/widgets/account-widget.js";
import "../../lib/components/widgets/number-widget.js";
import DappLib from "@dappstarter/dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('token-page')
export default class TokenPage extends LitElement {
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
    DappLib.onApproval((result) => {
      let resultPanel = this.querySelector("#resultPanel");
      resultPanel.append(DappLib.getFormattedResultNode(result));
      resultPanel.open();
    });
    DappLib.onTransfer((result) => {
      let resultPanel = this.querySelector("#resultPanel");
      resultPanel.append(DappLib.getFormattedResultNode(result));
      resultPanel.open();
    });
  }

  render() {
    let content = html`
      <page-body
        title="${self.title}"
        category="${self.category}"
        description="${self.description}"
      >
        <action-card
          id="card-totalSupply"
          title="Total Supply"
          description="Get total supply of tokens"
          action="totalSupply"
          method="${CustomElement.METHOD_GET}"
          fields=""
          return="unitResult"
        >
        </action-card>

        <action-card
          title="Balance"
          description="Get token balance for current account"
          action="balance"
          method="${CustomElement.METHOD_GET}"
          fields=""
          return="unitResult"
        >
        </action-card>

        <action-card
          title="Balance for Account"
          description="Get token balance for any account"
          action="balanceOf"
          method="${CustomElement.METHOD_GET}"
          fields="account"
          return="unitResult"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address"
          >
          </account-widget>
        </action-card>
        <action-card
          title="Transfer"
          description="Transfer tokens to another account"
          action="transfer"
          method="${CustomElement.METHOD_POST}"
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
            placeholder="Number of tokens to transfer"
          >
          </number-widget>
        </action-card>
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}