import CustomElement from '../shared/custom-element';

export default class NumberWidget extends CustomElement {
    
    static get ATTRIBUTE_FIELD() {
        return 'field'
    }
    static get ATTRIBUTE_LABEL() {
        return 'label'
    }
    static get ATTRIBUTE_PLACEHOLDER() {
        return 'placeholder'
    }

    static get observedAttributes() {
        return NumberWidget.attributes; 
    }

    static get attributes() {
        return [
            NumberWidget.ATTRIBUTE_FIELD,
            NumberWidget.ATTRIBUTE_LABEL,
            NumberWidget.ATTRIBUTE_PLACEHOLDER
        ];
    }

    constructor(...args) {
        super(NumberWidget.attributes, ...args);
    }

    render() {
        let self = this;
        let content = `
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">${self.label}</span>
            </div>
            <input type="text" data-field="${self.field}" class="form-control number" placeholder="${self.placeholder}">
        </div>
`
        self.style.display = 'block';
        if (self.nextSibling) {
            self.classList.add('mb-3')
        }
        self.innerHTML = content;
    }

    value() {
        let self = this;
        return self.querySelector(`[data-field=${self.field}]`).value;
    }
    
}


customElements.define('number-widget', NumberWidget);