const { LitElement, html } = dashboard.lit;
const NetworkTables = require('./networktables');

class NetworkTablesSettings extends LitElement {

  static get properties() { 
    return {
      robotIp: { type: String }
    };
  }

  constructor() {
    super();
    this.robotIp = dashboard.storage.get('robotIp', 'localhost');
    
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
    dashboard.store.dispatch(dashboard.actions.clearSources());
    NetworkTables.connect(this.robotIp);
    dashboard.storage.set('robotIp', this.robotIp);
  };

  onOpen() {
    this.robotIp = dashboard.storage.get('robotIp', 'localhost');
  }

  render() {
    return html`
      <vaadin-text-field 
        label="Server"
        .value="${this.robotIp}"
        @change="${this.onRobotIpChange}"
      ></vaadin-text-field>
    `;
  }
}

customElements.define('networktables-settings', NetworkTablesSettings);