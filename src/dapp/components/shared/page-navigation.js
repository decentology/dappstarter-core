import CustomElement from './custom-element';
import DOM from './dom';
import logo from "../../../dapp/assets/img/dappstarter.png";

export default class PageNavigation extends CustomElement {

    constructor(...args) {
        super(...args);
    }

    getPages() {
        return [{ name: 'home', title: 'Home', route: '/'}].concat([]); ///@{ "___page-list___": "[]"}
    }

    async navigate(name) {
        let self = this;

        let contentPages = self.getPages();
        let pageItem = contentPages.find(item => item.name === name);
        if (!pageItem) {
            return
        }
        let content = DOM.elid('content');
        content.innerHTML = '';

        window.history.pushState(null, pageItem.title, pageItem.route);
        try {
            await import(`../pages/${pageItem.name}-page.js`);
            let pageContent = DOM.create(
                `${pageItem.name}-page`, {
                    title: pageItem.title
                });
            // Custom properties need to be set separately
            pageContent.description = pageItem.description
            pageContent.category = pageItem.category;

            content.appendChild(pageContent);
        } catch (e) {
            content.innerHTML = `Error loading content page for "${pageItem.title}"`;
        }
    }

    render() {

        let self = this;
        let listId = 'item-list';
        let listItems = [];
        let contentPages = self.getPages();
        contentPages.map((pageItem) => {
            listItems.push(
                DOM.a([
                    DOM.li({
                            className: 'list-group-item',
                            onclick: (e) => {
                                document.querySelector('#' + listId).childNodes.forEach((node) => node.className = '');
                                e.target.parentNode.className = 'active';
                                self.navigate(pageItem.name);
                            }
                        },
                        pageItem.title
                    )
                ]));
        });


        let content = DOM.div({
                className: 'sidebar-fixed position-fixed'
            },
            [
                DOM.a({
                        href: 'https://www.trycrypto.com/dappstarter',
                        className: 'logo-wrapper waves-effect'
                    },
                    [
                        DOM.img({
                            alt: 'DappStarter Logo',
                            className: 'img-fluid',
                            src: logo
                        })
                    ]

                ),
                DOM.ul({
                        id: listId,
                        className: 'list-group list-group-flush'
                    },
                    listItems
                )
            ]
        );
        self.appendChild(content);

    }
}

customElements.define('page-navigation', PageNavigation);