
import 'assets/scss/gridster.scss';
import 'dsmorse-gridster/dist/jquery.dsmorse-gridster.min.css';
import 'dsmorse-gridster/dist/jquery.dsmorse-gridster.min.js';
import uuidv1 from "uuid";
import './widget.tag';

<widgets>

  <div class="gridster" ondragend={onDragEnd}>
    <ul class="task-card-list" ref="grid">
        <virtual each={widget in widgets}>
          <li data-row="{widget.row}" 
              data-col="{widget.col}" 
              data-minx="{widget.minX}" 
              data-miny="{widget.minY}" 
              data-sizex="{Math.max(widget.sizeX, widget.minX)}" 
              data-sizey="{Math.max(widget.sizeY, widget.minY)}" 
              class="task-card">
            <div class="dragger"></div>
          </li>
        </virtual>

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

    this.widgets = [];

    this.getWidgets = (x, y) => {

      let widgets = [];

      let $widgets = $(this.refs.grid).find('li').each(function() {
        let viewportOffset = this.getBoundingClientRect();
        let top = viewportOffset.top;
        let left = viewportOffset.left;
        let width = $(this).width();
        let height = $(this).height();

        if (x > left && x < (left + width) && y > top && y < (top + height)) {
          let widget = $(this).find('widget')[0]._tag;
          widgets.push(widget);
        }
      });

      return widgets;
    };

    this.addWidget = (x, y, config) => {
      let gridster = $(this.refs.grid).data('gridster');
      let id = `widget-${uuidv1()}`; 
      let gridPos = this.cordsToGridPosition(x, y);
      let $widget = gridster.add_widget(`
        <li data-minx="${config.minX}" data-miny="${config.minY}">
          <widget></widget>
        </li>
      `, config.minX, config.minY, gridPos.x, gridPos.y);

      let widget = riot.mount($widget.find('widget')[0], 'widget', {})[0];
      widget.setWidgetType(config.type);

      this.cordsToGridPosition(x, y);
    };

    this.cordsToGridPosition = (x, y) => {
      let rect = this.root.getBoundingClientRect();
      let top = rect.top;
      let left = rect.left;
      let scrollTop = this.root.scrollTop;
      let scrollLeft = this.root.scrollLeft;

      let relativeX = x - left + scrollLeft;
      let relativeY = y - top + scrollTop;

      let gridX = Math.max(1, Math.floor(relativeX / 55) + 1);
      let gridY = Math.max(1, Math.floor(relativeY / 55) + 2);
      return {
        x: gridX,
        y: gridY
      };

    }


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