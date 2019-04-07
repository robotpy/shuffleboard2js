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
    
    this.onRobotIpChange = (ev) => {
      const robotIp = ev.target.value;
      setRobotIp(robotIp)
        .then(response => {
          if (!response) {
            return;
          }

          this.clearNetworkTables();
          NetworkTables.closeSocket();
        }); 
    };

    async function setRobotIp(robotIp) {
      try {
        let l = window.location;
        let port = process.env.socket_port || l.port;
        let url = "http://" + l.hostname + ":" + port + "/api/set_robot_ip?robot_ip=" + robotIp;
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

</networktables-settings-modal>