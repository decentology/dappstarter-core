import DappLib from "@trycrypto/dappstarter-dapplib";
import DOM from "../../lib/components/shared/dom";
import "../../lib/components/shared/action-card.js";
import "../../lib/components/shared/action-button.js";
import "../../lib/components/widgets/number-widget.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("dapp-page")
export default class DappPage extends LitElement {
  @property()
  get;
  @property()
  post;
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
    this.counter = 0;
    //this.fetchAndDisplayCounter();
  }

  handleClick = e => {
    DOM.el("top-navigation").handleClick(e);
  };

  buttonClick = async e => {
    let info = e.detail;
    if (info.type === DappLib.DAPP_RESULT_ERROR) {
      DOM.elid("result").innerHTML =
        '<span class="text-danger">' + info.result + "</span>";
    } else {
     // setTimeout(() => this.fetchAndDisplayCounter(), 500);
    }
  }

  render() {
    let content = html`
      <div class="container m-auto">
        <div class="row fadeIn mt-3 p-2 block">
          <div class="float-right">
            ${ unsafeHTML(DappLib.SVG_ICONS.block) }
          </div>
          <h2 class="text-4xl">🎉 Dappiness!</h2>
          <p>
            Your Dapp is ready, and the world is waiting for you to create
            something amazing. Visit
            <a href="https://www.trycrypto.com" target="_new" rel="nofollow"
              >TryCrypto.com</a
            >
            for more insights on dapp development.
          </p>
        </div>

        <!--div class="row mt-3">
          <div class="col-md-7">
            <action-card
              id="card-contractOwner"
              title="State Contract Owner"
              description="Makes a cross-contract call to get account of state contract owner"
              action="getStateContractOwner"
              method="get"
              fields=""
            >
            </action-card>
          </div>

          <div class="mt-4 bg-white rounded p-3" id="my-form">
            <h4>
              Counter value from contract:
              <span id="counter" class="text-primary">${this.counter}</span>
            </h4>
            <number-widget
              field="increment"
              label="Increment Counter:"
              placeholder="Enter 1 to 9"
            >
            </number-widget>
            <div id="result"></div>
            <action-button
              id="increment-counter"
              source="#my-form"
              action="incrementStateCounter"
              method="post"
              fields="increment"
              text="Increment Counter"
              class="mt-4"
              .click=${this.buttonClick}
            ></action-button>
          </div>
        </div -->
      </div>
    `;
    return content;

    // Handle increment counter click
  }

  async fetchAndDisplayCounter() {
    let result = await DappLib["getStateCounter"].call();
    this.counter = result.callData;
    await this.requestUpdate();
  }
}
