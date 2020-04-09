import { LitElement, html, customElement, property } from "lit-element";

@customElement("account-widget")
export default class AccountWidget extends LitElement {
  @property()
  field;
  @property()
  label;
  @property()
  placeholder;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    this.classList.add("mb-3", "w-full", "block");
    let content = html`
      <div class="mb-4 w-1/2">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          ${this.label}
        </label>
        <input
          type="text"
          data-field="${this.field}"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="${this.placeholder}"
        />
      </div>
    `;

    return content;
  }
}
