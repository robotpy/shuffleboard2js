

import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import './user-modules.tag';
import './side-panel.tag';
import './widgets.tag';
import axios from 'axios';
import * as _ from 'lodash';

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
    <div class="layout-resizer"
         draggable="true" 
         ondragstart={onDragResizerStart} 
         ondrag={onDragResizer}
         ondragend={onDragResizerEnd}>
    </div>
    <div class="widget-container">
      <widgets ref="widgets" />
    </div>
  </div>


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
      let widgetJson = this.refs.widgets.getWidgetJson();
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
          widgets: widgetJson
        });
        return response;
      }
      catch(e) {
        console.error('error', e);
        return [];
      }
    }

    this.onDragResizerStart = (ev) => {
      var crt = ev.target.cloneNode(true);
      crt.style.display = "none";
      document.body.appendChild(crt);
      ev.dataTransfer.setDragImage(crt, 0, 0);
    }

    this.onDragResizer = _.throttle(ev => {

      // When user releases, clientX, screenX, x, etc. are always 0, which
      // causes the dragger to jump. If both screenX and screenY are 0, 
      // likely the user just released. https://stackoverflow.com/a/47241403
      if (!ev.screenX && !ev.screenY) {
        return;
      }

      $(this.refs.sidePanel.root).width(Math.clamp(ev.pageX, 10, window.innerWidth - 10));
    }, 50);

    this.onDragResizerEnd = (ev) => {

    };

  </script>
</app>
