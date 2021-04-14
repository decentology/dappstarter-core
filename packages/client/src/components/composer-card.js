import DappLib from "@decentology/dappstarter-dapplib";
import "./wait-widget";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { LitElement, html, customElement, property } from "lit-element";
@customElement("composer-card")
export default class ComposerCard extends LitElement {
  @property({ type: String })
  action = null;
  @property({ type: String })
  method = null;
  @property({ type: String })
  fields = null;
  @property({ type: String })
  message = null;
  @property({ type: String })
  return = null;
  @property({ type: String })
  target = null;
  @property({ type: String })
  description = null;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
    const children = [...this.children];
    setTimeout(() => {
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        this.querySelector(".slot").append(element);
      }
    }, 0);

    this.clicked = false;
    if (!this.id) {
      this.id =
        "x" +
        Math.random()
          .toString(36)
          .substr(2, 9);
    }
  }

  handleClick = e => {
    if (this.action) {
      console.log('Do it!')
    }
  };

  render() {
    return html`
      <div class="shadow rounded-md bg-white mb-10 p-1">
        <div
          class="text-white p-3 bg-blue-400 flex justify-between items-center rounded-md rounded-b-none"
        >
          <h5 class="font-bold">${this.title}</h5>
        </div>
        <div
          class="slot ${this.innerHTML.indexOf("<") > -1 ? "p-3" : ""}"
          id="card-body-${this.action}"
        ></div>
        <div class="bg-gray-300 p-1 rounded-md rounded-t-none">
          <div class="p-2 flex items-center justify-between">
            <div>${this.description}</div>
            <div class="button-container text-right">
              <action-button
                source="#${this.id}"
                text="Update Project"
                action="${this.action}"
                method="${this.method}"
                fields="${this.fields || ""}"                
                return="${this.return}"
                .click=${this.handleClick}
              />
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
