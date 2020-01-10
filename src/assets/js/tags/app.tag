import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './user-widgets.tag';
import '../elements/side-panel';
import '../elements/text-editor';
import './widget-tabs.tag';
import '../elements/custom-widget-settings-modal';
import '../elements/networktables-settings-modal';
import '../elements/robot-dashboards';
const dialog = require('electron').remote.dialog;
import { writeFileSync } from 'fs';
import '@vaadin/vaadin-split-layout';

<app>
  <networktables-settings-modal ref="networkTablesModal">
  </networktables-settings-modal>
  <custom-widget-settings-modal ref="customWidgetModal"> 
  </custom-widget-settings-modal>

  <vaadin-split-layout class="main">
    <side-panel></side-panel>
    <!--  <widget-tabs ref="widgetTabs" />  -->
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

    dashboard.events.on('fileMenuWidgetSettings', () => {
      const widgetFolder = dashboard.storage.getDefaultWidgetFolder();
      this.refs.customWidgetModal.widgetFolder = widgetFolder;
      this.refs.customWidgetModal.open();
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
