import DOM from "../../../lib/components/shared/dom";
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

  async load(pageItem) {
    this.classList.add("relative", "grid", "xl:grid-cols-4", "lg:grid-cols-1");
    this.setAttribute("style", "top: 70px");

    try {
      await import(`../../pages/${pageItem.name}-page.js`);
      let pageName = pageItem.name.replace("_", "-") + "-page";

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
