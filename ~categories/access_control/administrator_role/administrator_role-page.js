///(page-post-content
import "../components/page-panel.js";
import "../../../lib/components/shared/action-card.js";
import "../components/page-body.js";
import "../../../lib/components/widgets/account-widget.js";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("administrator-role-page")
export default class AdministratorRolePage extends LitElement {
  @property()
  category;
  @property()
  description;
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

  
  render() {
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: ADMINISTRATOR ROLE  <<<<<<<<<<<<<<<<<<<<<<<<<<*/

    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >
        <action-card
          title="Is Contract Admin"
          description="Check if an account is a contract administrator"
          action="isContractAdmin"
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

        <action-card
          title="Add Contract Admin"
          description="Add an account as a contract administrator"
          action="addContractAdmin"
          method="post"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address of administrator to add"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Remove Contract Admin"
          description="Remove an account as a contract administrator"
          action="removeContractAdmin"
          method="post"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address of administrator to remove"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Remove Last Contract Admin"
          description="Remove an account as a contract administrator"
          action="removeLastContractAdmin"
          method="post"
          fields="account"
        >
          <h6 class="bg-red-700 mb-3 p-4 text-white">
            This transaction will remove the last remaining administrator. Any
            functions that use requireContractAdmin() will fail, effectively
            making this a fully decentralized contract. This action is
            irreversible. Proceed with caution.
          </h6>

          <account-widget
            field="account"
            label="Account"
            placeholder="Account address of administrator to remove"
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