///(page-post-content
import "../components/page-panel.js";
import "../components/page-body.js";
import "../../../lib/components/shared/action-card.js";
import "../../../lib/components/widgets/text-widget.js";
import "../../../lib/components/widgets/number-widget.js";
import "../../../lib/components/widgets/account-widget.js";
import "../../../lib/components/widgets/upload-widget.js";
// TODO: Move references to upload widget
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
// End TODO
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("ipfs-page")
export default class IpfsPage extends LitElement {
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
    this.mode = 'single'; ///@{ "mode": "single" }
    this.files = [];
    this.eventHandlerRegistered = false;
    if (!this.eventHandlerRegistered) {
      this.eventHandlerRegistered = true;
      DappLib.onAddIpfsDocument(result => {
        let resultPanel = this.querySelector("#resultPanel");
        resultPanel.prepend(DappLib.getFormattedResultNode(result));
        resultPanel.open();
      });
    }
  }

  render() {
    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >
        
      <action-card 
                title="Get Document" description="Get IPFS document using its ID"
                action="getIpfsDocument" method="get" fields="id">

                <number-widget 
                    field="id" label="Doc ID" placeholder="Document ID">
                </number-widget>
            </action-card>

            <action-card 
                title="Get Documents by Owner" description="Get all IPFS documents for any account"
                action="getIpfsDocumentsByOwner" method="get" fields="account">

                    <account-widget 
                        field="account" label="Account" placeholder="Account address">
                    </account-widget>

            </action-card>
            <action-card 
                title="Add Document" description="Upload document to IPFS and add hash to contract"
                action="addIpfsDocument" method="post" fields="files label mode"
                target="card-body-addIpfsDocument"
                message="Waiting for IPFS upload and smart contract transaction">
                    <text-widget
                        field="label" label="Label" 
                        placeholder="Description">
                    </text-widget>

                    <upload-widget data-field="files"
                        field="file" label="File${
                          this.mode !== "single" ? "s" : ""
                        }" 
                        placeholder="Select file${
                          this.mode !== "single" ? "s" : ""
                        }" 
                        multiple="${this.mode !== "single" ? "true" : "false"}">
                    </upload-widget>
                    <input type="hidden" data-field="mode" value="${
                      this.mode
                    }" style="display:none;"></input>
            </action-card>

      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;
    return content;
  }
}

///)