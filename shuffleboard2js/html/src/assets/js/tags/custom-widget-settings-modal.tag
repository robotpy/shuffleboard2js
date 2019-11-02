import axios from 'axios';
const dialog = require('electron').remote.dialog;

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
    
    this.onChangeWidgetFolder = async (ev) => {

      const options = {
        title: 'Select Widget Folder',
        defaultPath: dashboard.storage.getDefaultWidgetFolder(),
        properties: ['openDirectory']
      };

      try {
        const { canceled, filePaths } = await dialog.showOpenDialog(options);
        if (!canceled) {
          dashboard.storage.setDefaultWidgetFolder(filePaths[0]);
          dashboard.toastr.success(`Widget folder changed to ${filePaths[0]}`); 
          window.location.reload();
        }
      }
      catch(e) {
        dashboard.toastr.error(`Failed to change widget folder: ${e.message}`);
      }
    };

    this.mapDispatchToMethods = {
      clearNetworkTables: dashboard.actions.clearNetworkTables,
    };

    this.reduxConnect(null, this.mapDispatchToMethods);

  </script>

</custom-widget-settings-modal>