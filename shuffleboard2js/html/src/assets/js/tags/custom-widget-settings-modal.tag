import axios from 'axios';

<custom-widget-settings-modal>
  <div class="modal-body">
    <form>
      <div class="form-group row">
        <label for="widget-folder" class="col-sm-3 col-form-label">Widget Folder</label>
        <div class="col-sm-9">
          <input 
            type="text" 
            class="form-control" 
            id="widget-folder" 
            value={opts.widgetFolder}
            disabled>
        </div>
      </div>
    </form>
    <div class="alert alert-warning" role="alert">
      Changing the custom widget folder will refresh the page. Please save any changes you
      want to keep before you do this!
    </div>
  </div>

  <div class="modal-footer">
    <button type="button" class="btn btn-primary" onclick={onChangeWidgetFolder}>Change</button>
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
  </div>

  <style>
    form .form-group label {
      padding-right: 0;
    }
  </style>

  <script>
    
    this.onChangeWidgetFolder = (ev) => {

      changeWidgetFolder()
        .then(response => {
          if (!response) {
            return;
          }

          window.location.reload();
        }); 
    };

    async function changeWidgetFolder() {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/select_widget_folder";
        const response = await axios.get(url);
        return response;
      }
      catch(e) {
        console.error('error', e);
        return null;
      }
    }

    this.mapDispatchToMethods = {
      clearNetworkTables: dashboard.actions.clearNetworkTables,
    };

    this.reduxConnect(null, this.mapDispatchToMethods);

  </script>

</custom-widget-settings-modal>