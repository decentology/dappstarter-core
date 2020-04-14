import DappLib from "@trycrypto/dappstarter-dapplib";
import DOM from "../../lib/components/shared/dom";
import "../../lib/components/shared/action-card.js";
import "../../lib/components/widgets/number-widget.js";
import ActionButton from "../../lib/components/shared/action-button";
import canvas from "../assets/img/canvas.jpg";
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
    this.fetchAndDisplayCounter();
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
      setTimeout(() => this.fetchAndDisplayCounter(), 500);
    }
  }

  render() {
    let content = html`
      <div class="container m-auto">
        <div class="row fadeIn mt-3 p-2 block">
          <div class="float-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="100"
              height="110"
              class="ml-6"
            >
              <defs>
                <style>
                  .cls-1 {
                    fill: url(#linear-gradient);
                  }
                </style>
                <linearGradient
                  id="linear-gradient"
                  y1="51.36"
                  x2="92.72"
                  y2="51.36"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#00c6f6" />
                  <stop offset="1" stop-color="#9be276" />
                </linearGradient>
              </defs>
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <path
                    class="cls-1"
                    d="M47.19,102.72a11.06,11.06,0,0,0,4.71-1.42L87.18,81.13a11.08,11.08,0,0,0,5.54-9.58h0V31.23a11,11,0,0,0-1.37-5.3,1,1,0,0,0-.12-.45,1.12,1.12,0,0,0-.37-.35,11,11,0,0,0-3.68-3.49L51.9,1.48a11.13,11.13,0,0,0-11.08,0L5.54,21.64a11,11,0,0,0-3.67,3.49,1,1,0,0,0-.37.35.93.93,0,0,0-.13.45A11.12,11.12,0,0,0,0,31.23V71.55a11.13,11.13,0,0,0,5.54,9.59l35.28,20.15a10.94,10.94,0,0,0,4.72,1.43m-39-79.35L41.82,3.21a9.12,9.12,0,0,1,9.08,0L86.18,23.37a9,9,0,0,1,2.66,2.34L46.36,50.28,3.88,25.71A9.09,9.09,0,0,1,6.54,23.37Zm0,56A9.08,9.08,0,0,1,2,71.55V31.23a8.92,8.92,0,0,1,.86-3.8L45.36,52v48.7a9.05,9.05,0,0,1-3.54-1.15Zm84.18-7.85h0a9.09,9.09,0,0,1-4.53,7.85L50.9,99.56a8.89,8.89,0,0,1-3.54,1.15V52l42.5-24.58a8.92,8.92,0,0,1,.86,3.8Z"
                  />
                </g>
              </g>
            </svg>
          </div>
          <h2 class="text-4xl">🎉 Dappiness!</h2>
          <p>
            Your Dapp is ready, and the world is waiting for you to create
            something amazing. Visit
            <a href="https://www.trycrypto.com" target="_new" rel="nofollow"
              >TryCrypto.com</a
            >
            for more insights on dapp development. The examples below
            demonstrate how to use the Dapp Library, ActionCard and ActionButton
            components to interact with the Dapp smart contract.
          </p>
        </div>

        <div class="row mt-3">
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
        </div>
      </div>
    `;
    return content;

    // Handle increment counter click
  }

  async fetchAndDisplayCounter() {
    let result = await DappLib["getStateCounter"].call();
    this.counter = result.callData;
    await this.requestUpdate();
    // DOM.elid("counter").innerHTML = result.callData;
  }
}
