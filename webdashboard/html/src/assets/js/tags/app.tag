

import 'bootstrap/dist/css/bootstrap.min.css';
import 'open-iconic/font/css/open-iconic-bootstrap.css';
import "./module-menu.tag";
import './user-modules.tag';
import './side-panel.tag';
import axios from 'axios';

<app>
  <button type="button" class="btn btn-sm btn-secondary" aria-label="Save Layout" onclick={onSave}>
    Save
  </button>
  <button type="button" class="btn btn-sm btn-secondary" aria-label="Save Layout" onclick={onConfigNetworkTables}>
    NetworkTables
  </button>

  <div class="main">
    <side-panel />

  </div>

  

  <user-modules />

  <script>
    this.onSave = (ev) => {
      saveLayout();
    };

    this.onConfigNetworkTables = (ev) => {

    };

    async function saveLayout() {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/save_layout";
        const response = await axios.post(url, {
          layout: localStorage.getItem('layout')
        });
        return response.data.modules;
      }
      catch(e) {
        console.error('error', e);
        return [];
      }
    }
  </script>
</app>
