import CustomElement from '../shared/custom-element';

export default class SwitchWidget extends CustomElement {
    
    static get ATTRIBUTE_FIELD() {
        return 'field'
    }
    static get ATTRIBUTE_LABEL() {
        return 'label'
    }

    static get observedAttributes() {
        return SwitchWidget.attributes; 
    }

    static get attributes() {
        return [
            SwitchWidget.ATTRIBUTE_FIELD,
            SwitchWidget.ATTRIBUTE_LABEL
        ];
    }

    constructor(...args) {
        super(SwitchWidget.attributes, ...args);
    }


    render() {
        let self = this;
        let content = `
        <div class="input-group">
            <div class="custom-control custom-switch">
                <input type="checkbox" data-field="${self.field}" class="custom-control-input" id="switch-${self.field}">
                <label class="custom-control-label" for="switch-${self.field}">${self.label}</label>
            </div>
        </div>
`
        self.style.display = 'block';
        if (self.nextSibling) {
            self.classList.add('mb-3')
        }
        self.innerHTML = content;
    }
}


customElements.define('switch-widget', SwitchWidget);