import {
    CustomElement
} from '../dapp-ui';

export default class ActionCard extends CustomElement {

    static get ATTRIBUTE_CATEGORY() {
        return 'category'
    }
    static get ATTRIBUTE_BLOCK() {
        return 'block'
    }
    static get ATTRIBUTE_ACTION() {
        return 'action'
    }
    static get ATTRIBUTE_DESCRIPTION() {
        return 'description'
    }
    static get ATTRIBUTE_TEMPLATE_ID() {
        return 'templateId'
    }

    static get observedAttributes() {
        return ActionCard.attributes; 
    }

    static get attributes() {
        return [
            ActionCard.ATTRIBUTE_CATEGORY,
            ActionCard.ATTRIBUTE_BLOCK,
            ActionCard.ATTRIBUTE_ACTION,
            ActionCard.ATTRIBUTE_DESCRIPTION,
            ActionCard.ATTRIBUTE_TEMPLATE_ID
        ];
    }

    constructor(...args) {
        const self = super(ActionCard.attributes, ...args);
    }

    render() {
        let self = this;
        let cardId = `card-${self[ActionCard.ATTRIBUTE_TEMPLATE_ID]}`;
        let content = `
<div class="row mb-4">
    <div class="col-lg-8 mb-4">
        <div class="card">
            <div class="white-text card-header blue-gradient">
                <h5>${self[ActionCard.ATTRIBUTE_ACTION]}</h5>
            </div>
            <div class="card-body" id="${cardId}">
            </div>
            <div class="rounded-bottom mdb-color lighten-5 pt-2 pb-2 pr-2">
                <div class="row pl-2 pr-2">
                    <div class="col-lg-8">
                        <h6>${self[ActionCard.ATTRIBUTE_DESCRIPTION]}</h6>
                    </div>
                    <div class="col-lg-4 text-right">
                        <button class="btn-primary btn Ripple-parent">GO</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`
        self.innerHTML = content;

        let template = document.querySelector(`#${self[ActionCard.ATTRIBUTE_TEMPLATE_ID]}`);
        let templateContent = document.importNode(template.content, true);
        document.querySelector(`#${cardId}`).appendChild(templateContent);
    }

}

customElements.define('action-card', ActionCard);