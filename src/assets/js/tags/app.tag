import '../elements/side-panel';
import '../elements/networktables-settings-modal';
import '../elements/robot-dashboards';
import { writeFileSync } from 'fs';

<app>
  <networktables-settings-modal ref="networkTablesModal">
  </networktables-settings-modal>

  <vaadin-split-layout class="main">
    <side-panel ref="sidePanel"></side-panel>
    <robot-dashboards ref="dashboards"></robot-dashboards>
  </vaadin-split-layout>


  <user-widgets />

  <style>

    .editor-main-separator {
      height: 100vh;
      width: 100%;
    }

    .main {
      height: 100%;
      width: 100%;
    }

    text-editor {
      height: 0%;
      width: 100%;
    }

    .main widget-tabs {
      width: 75%;
      background: #eee;
      overflow: auto;
      position: relative;
    }

    side-panel {
      width: 25%;
      display: block;
      overflow: auto;
      height: 100vh;
    }

  </style>

  <user-modules />

  <script>

    this.on('mount', () => {
      this.refs.sidePanel.addEventListener('ntSourceAdded', (ev) => {
        const { ntKey, ntType } = ev.detail;
        const dashboardsNode = this.refs.dashboards;
        const success = dashboardsNode.setNtRoot(ntKey);

        if (success) {
          dashboard.toastr.success(`Successfully added source '${ntKey}'`);
        }
        else if (dashboardsNode.selectedWidget) {
          const widgetType = dashboardsNode.getSelectedWidgetType();
          console.log('widgetType:', widgetType);
          const widgetConfig = dashboard.store.getState().widgets.registered[widgetType];
          dashboard.toastr.error(`
            Widget of type '${widgetConfig.label}' doesn't accept type 
            '${ntType}'. Accepted types are '${widgetConfig.acceptedTypes.join(', ')}'`);
        }
        else {
          dashboard.toastr.error(`Failed to add source '${ntKey}'. No widget at that position can be found.`);
        }
      });
    });
 
    dashboard.events.on('fileMenuSave', () => {
      let dashboardConfig = this.refs.dashboards.dashboardConfig;
      saveLayout(dashboardConfig);
    });

    dashboard.events.on('fileMenuLoad', () => {
      this.refs.dashboards.openSavedDashboard();
    });

    dashboard.events.on('fileMenuNtSettings', () => {
      const robotIp = dashboard.storage.getRobotIp();
      this.refs.networkTablesModal.robotIp = robotIp;
      this.refs.networkTablesModal.open();
    });

    async function saveLayout(widgetJson) {

      const configPath = dashboard.storage.getDashboardConfigPath();

      try {
        writeFileSync(configPath, JSON.stringify(widgetJson), 'utf-8');
        dashboard.toastr.success(`Layout saved to ${configPath}`); 
      }
      catch(e) {
        dashboard.toastr.error(`Failed to save layout: ${e.message}`);
      }
    }
    
  </script>
</app>
