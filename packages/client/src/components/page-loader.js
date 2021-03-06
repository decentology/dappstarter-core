import DOM from "./dom";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("page-loader")
export default class PageLoader extends LitElement {
  @property()
  name;
  @property()
  route;

  createRenderRoot() {
    return this;
  }

  pageContent = null;

  render() {
    return html`
      <div class="xl:col-start-2 xl:col-span-2 lg:col-start-1">
        <main id="content" class="p-5">${this.pageContent}</main>
      </div>
    `;
  }

  async load(page, pages) {

    let pageItem = pages.find(item => item.name === page);
    if (!pageItem) {
      return;
    }

    window.history.pushState(null, pageItem.title, pageItem.route);

    if (pageItem == null) {
      let pageName = location.href.split("/").pop();
      if (pageName !== "") {
        pageItem = pages.find(x => x.name == pageName);
      } else {
        pageItem = pages[0];
      }
    }

    this.classList.add("relative", "grid", "xl:grid-cols-4", "lg:grid-cols-1");
    this.setAttribute("style", "top: 70px");

    try {
      let pagePrefix = pageItem.name.substr(0, pageItem.name.indexOf('-')+1);
      let modulePage = pageItem.name.replace(pagePrefix, ''); // Removes the module source
      if (modulePage === 'dapp') {
        await import(`../pages/${modulePage}.js`);
      } else if (modulePage === 'harness') {
        await import(`../pages/harness/${modulePage}.js`);
      } else {
        await import(`../pages/harness/${modulePage}-page.js`);
      }
      let pageName = modulePage.replace("_", "-") + "-page";

      this.pageContent = DOM.create(pageName, {
        title: pageItem.title,
        description: pageItem.description,
        category: pageItem.category
      });
    } catch (e) {
      console.log(e);
      this.pageContent = DOM.div(
        `Error loading content page for "${pageItem.title}"`
      );
    }
    this.requestUpdate();
  }
}
