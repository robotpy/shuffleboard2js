

import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './user-widgets.tag';
import './side-panel.tag';
import './replay.tag';
import axios from 'axios';
import * as _ from 'lodash';
import './widget-tabs.tag';
import './load-recording-modal.tag';
import './networktables-settings-modal.tag';
import './custom-widget-settings-modal.tag';
const dialog = require('electron').remote.dialog;
import { writeFileSync } from 'fs';

<app>
  <div class="menu">
    <modal ref="loadRecordingModal" title="Load Recording">
      <load-recording-modal recordings={opts.recordings} modal={root._tag} />
    </modal>
    <modal ref="networkTablesModal" title="NetworkTables Settings">
      <networktables-settings-modal robot-ip={opts.robotIp} modal={root._tag} />
    </modal>
    <modal ref="customWidgetModal" title="Custom Widget Settings">
      <custom-widget-settings-modal widget-folder={opts.widgetFolder} modal={root._tag} />
    </modal>
    <replay />
  </div>

  <div class="main">
    <side-panel ref="sidePanel" />
    <div class="layout-resizer" ref="layoutResizer">
    </div>
    <div class="widget-container">
      <widget-tabs ref="widgetTabs" />
    </div>
  </div>

  <user-widgets />

  <style>

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

  </style>

  

  <user-modules />

  <script>

    dashboard.events.on('fileMenuNew', () => {
      this.refs.widgetTabs.newLayout();
    });


    dashboard.events.on('fileMenuSave', () => {
      let widgetJson = this.refs.widgetTabs.getWidgetTabsJson();
      saveLayout(widgetJson);
    });

    dashboard.events.on('fileMenuLoadLayout', _.throttle((ev) => {
      // Disable button so so we don't make another request if user click button while
      // load dialog is up
      $(this.refs.loadLayoutBtn).attr('disabled', true);
      return this.refs.widgetTabs.loadLayout()
        .then(() => {
          // We've loaded, so enable button again
          $(this.refs.loadLayoutBtn).attr('disabled', false);
        });
    }, 500));

    dashboard.events.on('fileMenuLoadRecording', () => {
      dashboard.recorder.getRecordings()
        .then(recordings => {
          this.refs.loadRecordingModal.opts.recordings = recordings;
          this.refs.loadRecordingModal.update();
          this.refs.loadRecordingModal.open();
        });
    });

    dashboard.events.on('fileMenuNtSettings', () => {
      const robotIp = dashboard.storage.getRobotIp();
      this.refs.networkTablesModal.opts.robotIp = robotIp;
      this.refs.networkTablesModal.update();
      this.refs.networkTablesModal.open();
    });

    dashboard.events.on('fileMenuWidgetSettings', () => {
      const widgetFolder = dashboard.storage.getDefaultWidgetFolder();
      this.refs.customWidgetModal.opts.widgetFolder = widgetFolder;
      this.refs.customWidgetModal.update();
      this.refs.customWidgetModal.open();
    });

    async function saveLayout(widgetJson) {
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

    this.on('mount', () => {

      let dragging = false;

      $(this.refs.layoutResizer).on('mousedown', (ev) => {
        dragging = true;
      });

      $(window).on('mousemove', _.throttle((ev) => {
        if (!dragging) {
          return;
        }

        $(this.refs.sidePanel.root).width(Math.clamp(ev.pageX, 10, window.innerWidth - 10));
      }, 50));

      $(window).on('mouseup', (ev) => { 
        dragging = false;
      });

    });

    this.mapDispatchToMethods = {
      loadReplay: dashboard.actions.loadReplay,
    };

    this.reduxConnect(null, this.mapDispatchToMethods);

  </script>
</app>
