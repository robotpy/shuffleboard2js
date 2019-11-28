import { LitElement, html, css } from 'lit-element';
import './components/dashboard-modal';

class AppDashboard extends LitElement {

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

    dashboard.events.on('fileMenuLoadRecording', () => {
      dashboard.recorder.getRecordings()
        .then(recordings => {
          const loadRecordingModal = this.shadowRoot.getElementById('loadRecordingModal');
          loadRecordingModal.recordings = recordings;
          loadRecordingModal.open();
        });
    });

    dashboard.events.on('fileMenuNtSettings', () => {
      const robotIp = dashboard.storage.getRobotIp();
      const networkTablesModal = this.shadowRoot.getElementById('networkTablesModal');
      //networkTablesModal.opts.robotIp = robotIp;
      networkTablesModal.open();
    });

    dashboard.events.on('fileMenuWidgetSettings', () => {
      const widgetFolder = dashboard.storage.getDefaultWidgetFolder();
      const customWidgetModal = this.shadowRoot.getElementById('customWidgetModal');
      customWidgetModal.widgetFolder = widgetFolder;
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
          <load-recording-modal recordings={opts.recordings} modal={root._tag} />
        </dashboard-modal>
        <dashboard-modal id="networkTablesModal" title="NetworkTables Settings">
          <networktables-settings-modal robot-ip={opts.robotIp} modal={root._tag} />
        </dashboard-modal>
        <dashboard-modal id="customWidgetModal" title="Custom Widget Settings">
          <custom-widget-settings-modal widget-folder={opts.widgetFolder} modal={root._tag} />
        </dashboard-modal>
        <replay />
      </div>

      <div class="main">
        <side-panel id="sidePanel" />
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