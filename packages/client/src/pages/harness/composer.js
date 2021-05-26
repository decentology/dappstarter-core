import DappLib from "@decentology/dappstarter-dapplib";
import DOM from "../../components/dom";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("composer-page")
export default class ComposerPage extends LitElement {
  @property()
  get;
  @property()
  post;
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }
  constructor(args) {
    super(args);
    this.apiUrl = 'http://localhost:5002/api/composer';
  }

  getModules() {
    return[]; ///@{ "___composable-list___": "[]"}
  }


  updateProject(moduleName, feature, option) {
    let self = this;
    fetch(`${this.apiUrl}/process/${moduleName}/${feature}/${option}`, 
      { 
        method: 'post',
        body: JSON.stringify(DappLib.getManifest()),
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: { 'Content-Type': 'application/json' }
      })
      .then((response) => {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
      });
  }

  customizeModule(moduleName) {
    let self = this;
    let optionsHtml = '';
    fetch(`${self.apiUrl}/info/${moduleName}`)
      .then(response => response.json())
      .then(config => {
        let buttons = [];
        for(let feature in config) {
          let featureInfo = config[feature];
          optionsHtml += `<h2 class="font-bold text-xl mb-0 mt-10">${ featureInfo.title } Options</h2>`;
          featureInfo.options.forEach((option) => {
            optionsHtml += `
              <div class="bg-white rounded-lg shadow mt-10 p-10">
                  <h3 class="font-bold text-l">${ option.title }</h3>
                  <div class="mt-5 mb-5"><img src="data:image/jpeg;base64, ${option.preview}" alt="Preview" /></div>
                  <p class="text-gray-700 text-base mb-3">${ option.description }</p>
                  <button id="button-${option.name}"
                    @click=${(e) => { e.preventDefault(); self.updateProject(moduleName, feature, option.name); }}
                    class="self-end text-white font-bold py-2 px-8 rounded bg-green-500 hover:bg-green-700"}"
                  >
                    Update Project 
                  </button>

              </div>
            `
            buttons.push({ id: `button-${option.name}`, moduleName, feature, option: option.name })

          });
        }
  
        document.getElementById('options').innerHTML = optionsHtml;
        buttons.forEach((button) => {
          document.getElementById(button.id).addEventListener('click', () => {
            self.updateProject(button.moduleName, button.feature, button.option);
          });
        });

    });
  };

  setPageLoader(name) {
    let pageLoader = document.getElementById("page-loader");
    pageLoader.load(name, this.getModules());
    this.requestUpdate();
  }

  renderModuleView() {
    let self = this;
    return self.getModules().map(module =>
      html`<li class="col-span-1 h-36">
              <button
                @click=${(e) => { e.preventDefault(); self.customizeModule(module.name.split('-')[1]); }}
                class="self-end text-white font-bold py-2 px-8 rounded bg-green-500 hover:bg-green-700"}"
              >
                Customize ${module.title}
              </button>

            </li>`);
  }

  render() {
    let content = html`
      <div class="container m-auto">
        <div class="row fadeIn mt-3 p-2 block">
          <p class="mt-3">
            Composable modules in your project appear here. Select a module to customize its features.          
          </p>
        </div>
        <ul class="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${ this.renderModuleView() }
        </ul>
        <div id="options" class="mt-3"></div>
      </div>
    `; 
    return content;

  }
}


