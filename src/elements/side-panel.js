import { LitElement, html, css } from 'lit-element';
import './widget-menu';
import './sources-view';
import '@vaadin/vaadin-tabs';

class SidePanel extends LitElement {

  static get properties() {
    return {
      selectedTab: { type: Number }
    };
  }

  static get styles() {
    return css`
      .tab-body {
        position: relative;
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.selectedTab = 0;
  }

  render() {
    return html`
      <div class="tab-body">
        ${this.selectedTab === 0 ? html`
          <sources-view></sources-view>
        ` : html`
          <widget-menu></widget-menu>
        `}
      </div>
    `;
  }
}

customElements.define('side-panel', SidePanel);