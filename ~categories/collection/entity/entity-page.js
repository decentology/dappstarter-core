///(page-post-content

import '../../../lib/components/shared/action-card.js';
import '../components/page-body.js';
import "../components/page-panel.js";
import '../../../lib/components/widgets/text-widget.js';
import '../../../lib/components/widgets/number-widget.js';
import '../../../lib/components/widgets/account-widget.js';
import DOM from "../../../lib/components/shared/dom";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("entity-page")
export default class EntityPage extends LitElement {
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
        this.pagesInfo = {
            page: 1,
            resultsPerPage: 10
        }

        setTimeout(async () => {
            const response = await DappLib.getEntityCount();
            const json = await response;
            this.entitiesCount = json.result;
    
            DOM.elid('pageNumbers').innerHTML = this.showPageNumbers() + this.showResultsPerPage();

        }, 0);
    }

    showPageNumbers() {
        let optionsString = '';
        if (parseInt(this.entitiesCount) % this.pagesInfo.resultsPerPage >= 1) {
            //more than one page of results
            let pageNumbers = Math.ceil(parseInt(this.entitiesCount) / this.pagesInfo.resultsPerPage);

            for (let step = 1; step <= pageNumbers; step++) {
                optionsString = optionsString + '<option value="' + `${step}` + '">' + `${step}` + '</option>';
            };
        } else {
            //less than one page of results
            optionsString = '<option value="1">1</option>';
        };
        return '<div style="display: inline-block; margin-right: 20pt;"><label for="page">Page Number:</label><select id="page" data-field="page">' + optionsString + '</select></div>';
    }

    showResultsPerPage() {
        return (
            '<div style="display: inline-block"><label for="results">Results Per Page:</label><select id="results" data-field="resultsPerPage"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option> </select></div>'
        );
    }

    render() {
        return html`
            <page-body
                title="${this.title}"
                category="${this.category}"
                description="${this.description}"
            >
                <action-card
                    title="Get Entity"
                    description="Get entity details"
                    action="getEntity"
                    method="get"
                    fields="id"
                >
                    <number-widget field="id" label="Entity ID" placeholder="Entity ID">
                        </number-widget>
                    </action-card>

                    <action-card
                        title="Get Entities by Creator"
                        description="Get all Entity Ids where Account is the creator"
                        action="getEntitiesByCreator"
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
                    title="Get Entities by Page"
                    description="Get all Entities by page"
                    action="getEntitiesByPage"
                    method="get"

                    fields="page resultsPerPage"
                >
                    <div id="pageNumbers"></div>
                </action-card>

                <action-card
                    title="Add Entity"
                    description="Set entity details"
                    action="setEntity"
                    method="post"
                    fields="title count"
                >
                    <text-widget
                        field="title"
                        label="Title"
                        placeholder="Title for entity"
                    >
                    </text-widget>

                    <number-widget
                        field="count"
                        label="Count"
                        placeholder="Count for entity"
                    >
                    </number-widget>
                </action-card>

                <action-card
                    title="Update Entity"
                    description="Set entity details"
                    action="setEntity"
                    method="post"
                    fields="title count id"
                >
                    <number-widget field="id" label="Entity ID" placeholder="Entity ID">
                    </number-widget>

                    <text-widget
                        field="title"
                        label="Title"
                        placeholder="Title for entity"
                    >
                    </text-widget>

                    <number-widget
                        field="count"
                        label="Count"
                        placeholder="Count for entity"
                    >
                    </number-widget>
                </action-card>
            </page-body>
            <page-panel id="resultPanel"></page-panel>
        `;
    }
}
///)

