import { LitElement, html, css } from 'lit-element';
import './widget-menu';
import './sources-view';
import '@vaadin/vaadin-tabs';
import store from "../redux/store";
import { connect } from 'pwa-helpers';

class SidePanel extends connect(store)(LitElement) {

  static get properties() {
    return {
      selectedTab: { type: Number },
      providerNames: { type: Array }
    };
  }

  static get styles() {
    return css`
      .tab-body {
        position: relative;
        display: block;
      }

      vaadin-accordion-panel {
        border: none;
      }

      vaadin-accordion-panel::part(summary) {
        padding-left: 15px;
      }
    `;
  }

  constructor() {
    super();
    this.selectedTab = 0;
    this.providerNames = [];
  }

  render() {
    return html`
      <div class="tab-body">
        ${this.selectedTab === 0 ? html`
          ${this.providerNames.length > 0 ? html`
            <vaadin-accordion>
              ${this.providerNames.map(providerName => html`
                <vaadin-accordion-panel>
                  <div slot="summary">${providerName}</div>
                  <sources-view provider-name="${providerName}"></sources-view>
                </vaadin-accordion-panel>
              `)}
            </vaadin-accordion>
          ` : ''}
        ` : html`
          <widget-menu></widget-menu>
        `}
      </div>
    `;
  }

  stateChanged(state) {
    this.providerNames = Object.keys(state.sources);
  }
}

customElements.define('side-panel', SidePanel);