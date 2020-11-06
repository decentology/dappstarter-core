///(page-post-content
import "../components/page-panel.js";
import "../components/page-body.js";
import "../../../lib/components/shared/action-card.js";
import "../../../lib/components/widgets/text-widget.js";
import "../../../lib/components/widgets/number-widget.js";
import "../../../lib/components/widgets/account-widget.js";
import UploadWidget from "../../../lib/components/widgets/upload-widget.js";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("sia-page")
export default class SiaPage extends LitElement {
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
    this.mode = "single"; ///@{ "mode": "single" }
    this.files = [];
    DappLib.onAddSiaDocument((result) => {
      let resultPanel = this.querySelector("#resultPanel");
      resultPanel.append(DappLib.getFormattedResultNode(result));
      resultPanel.open();
    });
  }

  render() {
    let content = html`
        <page-body title="${this.title}" category="${
      this.category
    }" description="${this.description}">
    <action-card 
                title="Get Document" description="Get Sia document using its ID"
                action="getSiaDocument" method="get" fields="id">
                <number-widget 
                    field="id" label="Doc ID" placeholder="Document ID">
                </number-widget>
            </action-card>

            <action-card 
                title="Get Documents by Owner" description="Get all Sia documents for any account"
                action="getSiaDocumentsByOwner" method="get" fields="account">
                    <account-widget 
                        field="account" label="Account" placeholder="Account address">
                    </account-widget>
            </action-card>

            <action-card 
                title="Add Document" description="Upload document to Sia and add hash to contract"
                action="addSiaDocument" method="post" fields="files label mode"
                target="card-body-addSiaDocument"
                message="Waiting for Sia upload and smart contract transaction">
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