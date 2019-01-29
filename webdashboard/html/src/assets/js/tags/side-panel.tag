import './sources.tag';

<side-panel>
  <div class="card ">
    <div class="card-header"> 
      <ul class="nav nav-tabs card-header-tabs pull-right" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="sources-tab" data-toggle="tab" href="#sources" role="tab" aria-controls="sources" aria-selected="true">
            Sources
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="widges-tab" data-toggle="tab" href="#widgets" role="tab" aria-controls="widgets" aria-selected="false">
            Widgets
          </a>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="sources" role="tabpanel" aria-labelledby="sources-tab">
          <sources />
        </div>
        <div class="tab-pane fade" id="widgets" role="tabpanel" aria-labelledby="widgets-tab">
          ...
        </div>
      </div>
    </div>
  </div>

  <style>
    .card-body {
      padding: 10px;
    }

    .card-header {
      overflow: hidden;
      border-bottom: none;
    }

    > .card {
      border-bottom: none;
    }

    .card {
      border-radius: 0;
    }

    .card:first-child {
      border-bottom: none;
    }
  </style>
</side-panel>