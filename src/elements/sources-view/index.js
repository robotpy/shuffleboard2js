import { LitElement, html, css } from 'lit-element';
import store from '../../redux/store';
import { connect } from 'pwa-helpers';
import './source';
import { map } from 'lodash';

class SourcesView extends connect(store)(LitElement) {

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        padding: 0px 13px;
        box-sizing: border-box;
      }

      header {
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #bbb;
        user-select: none;
        padding: 3px 0;
      }

      header span {
        display: inline-block;
      }

      header .key {
        width: 55%;
      }

      header .value {
        width: 38%;
      }
    `
  }

  static get properties() {
    return {
      sources: { type: Object },
      providerName : { type: String, attribute: 'provider-name' }
    };
  }

  constructor() {
    super();
    this.sources = {};
    this.providerName = null;
  }

  get providerName() {
    return this._providerName;
  }

  set providerName(value) {
    const oldValue = this._providerName;
    this._providerName = value;
    this.requestUpdate('providerName', oldValue);
    this.sources = dashboard.store.getState().sources[value] || {};
  }

  stateChanged(state) {
    this.sources = state.sources[this.providerName] || {};
  }

  render() {
    return html`
      <header>
        <span class="key">Key</span>
        <span class="value">Value</span>
      </header>

      ${map(this.sources.__sources__ || [], (source, name) => html`
        <source-view 
          label="${name}" 
          provider-name="${this.providerName}"
          .source="${{...source}}"
        >
        </source-view>
      `)}
    `;
  }

}

customElements.define('sources-view', SourcesView);