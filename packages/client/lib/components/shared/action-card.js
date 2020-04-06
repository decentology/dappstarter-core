import DappLib from '../../dapp-lib';
import CustomElement from './custom-element';
import ActionButton from './action-button';
import SvgIcons from '../widgets/svg-icons';
import '../widgets/wait-widget';

export default class ActionCard extends CustomElement {

    static get ATTRIBUTE_ACTION() {
        return 'action'
    }
    static get ATTRIBUTE_METHOD() {
        return 'method'
    }
    static get ATTRIBUTE_FIELDS() {
        return 'fields'
    }
    static get ATTRIBUTE_MESSAGE() {
        return 'message'
    }
    static get ATTRIBUTE_RETURN() {
        return 'return'
    }
    static get ATTRIBUTE_TARGET() {
        return 'target'
    }
    static get observedAttributes() {
        return ActionCard.attributes; 
    }

    static get attributes() {
        return [
            ActionCard.ATTRIBUTE_ACTION,
            ActionCard.ATTRIBUTE_METHOD,
            ActionCard.ATTRIBUTE_FIELDS,
            ActionCard.ATTRIBUTE_MESSAGE,
            ActionCard.ATTRIBUTE_RETURN,
            ActionCard.ATTRIBUTE_TARGET
        ];
    }

    constructor(...args) {
        super(ActionCard.attributes, ...args);
        this.clicked = false;
        if (!this.id) {
            this.id =  this.uniqueId;
        }

    }

    static content(me) {
        return `
    <div class="card">
        <div class="white-text card-header aqua-gradient d-flex justify-content-between align-items-center">
            <h5>${me.title}</h5>
            <span class="text-right circle-icon">${ me[ActionCard.ATTRIBUTE_METHOD] === ActionCard.METHOD_POST ? SvgIcons.readWrite : SvgIcons.readOnly }</span>
        </div>
        <div class="${ me.innerHTML.indexOf('<') > -1 ? 'card-body-padded' : 'card-body'}" id="card-body-${me.action}">
            ${me.innerHTML}
        </div>
        <div class="rounded-bottom grey lighten-2 pt-2 pb-2 pr-2">
            <div class="row pl-2 pr-2">
                <div class="col-lg-8 d-flex align-items-center">
                    <wait-widget size="50" title="${me[ActionCard.ATTRIBUTE_DESCRIPTION]}" waiting-title="${me[ActionCard.ATTRIBUTE_MESSAGE] || 'Waiting for transaction'}"></wait-widget>
                </div>
                <div class="button-container col-lg-4 text-right">  
                </div>
            </div>
        </div>
    </div>
`
    }


    render() {
        let self = this;
        self.innerHTML = ActionCard.content(self); 
        self.className = 'col-lg-8 col-md-10 col-sm-12 mb-5 ' + self.className;
        if (self.action) {
            self.querySelector('.button-container').innerHTML = `<action-button 
                                                                        source="#${self.id}" 
                                                                        action="${self.action}" 
                                                                        method="${self.method}" 
                                                                        fields="${self.fields}"
                                                                        return="${self.return}">
                                                                </action-button>`;
            self.querySelector('action-button').addEventListener(ActionButton.EVENT_CLICK, (e) => {
                let resultPanel = document.getElementById('resultPanel');

                if (e.detail.info.type === DappLib.DAPP_RESULT_ERROR) {
                    resultPanel.append(e.detail.node);
                    resultPanel.open();
                } else {
                    if (self.method === ActionCard.METHOD_GET) {
                        let existing = self.querySelectorAll(`#card-body-${self.action} .note`);
                        existing.forEach(el => el.setAttribute('style', 'opacity:0.5;'));
                        self.querySelector(`#card-body-${self.action}`).append(e.detail.node);
                    } else {
                        if (self.target) {
                            let targetPanel = document.getElementById(self.target);
                            targetPanel.append(e.detail.node);
                        } else {
                            resultPanel.append(e.detail.node);
                            resultPanel.open();            
                        }
                    }    
                }
            });

        }
    }

    
 
}

customElements.define('action-card', ActionCard);