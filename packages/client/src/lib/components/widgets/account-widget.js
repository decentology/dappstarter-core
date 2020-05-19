import { LitElement, html, customElement, property } from "lit-element";
import DappLib from "@trycrypto/dappstarter-dapplib";

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


    setTimeout(async () => {
      const accounts = DappLib.getAccounts();
      this.accountsLookUp = accounts;
      this.querySelector('select').innerHTML = this.displayAccountOptions();
      this.querySelector('select').addEventListener('change', (e) => {
        this.querySelector('input').value = e.target.value;
      });
    }, 0);
  }

  displayAccountOptions() {
    let optionsString = '';
    for(let i = 0; i < this.accountsLookUp.length; i++){
      optionsString = optionsString + '<option value="' + `${this.accountsLookUp[i]}` + '">' + `${this.accountsLookUp[i]}` + '</option>';
    };

    return optionsString;
  }

  render() {
    this.classList.add("mb-3", "w-full", "block");
    let content = html`
      <div class="mb-4 w-1/2">
        <div class="row">
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
        <div class="row pt-5">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Account Lookup
          </label>

          <div class="inline-block relative w-full">
            <select id="accountOptions" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>   
          </div>     
        </div>
      </div>
    `;

    return content;
  }
}
