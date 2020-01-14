import { LitElement, html } from 'lit-element';
import { ntStyles } from './networktables-styles';
import store from '../../redux/store';
import { connect } from 'pwa-helpers';
import './nt-subable';

class NetworktablesSources extends connect(store)(LitElement) {

  static get styles() {
    return ntStyles;
  }

  static get properties() {
    return {
      values: { type: Object }
    };
  }

  constructor() {
    super();
    this.values = {};
  }

  stateChanged(state) {
    this.values = state.networktables.values;
  }

  render() {
    return html`
      <div class="table">
        <div class="table-row header">
          <span class="row-item key">Key</span>
          <span class="row-item value">Value</span>
        </div>
        <nt-subtable 
          ntKey="/" 
          keyLabel="root" 
          .values="${this.values}"
        >
        </nt-subtable>
      </div>
    `;
  }

}

customElements.define('networktables-sources', NetworktablesSources);