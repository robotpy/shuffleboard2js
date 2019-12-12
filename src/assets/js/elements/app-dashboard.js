import { LitElement, html, css } from 'lit-element';
import './components/dashboard-modal';
import './load-recording-modal';
import './networktables-settings-modal';
import './custom-widget-settings-modal';
import './app-replay';
import './side-panel';

class AppDashboard extends LitElement {

  static get properties() { 
    return {
      recordings: { type: Object },
      robotIp: { type: String },
      widgetFolder: { type: String }
    }
  }

  constructor() {
    super();
    this.recordings = {};
    this.robotIp = '';
  }

  static get styles() {
    return css`
      replay {
        flex: 1;
      }

      .main {
        display: flex;
        height: 100%;
      }

      .main .widget-container {
        flex: 1;
        background: #eee;
        overflow: auto;
        position: relative;
      }

      side-panel {
        max-width: calc(100% - 10px);
        width: 370px;
        display: block;
        overflow: auto;
        height: 100%;
      }

      .layout-resizer {
        width: 5px;
        background: #aaa;
        cursor: ew-resize;
      }

      .menu {
        display: flex;
        padding: 10px 15px;
      }

      .menu > button {
        margin-right: 5px;
      }
    `;
  }

  firstUpdated() {
    dashboard.events.on('fileMenuNew', () => {
      const widgetTabs = this.shadowRoot.getElementById('widgetTabs');
      widgetTabs.newLayout();
    });

    dashboard.events.on('fileMenuSave', () => {
      const widgetTabs = this.shadowRoot.getElementById('widgetTabs');
      const widgetJson = widgetTabs.getWidgetTabsJson();
      saveLayout(widgetJson);
    });

    dashboard.events.on('fileMenuLoadLayout', () => {
      const widgetTabs = this.shadowRoot.getElementById('widgetTabs');
      widgetTabs.loadLayout();
    });

    dashboard.events.on('fileMenuLoadRecording', async () => {
      const loadRecordingModal = this.shadowRoot.getElementById('loadRecordingModal');
      this.recordings = dashboard.recorder.getRecordings();
      loadRecordingModal.open();
    });

    dashboard.events.on('fileMenuNtSettings', () => {
      const networkTablesModal = this.shadowRoot.getElementById('networkTablesModal');
      this.robotIp = dashboard.storage.getRobotIp();
      networkTablesModal.open();
    });

    dashboard.events.on('fileMenuWidgetSettings', () => {
      const customWidgetModal = this.shadowRoot.getElementById('customWidgetModal');
      this.widgetFolder = dashboard.storage.getDefaultWidgetFolder();
      console.log('widgetFolder', this.widgetFolder);
      customWidgetModal.open();
    });

    let dragging = false;

    $(this.shadowRoot.getElementById('layoutResizer')).on('mousedown', (ev) => {
      dragging = true;
    });

    $(window).on('mousemove', _.throttle((ev) => {
      if (!dragging) {
        return;
      }

      $(this.shadowRoot.getElementById('sidePanel'))
        .width(Math.clamp(ev.pageX, 10, window.innerWidth - 10));
    }, 50));

    $(window).on('mouseup', (ev) => { 
      dragging = false;
    });
  }

  async saveLayout(widgetJson) {
    const options = {
      title: 'Save Layout',
      defaultPath: dashboard.storage.getDefaultLayoutPath(),
      filters: [
        { name: 'JSON files', extensions: ['json'] }
      ]
    };

    try {
      const { canceled, filePath } = await dialog.showSaveDialog(options);
      if (!canceled) {
        writeFileSync(filePath, JSON.stringify(widgetJson), 'utf-8');
        dashboard.storage.setDefaultLayoutPath(filePath);
        dashboard.toastr.success(`Layout saved to ${filePath}`); 
      }
    }
    catch(e) {
      dashboard.toastr.error(`Failed to save layout: ${e.message}`);
    }
  }

  render() {
    return html`
      ${includeStyles()}
      <div class="menu">
        <dashboard-modal id="loadRecordingModal" title="Load Recording">
          <load-recording-modal .recordings="${this.recordings}">
          </load-recording-modal>
        </dashboard-modal>
        <dashboard-modal id="networkTablesModal" title="NetworkTables Settings">
          <networktables-settings-modal .robotIp="${this.robotIp}">
          </networktables-settings-modal>
        </dashboard-modal>
        <dashboard-modal id="customWidgetModal" title="Custom Widget Settings">
          <custom-widget-settings-modal .widgetFolder="${this.widgetFolder}">
          </custom-widget-settings-modal>
        </dashboard-modal>
        <app-replay></app-replay>
      </div>

      <div class="main">
        <side-panel id="sidePanel"></side-panel>
        <div class="layout-resizer" ref="layoutResizer">
        </div>
        <div class="widget-container">
          <widget-tabs id="widgetTabs" />
        </div>
      </div>

      <user-widgets />
    `;
  }

}


customElements.define('app-dashboard', AppDashboard);