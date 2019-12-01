import { LitElement, html } from 'lit-element';
import { clearNetworkTables } from '../actions';
import store from '../store';

class NetworktablesSettingsModal extends LitElement {

  static get properties() { 
    return {
      robotIp: { type: String }
    };
  }

  constructor() {
    super();
    this.robotIp = '';
    this.modal = null;
  }

  onRobotIpChange(ev) {
    this.robotIp = ev.target.value;
    store.dispatch(clearNetworkTables());
    NetworkTables.connect(this.robotIp);
    dashboard.storage.setRobotIp(this.robotIp);
  };

  close() {
    this.modal.close();
  }

  firstUpdated() {
    this.modal = $(this).parents('dashboard-modal').get(0);
    NetworkTables.connect(dashboard.storage.getRobotIp());
  }

  render() {
    return html`
      ${includeStyles()}
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
    `;
  }
}

customElements.define('networktables-settings-modal', NetworktablesSettingsModal);