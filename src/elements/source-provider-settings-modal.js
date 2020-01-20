import { LitElement, html, css } from 'lit-element';
import './source-provider-settings';
import './components/dashboard-modal';

class SourceProviderSettingsModal extends LitElement {

  static get properties() {
    return {
      
    }
  }

  constructor() {
    super();
    this.settingsNode = null;
  }

  static get styles() {
    return css`
      
    `;
  }

  open() {
    const modalNode = this.shadowRoot.getElementById('modal');
    this.settingsNode.requestUpdate();
    modalNode.open();
  }

  close() {
    const modalNode = this.shadowRoot.getElementById('modal');
    modalNode.close();
  }

  firstUpdated() {
    this.settingsNode = this.shadowRoot.querySelector('source-provider-settings');
  }

  render() {
    return html`
      <dashboard-modal id="modal" title="Source Provider Settings">
        <source-provider-settings></source-provider-settings>
      </dashboard-modal>
    `;
  }
}

customElements.define('source-provider-settings-modal', SourceProviderSettingsModal);