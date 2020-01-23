import CustomElement from '../shared/custom-element';
import Uppy from '@uppy/core';
import UppyDashboard from '@uppy/dashboard';

export default class UploadWidget extends CustomElement {

    static get ATTRIBUTE_FIELD() {
        return 'field'
    }
    static get ATTRIBUTE_LABEL() {
        return 'label'
    }
    static get ATTRIBUTE_PLACEHOLDER() {
        return 'placeholder'
    }
    static get ATTRIBUTE_MULTIPLE() {
        return 'multiple'
    }
    static get ATTRIBUTE_MAX_SIZE() {
        return 'maxsize'
    }
    static get EVENT_FILES_CHANGED() {
        return 'filesChanged'
    }
    static get observedAttributes() {
        return UploadWidget.attributes;
    }

    static get attributes() {
        return [
            UploadWidget.ATTRIBUTE_FIELD,
            UploadWidget.ATTRIBUTE_LABEL,
            UploadWidget.ATTRIBUTE_PLACEHOLDER,
            UploadWidget.ATTRIBUTE_MULTIPLE,
            UploadWidget.ATTRIBUTE_MAX_SIZE
        ];
    }

    constructor(...args) {
        super(UploadWidget.attributes, ...args);
        this.type = 'uploader';
        this.uppy = null;
        this.files = [];
    }

    render() {
        let self = this;

        if (!self.maxsize) {
            self.maxsize = '2000000';
        }

        let content = `
            <div id="upload-container-${self.uniqueId}"></div>
`
        self.style.display = 'block';
        if (self.nextSibling) {
            self.classList.add('mb-3')
        }
        self.innerHTML = content;
        self.uppy = Uppy({
                debug: false,
                autoProceed: false,
                restrictions: {
                    maxFileSize: Number(self.maxsize),
                    maxNumberOfFiles: self.multiple === 'true' ? 10 : 1,
                    minNumberOfFiles: 1,
                    allowedFileTypes: null
                }
            })
            .use(UppyDashboard, {
                id: `Dashboard-${self.uniqueId}`,
                autoProceed: false,
                hideUploadButton: true,
                hideRetryButton: true,
                hidePauseResumeButton: true,
                hideCancelButton: true,
                showSelectedFiles: true,
                proudlyDisplayPoweredByUppy: false,
                disableStatusBar: false,
                note: `${self.placeholder}<br />File size limited to ${ String((self.maxsize/1000000).toFixed(0)) }MB`,
                inline: true,
                height: 200,
                width: self.parentElement.clientWidth + 300,
                target: `#upload-container-${self.uniqueId}`
            })
            .on('file-added', (file) => {
                self._fireFilesChangedEvent();
            })
            .on('file-removed', (file) => {
                self._fireFilesChangedEvent();
            })

    }

    _fireFilesChangedEvent() {
        let self = this;
        self.files = self.uppy.getFiles().map(f => f.data);
        let filesChangedEvent = new CustomEvent(
            UploadWidget.EVENT_FILES_CHANGED, 
            {
                detail: {
                    files: self.files
                }
            }
        );
        self.dispatchEvent(filesChangedEvent);
    }

}

customElements.define('upload-widget', UploadWidget);