import { LitElement, html } from 'lit-element';
import { clearNetworkTables } from '../actions';
import store from '../store';
import { includeStyles } from '../render-utils';
import './components/dashboard-modal';

class NetworktablesSettingsModal extends LitElement {

  static get properties() { 
    return {
      robotIp: { type: String }
    };
  }

  constructor() {
    super();
    this.robotIp = dashboard.storage.getRobotIp();
    NetworkTables.connect(this.robotIp);
  }

  onRobotIpChange(ev) {
    this.robotIp = ev.target.value;
    store.dispatch(clearNetworkTables());
    NetworkTables.connect(this.robotIp);
    dashboard.storage.setRobotIp(this.robotIp);
  };

  open() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.open();
  }

  close() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.close();
  }

  render() {
    return html`
      ${includeStyles()}
      <dashboard-modal id="modal" title="NetworkTables Settings">
        <div class="modal-body">
          <form>
            <div class="form-group row">
              <label for="sever" class="col-sm-2 col-form-label">Server</label>
              <div class="col-sm-10">
                <input 
                  type="text" 
                  class="form-control" 
                  id="server" 
                  value="${this.robotIp}"
                  @change=${this.onRobotIpChange}>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="${this.close}">Close</button>
        </div>
      </dashboard-modal>
    `;
  }
}

customElements.define('networktables-settings-modal', NetworktablesSettingsModal);