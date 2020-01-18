import CustomElement from './custom-element';
import DOM from './dom';
import logo from "../../../dapp/assets/img/dappstarter.png";

export default class PageNavigation extends CustomElement {

    constructor(...args) {
        super(...args);
        this.pageLoader = null;
    }

    getPages() {
        return [{ name: 'home', title: 'Home', route: '/'}].concat([]); ///@{ "___page-list___": "[]"}
    }

    async navigate(name) {
        let self = this;
        let contentPages = self.getPages();
        let pageItem = contentPages.find(item => item.name === name);
        if (!pageItem) {
            return;
        }

        window.history.pushState(null, pageItem.title, pageItem.route);
        self.setPageLoader(pageItem);
    }

    setPageLoader(pageItem) {
        let self = this;
        if (!self.pageLoader) {
            self.pageLoader = DOM.elid('page-loader');
        }

        self.pageLoader.load(pageItem);
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
                        href: 'https://www.trycrypto.com/dappstarter?utm_source=dapp',
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
                ),
                DOM.a({
                    href: 'https://www.trycrypto.com/dappstarter?utm_source=dapp',
                    target: '_new'
                },
                [
                    DOM.img({
                        src: 'https://dappstarter.trycrypto.com/trycrypto-logo-1024.png?r=ds',
                        className: 'text-center fixed-bottom mb-3',
                        style: 'margin-left:55px;max-width:160px;'
                    })
                ])
            ]
        );
        self.appendChild(content);
        self.setPageLoader(contentPages[0]);
    }
}

customElements.define('page-navigation', PageNavigation);