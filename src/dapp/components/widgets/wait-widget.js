import CustomElement from '../shared/custom-element';

export default class WaitWidget extends CustomElement {
    
    static get ATTRIBUTE_WAITING() {
        return 'waiting'
    }
    static get ATTRIBUTE_WAITING_TITLE() {
        return 'waiting-title'
    }
    static get ATTRIBUTE_SIZE() {
        return 'size'
    }

    static get observedAttributes() {
        return WaitWidget.attributes; 
    }

    static get attributes() {
        return [
            WaitWidget.ATTRIBUTE_WAITING,
            WaitWidget.ATTRIBUTE_WAITING_TITLE,
            WaitWidget.ATTRIBUTE_SIZE
        ];
    }


    constructor(...args) {
        super(WaitWidget.attributes, ...args);
    }

    render() {
        let self = this;
        let size = self.size || '100';
        let waitingTitle = self[WaitWidget.ATTRIBUTE_WAITING_TITLE] || 'Waiting...';
        let spinner = `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; display: block; shape-rendering: auto;" width="${size}px" height="${size}px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                <rect x="19" y="19" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0s" calcMode="discrete"></animate>
                </rect><rect x="40" y="19" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.125s" calcMode="discrete"></animate>
                </rect><rect x="61" y="19" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.25s" calcMode="discrete"></animate>
                </rect><rect x="19" y="40" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.875s" calcMode="discrete"></animate>
                </rect><rect x="61" y="40" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.375s" calcMode="discrete"></animate>
                </rect><rect x="19" y="61" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.75s" calcMode="discrete"></animate>
                </rect><rect x="40" y="61" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.625s" calcMode="discrete"></animate>
                </rect><rect x="61" y="61" width="20" height="20" fill="#1d3f72">
                <animate attributeName="fill" values="#5699d2;#1d3f72;#1d3f72" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.5s" calcMode="discrete"></animate>
                </rect>
                </svg>
            `;
        if (self.waiting === 'true') {
            self.innerHTML = `
            <div style="display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:flex-start;align-items:center;align-content:center">
                ${spinner}
                <h6>${waitingTitle}</h6>
            </div>
            `;
        } else {
            self.innerHTML = `<h6>${self.title}</h6>`;
        }
    }
}

customElements.define('wait-widget', WaitWidget);