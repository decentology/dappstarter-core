import CustomElement from '../../../lib/components/shared/custom-element';
import DOM from '../../../lib/components/shared/dom';
import logo from "../../../dapp/assets/img/dappstarter.png";

export default class PageNavigation extends CustomElement {

    constructor(...args) {
        super(...args);
        this.pageLoader = null;
        this.listId = 'list-id';
        this.collapsed = false;
    }

    getPages() {
        let staticPages = [{
            name: 'dapp',
            title: 'My Dapp',
            route: '/'
        }, {
            name: 'admin',
            title: 'Dapp Admin',
            route: '/admin',
            hidden: true
        }]
        return staticPages.concat([]); ///@{ "___page-list___": "[]"}
    }

    navigate(name) {
        let self = this;
        let contentPages = self.getPages();
        let pageItem = contentPages.find(item => item.name === name);
        if (!pageItem) {
            return;
        }

        window.history.pushState(null, pageItem.title, pageItem.route);
        self.setPageLoader(pageItem);
    }

    handleClick(e) {
        let self = this;
        document.querySelector('#' + self.listId).childNodes.forEach((node) => node.className = '');
        try { // Try-catch so if feature blocks are removed from nav this code keeps working
            document.querySelector('#' + self.listId + '-blocks').childNodes.forEach((node) => node.className = '');
        }
        catch(e) {
        }
        e.target.parentNode.className = 'active';
        self.navigate(e.target.dataset.link);
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
        let listItems = [];
        let contentPages = self.getPages();
        let startPage = contentPages[0];
        contentPages.map((pageItem) => {
            if (pageItem.hidden && pageItem.hidden === true) { return; }
            let active = false;
            if (location.href.endsWith(pageItem.route)) {
                startPage = pageItem;
                active = true;
            }
            let linkItem = DOM.li({
                                    className: 'list-group-item',      
                                    onclick: (e) => {
                                        self.handleClick(e);
                                    }
                                },
                                pageItem.title
                            );
            linkItem.dataset.link = pageItem.name;
            listItems.push(
                DOM.a({
                    className: (active ? 'active' : '')
                },
                [
                    linkItem
                ]));
        });


        let content = DOM.div({
                className: 'sidebar-fixed position-fixed sidebar-collapsed'
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
                        id: self.listId,
                        className: 'list-group list-group-flush'
                    },
                    listItems.slice(0, 1)
                ),

                // Remove the block between //BEGIN //END below to remove feature blocks from navigation
                // BEGIN: Feature Blocks
                DOM.h4({
                    className: 'mt-5 mb-2'
                }, 
                "Feature Blocks"),
                DOM.ul({
                    id: self.listId + '-blocks',
                    className: 'list-group list-group-flush'
                },
                listItems.slice(1)
                ),
                // END: Feature Blocks

            ]
        );
        let handle = DOM.div({
            className: 'sidebar-handle position-fixed'
        }, [
            DOM.div({
                className: 'sidebar-handle-gripper'
            })
        ]);
        self.appendChild(content);
        self.appendChild(handle);
        self.setPageLoader(startPage);

        self.querySelector('.sidebar-handle').addEventListener('click', () => {
            if (self.collapsed === true) {
                self.collapsed = false;
                self.querySelector('.sidebar-fixed').classList.remove('sidebar-fixed-collapsed');
                self.querySelector('.sidebar-handle').classList.remove('sidebar-handle-collapsed');
                if (document.querySelector('.page-footer')) {
                    document.querySelector('.page-footer').classList.remove('sidebar-handle-collapsed');
                }
            } else {
                self.collapsed = true;
                self.querySelector('.sidebar-fixed').classList.add('sidebar-fixed-collapsed');
                self.querySelector('.sidebar-handle').classList.add('sidebar-handle-collapsed');
                if (document.querySelector('.page-footer')) {
                    document.querySelector('.page-footer').classList.add('sidebar-handle-collapsed');
                }
            }
        });
    }
}

customElements.define('page-navigation', PageNavigation);