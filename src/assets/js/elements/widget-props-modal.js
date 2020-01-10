import { LitElement, html, css } from 'lit-element';
import './components/dashboard-modal';
const dialog = require('electron').remote.dialog;

class WidgetPropsModal extends LitElement {

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
    const widgetPropertiesNode = this.shadowRoot.getElementById('widget-properties');
    for (let child of this.children) {
      widgetPropertiesNode.appendChild(child);
    }
    const propertiesModalNode = this.shadowRoot.getElementById('properties-modal');

    propertiesModalNode.open();
  }

  close() {
    const propertiesModalNode = this.shadowRoot.getElementById('properties-modal');
    propertiesModalNode.close();
  }

  render() {
    return html`
      <dashboard-modal id="properties-modal" title="Properties">
        <style>
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          vaadin-button {
            align-self: start;
          }

          footer {
            display: flex;
            justify-content: flex-end;
          }
        </style>
        <header>
          <h4>Properties</h4>
          <vaadin-button theme="icon large tertiary" aria-label="Close modal" @click="${this.close}">
            <iron-icon icon="lumo:cross" slot="prefix"></iron-icon>
          </vaadin-button>  
        </header>
        <hr/>
        <div class="modal-body">
          <div id="widget-properties">
          </div>
        </div>

        <hr/>
        <footer>
          <vaadin-button aria-label="Close modal" @click="${this.close}">
            Close
          </vaadin-button>  
        </footer>

      </dashboard-modal>
    `;
  }
}

customElements.define('widget-props-modal', WidgetPropsModal);