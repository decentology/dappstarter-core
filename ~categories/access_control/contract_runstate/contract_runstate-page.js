///(page-post-content
import "../components/page-panel.js";
import "../../../lib/components/shared/action-card.js";
import "../components/page-body.js";
import "../../../lib/components/widgets/switch-widget.js";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("contract-runstate-page")
export default class ContractRunStatePage extends LitElement {
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

    this.eventHandlerRegistered = false;
    if (!this.eventHandlerRegistered) {
      this.eventHandlerRegistered = true;
      DappLib.onContractRunStateChange(result => {
        let resultPanel = this.querySelector("#resultPanel");
        resultPanel.prepend(DappLib.getFormattedResultNode(result));
        resultPanel.open();
      });
    }
  }

  render() {
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT RUN STATE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
    return html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >
        <action-card
          title="Is Contract Run State Active"
          description="Check if contract run state is active"
          action="isContractRunStateActive"
          method="get"
        >
        </action-card>

        <action-card
          title="Set Contract Run State"
          description="Set contract run state to active or inactive"
          action="setContractRunState"
          method="post"
          fields="mode"
        >
          <switch-widget field="mode" label="Contract Run State" placeholder="">
          </switch-widget>
        </action-card>
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;
  }
}
///)