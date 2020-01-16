import { LitElement, html, css } from 'lit-element';
import './widget-menu';
import './networktables/networktables-sources';
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
          <networktables-sources></networktables-sources>
        ` : html`
          <widget-menu></widget-menu>
        `}
      </div>
    `;
  }
}

customElements.define('side-panel', SidePanel);