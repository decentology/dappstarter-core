import DOM from './dom';
import CustomElement from './custom-element';

export default class PageLoader extends CustomElement {
   

    static get ATTRIBUTE_NAME() {
        return 'name'
    }
    static get ATTRIBUTE_ROUTE() {
        return 'route'
    }

    static get attributes() {
        return [
            PageLoader.ATTRIBUTE_NAME,
            PageLoader.ATTRIBUTE_ROUTE
        ];
    }

    constructor(...args) {
        super(PageLoader.attributes, ...args);
    }

    async load(pageItem) {
        let self = this;
        self.innerHTML = '';
        self.name = pageItem.name;
        self.title = pageItem.title;
        self.route = pageItem.route;
        self.description = pageItem.description;
        self.category = pageItem.category;

        let pageContent = null
        try {
            await import(`../pages/${self.name}-page.js`);
            pageContent = DOM.create(
                `${self.name.replace('_','-')}-page`, {
                    title: self.title
                });
            // Custom properties need to be set separately
            pageContent.description = self.description
            pageContent.category = self.category;
        } catch (e) {
            console.log(e);
            pageContent = DOM.div(`Error loading content page for "${self.title}"`);
        }
        let content = DOM.create(
            'main',
            {
                id: 'content',
                className: 'p-5'
            },
            [
                pageContent
            ]
        )
        self.appendChild(content);
    }
}


customElements.define('page-loader', PageLoader);