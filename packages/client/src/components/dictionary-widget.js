import { LitElement, html, customElement, property } from "lit-element";

@customElement("dictionary-widget")
export default class DictionaryWidget extends LitElement {
    @property({ type: String })
    field = null;
    @property({ type: String })
    label = null;
    @property({ type: String })
    objectLabel = null;
    @property({ type: String })
    keyplaceholder = null;
    @property({ type: String })
    valueplaceholder = null;

    @property()
    htmlWrapper = null;
    @property()
    allFields = null;
    @property()
    count = null;

    createRenderRoot() {
        return this;
    }
    constructor(args) {
        super(args);
    }

    addNewInput() {
        this.allFields = this.allFields.concat(`
        <div class="flex">
            <label class="bg-gray-400 p-2 block rounded rounded-r-none text-gray-500" for="${this.field}-${this.count}">${this.objectLabel}</label>
            <input type="text" data-field="${this.field}-key-${this.count}" id="${this.field}-key-${this.count}"
                class="shadow-inner appearance-none border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="${this.keyplaceholder}" />
            <input type="text" data-field="${this.field}-value-${this.count}" id="${this.field}-value-${this.count}"
                class="shadow-inner appearance-none border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="${this.valueplaceholder}" />
        </div>
        `)

        this.htmlWrapper = html(
            [this.allFields]
        )

        this.count += 1
    }

    deleteElement() {
        this.allFields = this.allFields.substring(this.allFields.indexOf(`</div>`) + 6)
        this.htmlWrapper = html(
            [this.allFields]
        )
        this.count -= 1
    }

    firstUpdated() {
        this.allFields = `
        <div class="flex">
            <label class="bg-gray-400 p-2 block rounded rounded-r-none text-gray-500" for="${this.field}-0">${this.objectLabel}</label>
            <input type="text" data-field="${this.field}-key-0" id="${this.field}-key-0"
                class="shadow-inner appearance-none border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="${this.keyplaceholder}" />
            <input type="text" data-field="${this.field}-value-0" id="${this.field}-value-0"
                class="shadow-inner appearance-none border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="${this.valueplaceholder}" />
        </div>
        `

        this.htmlWrapper = html(
            [this.allFields]
        )

        this.count = 1
    }

    render() {
        this.classList.add("mb-3");

        let content = html`
        <div class="input-group mb-3 bg-gray-300 p-5" title="dictionary-widget">
            <h1 class="bg-gray-200 p-2 block rounded rounded-r-none text-gray-500">${this.label}</h1>
            <button @click="${() => this.addNewInput()}"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+</button>
            <button @click="${() => this.deleteElement()}"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">-</button>
            <div class="flex flex-col">
                ${this.htmlWrapper}
            </div>
        </div>
        `
        return content
    }
}
