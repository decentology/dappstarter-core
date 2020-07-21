///(page-post-content
import "./components/page-panel.js";
import "./components/page-body.js";
import "../../lib/components/shared/action-card.js";
import "../../lib/components/widgets/account-widget.js";
import "../../lib/components/widgets/text-widget.js";
import "../../lib/components/widgets/number-widget.js";
import "../../lib/components/widgets/upload-widget.js";
import DappLib from "@trycrypto/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('ballot-page')
export default class BallotPage extends LitElement {
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
  }

  render() {
    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >

        <action-card
          title="Initialize Proposals"
          description="Initializes proposals for voting."
          action="initializeProposals"
          method="post"
          fields="admin files"
        >
          <account-widget
              field="admin"
              label="Administrator"
              placeholder="Account address"
            >
            </account-widget>

            <upload-widget data-field="files"
                        field="file" label="Ballot Proposals" 
                        placeholder="Select ballot proposals" 
                        multiple="true">
            </upload-widget>

        </action-card>

        <action-card
          title="Issue Ballot"
          description="Issues a ballot to an account for voting."
          action="issueBallot"
          method="post"
          fields="admin voter"
        >
          <account-widget
            field="admin"
            label="Administrator"
            placeholder="Account address"
          >
          </account-widget>

          <account-widget
            field="voter"
            label="Voter"
            placeholder="Account address"
          >
          </account-widget>

        </action-card>


        <action-card
          title="Get NFT IDs"
          description="Get NFT IDs for Account"
          action="getIDs"
          method="get"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address"
          >
          </account-widget>
        </action-card>


      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)
