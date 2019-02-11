import './networktables/networktables.tag';
import './camera-sources.tag';

<sources>
  <div id="accordion">
    <div class="card">
      <div class="card-header" id="cameraServerHeader">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#cameraServerBody" aria-expanded="false" aria-controls="cameraServerBody">
            <span class="oi oi-caret-right"></span>
            <span class="oi oi-caret-bottom"></span>
            CameraServer
          </button>
        </h5>
      </div>

      <div id="cameraServerBody" class="collapse" aria-labelledby="cameraServerHeader" data-parent="#accordion">
        <div class="card-body">
          <camera-sources />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header" id="networkTablesHeader">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#networkTablesBody" aria-expanded="false" aria-controls="networkTablesBody">
            <span class="oi oi-caret-right"></span>
            <span class="oi oi-caret-bottom"></span>
            NetworkTables
          </button>
        </h5>
      </div>
      <div id="networkTablesBody" class="collapse" aria-labelledby="networkTablesHeader" data-parent="#accordion">
        <div class="card-body">
          <networktables />
        </div>
      </div>
    </div>
  </div>
  

  <style>
    .card-header {
      padding: 3px 5px;
    }

    .oi-caret-right {
      display: none;
    }

    .collapsed .oi-caret-right {
      display: inline-block;
    }

    .collapsed .oi-caret-bottom {
      display: none;
    }

    .oi {
      font-size: 12px;
      margin-right: 5px;
    }

    .btn-link:hover, .btn-link:focus {
      text-decoration: none;
    }

  </style>
</sources>