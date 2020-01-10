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
        margin-top: 10px;
      }
    `;
  }

  constructor() {
    super();
    this.selectedTab = 0;
  }


  onChange(ev) {
    this.selectedTab = ev.detail.value;
  }

  render() {
    return html`
      <vaadin-tabs @selected-changed="${this.onChange}">
        <vaadin-tab>Sources</vaadin-tab>
        <vaadin-tab>Widgets</vaadin-tab>
      </vaadin-tabs>

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