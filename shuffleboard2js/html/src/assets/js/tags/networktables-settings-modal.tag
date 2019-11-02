import axios from 'axios';

<networktables-settings-modal>
  <div class="modal-body">
    <form>
      <div class="form-group row">
        <label for="sever" class="col-sm-2 col-form-label">Server</label>
        <div class="col-sm-10">
          <input 
            type="text" 
            class="form-control" 
            id="server" 
            value={opts.robotIp}
            onchange={onRobotIpChange}>
        </div>
      </div>
    </form>
  </div>

  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  </div>

  <style>

    


  </style>

  <script>

    NetworkTables.connect(dashboard.storage.getRobotIp());
    
    this.onRobotIpChange = (ev) => {
      const robotIp = ev.target.value;
      this.clearNetworkTables();
      NetworkTables.connect(robotIp);
      dashboard.storage.setRobotIp(robotIp);
    };

    this.mapDispatchToMethods = {
      clearNetworkTables: dashboard.actions.clearNetworkTables,
    };

    this.reduxConnect(null, this.mapDispatchToMethods);

  </script>

</networktables-settings-modal>