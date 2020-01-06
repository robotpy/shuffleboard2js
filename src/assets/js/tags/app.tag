import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './user-widgets.tag';
import '../elements/side-panel';
import '../elements/text-editor';
import axios from 'axios';
import * as _ from 'lodash';
import './widget-tabs.tag';
import '../elements/custom-widget-settings-modal';
import '../elements/load-recording-modal';
import '../elements/networktables-settings-modal';
const dialog = require('electron').remote.dialog;
import { writeFileSync } from 'fs';
import '@vaadin/vaadin-split-layout';

<app>
  <load-recording-modal ref="loadRecordingModal">
  </load-recording-modal>
  <networktables-settings-modal ref="networkTablesModal">
  </networktables-settings-modal>
  <custom-widget-settings-modal ref="customWidgetModal"> 
  </custom-widget-settings-modal>

  <vaadin-split-layout orientation="vertical" class="editor-main-separator">
    <vaadin-split-layout class="main">
      <side-panel></side-panel>
      <div class="widget-container">
        <widget-tabs ref="widgetTabs" />
      </div>
    </vaadin-split-layout>
    <text-editor></text-editor>
  </vaadin-split-layout>


  <user-widgets />

  <style>

    .editor-main-separator {
      height: 100vh;
      width: 100%;
    }

    .main {
      height: 75%;
      width: 100%;
    }

    .text-editor {
      height: 25%;
      width: 100%;
    }

    .main .widget-container {
      width: 75%;
      background: #eee;
      overflow: auto;
      position: relative;
    }

    side-panel {
      width: 25%;
      display: block;
      overflow: auto;
      height: 100%;
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

    dashboard.events.on('fileMenuLoadRecording', async () => {
      const recordings = await dashboard.recorder.getRecordings();
      this.refs.loadRecordingModal.recordings = recordings;
      this.refs.loadRecordingModal.open();

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

    this.mapDispatchToMethods = {
      loadReplay: dashboard.actions.loadReplay,
    };

    this.reduxConnect(null, this.mapDispatchToMethods);

  </script>
</app>
