

import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './user-modules.tag';
import './side-panel.tag';
import axios from 'axios';
import * as _ from 'lodash';
import './widget-tabs.tag';

<app>
  <div class="menu">
    <button type="button" class="btn btn-sm btn-secondary" aria-label="Save Layout" onclick={onSave}>
      Save
    </button>
    <button type="button" class="btn btn-sm btn-secondary" aria-label="Save Layout" onclick={onConfigNetworkTables}>
      NetworkTables
    </button>
  </div>

  <div class="main">
    <side-panel ref="sidePanel" />
    <div class="layout-resizer" ref="layoutResizer">
    </div>
    <div class="widget-container">
      <widget-tabs ref="widgetTabs" />
    </div>
  </div>

  <div class="drag-image-container"></div>


  <style>
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
      padding: 10px 15px;
    }

  </style>

  

  <user-modules />

  <script>
    this.onSave = (ev) => {
      let widgetJson = this.refs.widgetTabs.getWidgetTabsJson();
      console.log('widgetJson', widgetJson);
      saveLayout(widgetJson);
    };

    this.onConfigNetworkTables = (ev) => {

    };

    async function saveLayout(widgetJson) {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/layout/save";
        const response = await axios.post(url, {
          tabs: widgetJson
        });
        return response;
      }
      catch(e) {
        console.error('error', e);
        return [];
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

  </script>
</app>
