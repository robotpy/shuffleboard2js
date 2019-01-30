
import 'assets/scss/gridster.scss';
import 'dsmorse-gridster/dist/jquery.dsmorse-gridster.min.css';
import 'dsmorse-gridster/dist/jquery.dsmorse-gridster.min.js';

<widgets>

  <div class="gridster">
    <ul class="task-card-list" ref="grid">
        <li data-row="1" data-col="1" data-minx="3" data-miny="2" data-sizex="3" data-sizey="2" class="task-card">
          <div class="dragger"></div>
          0
        </li>
        <li data-row="1" data-col="2" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          1
        </li>
        <li data-row="1" data-col="3" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          2
        </li>
        <li data-row="1" data-col="4" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          3
        </li>
        <li data-row="2" data-col="1" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          4
        </li>
        <li data-row="2" data-col="3" data-sizex="1" data-sizey="2" class="task-card">
          <div class="dragger"></div>
          5
        </li>
        <li data-row="2" data-col="4" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          6
        </li>
        <li data-row="3" data-col="1" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          7
        </li>
        <li data-row="3" data-col="2" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          8
        </li>
        <li data-row="3" data-col="4" data-sizex="1" data-sizey="1" class="task-card">
          <div class="dragger"></div>
          9
        </li>
		</ul>
  </div>


  <style>
    widgets {
      position: relative;
      width: 100vw;
      height: 100%;
      display: block;
    }

    .dragger {
      height: 10px;
      width: 100%;
      cursor: grab;
    }

    .task-card {
      padding: 10px;
      padding-top: 0;
    }



  </style>

  <script>
    this.on('mount', () => {
      $(this.root).width(screen.width - 20);

      var gridster;

      gridster = $(this.refs.grid).gridster({
        widget_base_dimensions: [50, 50],
        widget_margins: [5, 5],
        shift_widgets_up: false,
        shift_larger_widgets_down: false,
        collision: {
            wait_for_mouseup: true
        },
        resize: {
          enabled: true,
          start: function (event, uiWidget, $widget) {
            let minX = $widget.data('minx') || 1;
            let minY = $widget.data('miny') || 1;
            let minWidth = minX * 50 + (minX - 1) * 5;
            let minHeight = minY * 50 + (minY - 1) * 5;
            $widget.css('min-width', minWidth);
            $widget.css('min-height', minHeight);
          },
          stop: function(e, ui, $widget) {
            let sizeX = parseInt($widget.attr('data-sizex'));
            let sizeY = parseInt($widget.attr('data-sizey'));
            let minX = parseInt($widget.attr('data-minx')) || 1;
            let minY = parseInt($widget.attr('data-miny')) || 1;

            if (sizeX < minX || sizeY < minY) {
              let newX = Math.max(minX, sizeX);
              let newY = Math.max(minY, sizeY);

              setTimeout(() => {
                gridster.resize_widget($widget, newX, newY);
              });
            }
          }
        },
        draggable: {
          handle: '.dragger'
        }
      }).data('gridster');
    });

  </script>


</widgets>