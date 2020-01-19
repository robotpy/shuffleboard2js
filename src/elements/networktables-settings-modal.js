import { LitElement, html } from 'lit-element';
import { clearNetworkTables } from '../redux/actions';
import store from '../redux/store';
import './components/dashboard-modal';

class NetworktablesSettingsModal extends LitElement {

  static get properties() { 
    return {
      robotIp: { type: String }
    };
  }

  constructor() {
    super();
    this.robotIp = dashboard.storage.get('robotIp', 'localhost');
    NetworkTables.connect(this.robotIp);
    
    // Keep trying to connect if a connection hasn't been found
    setInterval(() => {
      if (!NetworkTables.isRobotConnected()) {
        NetworkTables.connect(this.robotIp);
      }
    }, 500);

    NetworkTables.addRobotConnectionListener(connected => {
      dashboard.store.dispatch(dashboard.actions.clearSources());
    }, true);
  }

  onRobotIpChange(ev) {
    this.robotIp = ev.target.value;
    store.dispatch(dashboard.actions.clearSources());
    NetworkTables.connect(this.robotIp);
    dashboard.storage.set('robotIp', this.robotIp);
  };

  open() {
    this.robotIp = dashboard.storage.get('robotIp', 'localhost');
    const modal = this.shadowRoot.getElementById('modal');
    modal.open();
  }

  close() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.close();
  }

  render() {
    return html`
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