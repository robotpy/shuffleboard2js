import { LitElement, html, css } from 'lit-element';
import './components/dashboard-modal';

class SourceProviderSettingsModal extends LitElement {

  static get properties() {
    return {
      
    }
  }

  constructor() {
    super();
    
  }

  static get styles() {
    return css`
      
    `;
  }

  open() {
    const modalNode = this.shadowRoot.getElementById('modal');
    modalNode.open();
  }

  close() {
    const modalNode = this.shadowRoot.getElementById('modal');
    modalNode.close();
  }

  render() {
    return html`
      <dashboard-modal id="modal" title="Source Provider Settings">
        <p>Settings</p>
      </dashboard-modal>
    `;
  }
}

customElements.define('source-provider-settings-modal', SourceProviderSettingsModal);