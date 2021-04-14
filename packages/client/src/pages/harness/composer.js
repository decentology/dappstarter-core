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
  }

  getPages() {
    return[]; ///@{ "___composable-list___": "[]"}
  }

  handleClick = e => {
    e.preventDefault();
    this.setPageLoader(e.target.dataset.link);
  };

  setPageLoader(name) {
    let pageLoader = document.getElementById("page-loader");
    pageLoader.load(name, this.getPages());
    this.requestUpdate();
  }

  render() {
    let content = html`
      <div class="container m-auto">
        <div class="row fadeIn mt-3 p-2 block">
          <p class="mt-3">
            Welcome to the Composer! Feature modules that are composable appear on this page and
            let you further customize the module's capabilities. To continue, 
            select a feature module.           
          </p>
        </div>
        <ul class="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${this.getPages().map(page =>
              html`<li class="col-span-1 bg-white rounded-lg shadow h-36">
                      <div class="flex flex-col items-center p-6 h-full">
                        <div class="font-bold text-xl mb-2">${page.title}</div>
                        <div class="flex flex-row flex-grow">
                            <button
                              @click=${this.handleClick}
                              data-link=${page.name}
                              class="self-end text-white font-bold py-2 px-8 rounded bg-green-500 hover:bg-green-700"}"
                            >
                              Compose
                            </button>
                          </div>
                      </div>
                    </li>`)
        }
        </ul>
      </div>
    `; 
    return content;

  }
}

