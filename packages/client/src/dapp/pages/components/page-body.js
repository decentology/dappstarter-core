import { LitElement, html, customElement, property } from "lit-element";

@customElement("page-body")
export default class PageBody extends LitElement {
  @property()
  category;
  @property()
  title;
  @property()
  description;

  constructor(args) {
    super(args);
    const children = [...this.children];
    setTimeout(() => {
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        this.querySelector(".slot").append(element);
      }
    }, 0);
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section class="p-2 mb-12">
        <div class="float-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="100"
            height="110"
          >
            <defs>
              <style>
                .cls-1 {
                  fill: url(#linear-gradient);
                }
              </style>
              <linearGradient
                id="linear-gradient"
                y1="51.36"
                x2="92.72"
                y2="51.36"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#00c6f6" />
                <stop offset="1" stop-color="#9be276" />
              </linearGradient>
            </defs>
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <path
                  class="cls-1"
                  d="M47.19,102.72a11.06,11.06,0,0,0,4.71-1.42L87.18,81.13a11.08,11.08,0,0,0,5.54-9.58h0V31.23a11,11,0,0,0-1.37-5.3,1,1,0,0,0-.12-.45,1.12,1.12,0,0,0-.37-.35,11,11,0,0,0-3.68-3.49L51.9,1.48a11.13,11.13,0,0,0-11.08,0L5.54,21.64a11,11,0,0,0-3.67,3.49,1,1,0,0,0-.37.35.93.93,0,0,0-.13.45A11.12,11.12,0,0,0,0,31.23V71.55a11.13,11.13,0,0,0,5.54,9.59l35.28,20.15a10.94,10.94,0,0,0,4.72,1.43m-39-79.35L41.82,3.21a9.12,9.12,0,0,1,9.08,0L86.18,23.37a9,9,0,0,1,2.66,2.34L46.36,50.28,3.88,25.71A9.09,9.09,0,0,1,6.54,23.37Zm0,56A9.08,9.08,0,0,1,2,71.55V31.23a8.92,8.92,0,0,1,.86-3.8L45.36,52v48.7a9.05,9.05,0,0,1-3.54-1.15Zm84.18-7.85h0a9.09,9.09,0,0,1-4.53,7.85L50.9,99.56a8.89,8.89,0,0,1-3.54,1.15V52l42.5-24.58a8.92,8.92,0,0,1,.86,3.8Z"
                />
              </g>
            </g>
          </svg>
        </div>
        <h5 class="text-gray-600">${this.category}</h5>

        <h2 class="mb-2 text-4xl text-gray-700">
          <strong>${this.title}</strong>
        </h2>
        <div class="">
          <div class="text-sm">
            ${this.description}
          </div>
        </div>
      </section>
      <div class="mt-4 slot"></div>
    `;
  }
}
