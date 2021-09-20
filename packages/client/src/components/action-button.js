import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("action-button")
export default class ActionButton extends LitElement {
  @property()
  get;
  @property()
  post;
  @property()
  action;
  @property()
  method;
  @property()
  fields;
  @property()
  message;
  @property()
  return;
  @property()
  source;
  @property()
  text;
  @property()
  "event-click";

  @property({ type: Function })
  'click';

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
    this.clicked = false;
  }

  render() {
    this.clicked = false;
    this.classList.remove("disabled");
    return html`
      <button
        @click=${this.clickHandler}
        class="text-white font-bold py-2 px-8 rounded ${this.method === "post"
          ? "bg-orange-500 hover:bg-orange-700"
          : "bg-green-500 hover:bg-green-700"}"
      >
        ${(this.text ? this.text : (this.method === "post" ? "Submit" : "View")).toUpperCase()}
      </button>
    `;
  }

  async clickHandler() {
    if (this.clicked === true) {
      return;
    }
    this.clicked = true;
    this.classList.add("disabled");
    // Capture values of all fields of interest
    let source = document.querySelector(this.source);
    let values = {};
    
    let fields = this.fields.split(" ");
    fields.map(field => {
      if (field) {
        // uses querySelector which finds the first one, and because it's
        // just = instead of *=, it had to be an exact match
        let fieldElement = source.querySelector(`[data-field=${field}]`);
        if (fieldElement) {
          if (fieldElement.type === "checkbox") {
            values[field] = fieldElement.checked;
          } else if (fieldElement.type === "uploader") {
            values[field] = fieldElement.files;
          } else {
            if (field.indexOf("-") > -1) {
              let frags = field.split("-");
              values[frags[0]] = values[frags[0]] || {};
              values[frags[0]][frags[1]] = fieldElement.value || "";
            }
            values[field] = fieldElement.value || "";
          }
        } else {
          if (source.querySelector(`[title="array-widget"]`)) {
            // FOR ARRAY-WIDGETS
          
            // the *= means "includes" ${field}, so if field == arrayField
            // then it will includes element with arrayField-0 and arrayField-1
            let arrayElement = source.querySelectorAll(`[data-field*=${field}]`);
           
            let valuesArray = []
            for (let value of arrayElement) {
              valuesArray.push(value.value)
            }
            values[field] = valuesArray
            console.log(values)
          } else if (source.querySelector(`[title="dictionary-widget"]`)) {
            // FOR DICTIONARY-WIDGETS
          
            // will look for the keys and values
            let dictionaryElementKeys = source.querySelectorAll(`[data-field*=${field}-key]`);
            let dictionaryElementValues = source.querySelectorAll(`[data-field*=${field}-value]`);
            
            let valuesObject = {}
            for (let i = 0; i < dictionaryElementKeys.length; i++) {
              let dictionaryElementKey = dictionaryElementKeys[i].value
              let dictionaryElementValue = dictionaryElementValues[i].value
              
              valuesObject[dictionaryElementKey] = dictionaryElementValue
            }
            values[field] = valuesObject
            console.log(values)
          }
        }
      }
    });

    try {
      //console.log('Last call, values: ', this.action, values);
      let retVal = await DappLib[this.action].call(null, values);
      let resultNode = DappLib.getFormattedResultNode(retVal, this.return);
      this.fireClickEvent(retVal, resultNode);
    } catch (e) {
      if (e.message && e.message.indexOf("run Out of Gas") > -1) {
        e.message =
          "Can't access the blockchain. Check that access to it isn't blocked. During development this error usually means your test blockchain is not running or has test accounts that don't match the accounts in your development configuration.";
      }
      let retVal = {
        type: DappLib.DAPP_RESULT_ERROR,
        label: "Error Message",
        result: e
      };
      let resultNode = DappLib.getFormattedResultNode(retVal);
      this.fireClickEvent(retVal, resultNode);
    } finally {
      this.render();
    }
  }

  fireClickEvent(data, node) {
    this['click']({
      detail: {
        info: data,
        node: node
      }
    });
  }
}
