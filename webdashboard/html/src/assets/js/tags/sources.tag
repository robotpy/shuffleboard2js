import './networktables/networktables.tag';

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
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
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