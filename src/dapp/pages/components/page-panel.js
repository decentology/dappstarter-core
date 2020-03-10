import CustomElement from '../../../lib/components/shared/custom-element';
import '@grubersjoe/slide-menu/dist/slide-menu.js';

export default class PagePanel extends CustomElement {
    
    constructor(...args) {
        super(...args);
    }

    toggle() {
        this.resultPanel.toggle();
    }

    open() {
        this.resultPanel.open();
    }

    close() {
        this.resultPanel.close();
    }

    toggle() {
        this.resultPanel.close();
    }

    prepend(content) {
        let self = this;
        self.querySelector('.result-list').prepend(self._addAutoFadeToContent(content));
    }

    append(content) {
        let self = this;
        self.querySelector('.result-list').append(self._addAutoFadeToContent(content));
    }

    _addAutoFadeToContent(content) {

        let fadingContent = document.createElement('div');
        fadingContent.appendChild(content);
        window.setTimeout(() => {
            fadingContent.style = 'opacity: 0.5';
        }, 5000);
        
        return fadingContent;
    }

    render() {
        let self = this;
        let content = `
        <div class="result-panel slide-menu z-depth-2 grey lighten-3">
            <div class="slide-menu__control blue-gradient" data-target="this" data-action="toggle">+</div>
            <h4 class="text-center blue-gradient p-2 text-white">Result Viewer</h4>
            <div class="result-list m-3" style="max-height:95%;height:95%;overflow-y:scroll;"></div>
        </div>
        <style>
            .slide-menu {
                position: fixed;
                width: 400px;
                max-width: 85%;
                height: 100vh;
                top: 0;
                right: 0px;
                display: none;
                box-sizing: border-box;
                transform: translateX(100%);
                z-index: 9999;
            }

            .slide-menu,
            .slide-menu .slide-menu__slider {
                transition: transform .3s ease-in-out;
                will-change: transform
            }

            .slide-menu .slide-menu__slider {
                width: 100%;
                transform: translateX(0)
            }

            .slide-menu__control {
                display: block;
                width: 20px;
                height: 46px;
                line-height: 46px;
                position: absolute;
                top: 0;
                left: -20px;
                z-index: 1001;
                color: #ffffff;
                text-align: center;
                font-size: 20px;
                cursor: pointer;
            }

            .slide-menu a {
                cursor: pointer
            }
        </style>
`
        self.innerHTML = content;
        let panelElement = self.querySelector('.result-panel');
        self.resultPanel = new SlideMenu(panelElement,{
            showBackLink: false,
            position: 'right'
        });

        panelElement.addEventListener('sm.open-after', function () {
            self.querySelector('.slide-menu__control').innerHTML = 'x';
        });

        panelElement.addEventListener('sm.close-after', function () {
            self.querySelector('.slide-menu__control').innerHTML = '+';
        });
    }
}


customElements.define('page-panel', PagePanel);