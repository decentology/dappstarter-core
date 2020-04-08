import CustomElement from '../shared/custom-element';

export default class TextWidget extends CustomElement {
    
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
        return TextWidget.attributes; 
    }

    static get attributes() {
        return [
            TextWidget.ATTRIBUTE_FIELD,
            TextWidget.ATTRIBUTE_LABEL,
            TextWidget.ATTRIBUTE_PLACEHOLDER
        ];
    }

    constructor(...args) {
        super(TextWidget.attributes, ...args);
    }

    render() {
        let self = this;
        let content = `
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">${self.label}</span>
            </div>
            <input type="text" data-field="${self.field}" class="form-control" placeholder="${self.placeholder}">
        </div>
`
        self.style.display = 'block';
        if (self.nextSibling) {
            self.classList.add('mb-3')
        }
        self.innerHTML = content;
    }
}


customElements.define('text-widget', TextWidget);