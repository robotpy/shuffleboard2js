
import 'assets/scss/gridster.scss';
import 'dsmorse-gridster/dist/jquery.dsmorse-gridster.min.css';
import 'dsmorse-gridster/dist/jquery.dsmorse-gridster.min.js';
import uuidv1 from "uuid";
import './widget.tag';
import '../elements/dashboard-widget';
import './components';
import _ from 'lodash';
import { getTypes } from 'assets/js/networktables';

<widgets>

  <div class="gridster" ondragend={onDragEnd} oncontextmenu={onContextMenu}>
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

    <context-menu should-show={shouldShowContextMenu} 
                  onclick={onContextMenuClick} 
                  onchange={onContextMenuChange} 
                  container={root} 
                  menu={menu} 
                  show-as={contextMenuShowAs}
                  has-properties={contextMenuWidgetHasProperties}>
      <virtual if={opts.menu === 'allWidgets'}>
        <a class="dropdown-item" href="#" data-action="clear">Clear</a>
      </virtual>

      <virtual if={opts.menu === 'widget'}>
        <a class="dropdown-item" href="#" data-action="remove">Remove</a>
        <form class="px-4 py-3" if={opts.showAs.options.length > 0}>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Show as:</label>
            <select class="form-control" id="exampleFormControlSelect1">
              <option value={option.type} selected={option.current} each={option in opts.showAs.options}> 
                {option.label}
              </option>
            </select>
          </div>
        </form>
        <virtual if={opts.hasProperties}>
          <a class="dropdown-item" href="#" data-action="properties">Properties</a>
        </virtual>
      </virtual>
    </context-menu>
  </div>


  <style>
    widgets {
      position: relative;
      width: 100vw;
      height: calc(100% - 60px);
      display: block;
      background: #EFEFEF;
    }

    .dragger {
      width: 100%;
      cursor: grab;
      padding: 7px 10px;
      background: cornflowerblue;
    }

    .task-card {
      padding: 10px;
      padding-top: 0;
    }

    .task-card-list > li.focus {
      z-index: 100;
    }

    context-menu .dropdown-menu .dropdown-item {
      padding: .25rem 15px;
    }

    context-menu .dropdown-menu h6 {
      padding: .25rem 15px;
    }

    context-menu .dropdown-menu form {
      padding: .25rem 15px !important;
      margin-bottom: 0;
    }

    context-menu .dropdown-menu form label {
     color: gray;
    }



  </style>

  <script>

    this.widgets = [];
    this.menu = 'allWidgets';
    this.contextMenuWidget = null;
    this.contextMenuShowAs = {
      options: [],
      defaultOption: null
    };
    this.contextMenuWidgetHasProperties = false;

    this.getShowAsOptions = (ntTypes) => {
      let currentType = this.contextMenuWidget.widgetType;
      let registeredWidgets = dashboard.store.getState().widgets.registered;
      let allOptions = _.map(registeredWidgets, (widget, type) => {
        return {
          type,
          current: type === currentType,
          label: widget.label,
          acceptedTypes: widget.acceptedTypes
        };
      });

      return allOptions.filter(option => {
        for (let i = 0; i < ntTypes.length; i++) {
          if (option.acceptedTypes.indexOf(ntTypes[i]) > -1) {
            return true;
          }
        }
        return false;
      });
    };

    this.onContextMenu = (ev) => {
      let widgets = this.getWidgets(ev.clientX, ev.clientY);
      
      if (widgets.length === 0) {
        this.menu = 'allWidgets';
      }
      else {
        this.menu = 'widget';
        this.contextMenuWidget = widgets[0];
        let ntTypes = getTypes(this.contextMenuWidget.ntRoot);
        this.contextMenuShowAs.options = this.getShowAsOptions(ntTypes);
        this.contextMenuWidgetHasProperties = this.contextMenuWidget.hasProperties();
      }
    };

    this.shouldShowContextMenu = (ev) => {

      if (this.getWidgets(ev.clientX, ev.clientY).length === 0) {
        return true;
      }

      return $(ev.target).hasClass('dragger') || $(ev.target).parents('.dragger').length > 0;
    }

    this.onContextMenuClick = (ev) => {
      ev.preventDefault();

      const gridster = $(this.refs.grid).data('gridster');
      const $el = $(ev.target);
      const action = $el.attr('data-action');

      if (action === 'clear') {
        gridster.remove_all_widgets();
      }
      else if (action === 'remove') {
        gridster.remove_widget(this.contextMenuWidget.$widget, true);
      } 
      else if (action === 'properties') {
        this.contextMenuWidget.openPropertiesModal();
      }
    }

    this.onContextMenuChange = (ev) => {
      let widgetType = ev.target.value;
      this.contextMenuWidget.setWidgetType(widgetType);
    };

    this.getWidgetJson = () => {
      let widgets = [];

      $(this.refs.grid).find('> li').each(function() {

        const widget = $(this).find('dashboard-widget')[0];
        
        widgets.push({
          col: parseInt($(this).attr('data-col')),
          row: parseInt($(this).attr('data-row')),
          sizeX: parseInt($(this).attr('data-sizex')),
          sizeY: parseInt($(this).attr('data-sizey')),
          ntRoot: widget.ntRoot,
          widgetType: widget.widgetType,
          widgetTitle: widget.widgetTitle,
          properties: widget.properties
        });
      });

      return widgets;
    };

    this.getWidgets = (x, y) => {

      let widgets = [];

      let $widgets = $(this.refs.grid).find('li').each(function() {
        let viewportOffset = this.getBoundingClientRect();
        let top = viewportOffset.top;
        let left = viewportOffset.left;
        let width = $(this).width();
        let height = $(this).height();

        if (x > left && x < (left + width) && y > top && y < (top + height)) {
          let widget = $(this).find('dashboard-widget')[0];
          widget.$widget = $(this);
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
          <dashboard-widget></dashboard-widget>
        </li>
      `, config.minX, config.minY, gridPos.x, gridPos.y);

      let widget = $widget.find('dashboard-widget')[0];
      widget.setWidgetType(config.type);
      return widget;
    };

    this.addSavedWidget = (config) => {
      let gridster = $(this.refs.grid).data('gridster');
      let id = `widget-${uuidv1()}`; 
      let { minX, minY } = dashboard.store.getState().widgets.registered[config.widgetType];
      let $widget = gridster.add_widget(`
        <li data-minx="${minX}" data-miny="${minY}">
          <dashboard-widget></dashboard-widget>
        </li>
      `, config.sizeX, config.sizeY, config.col, config.row);

      let widget = $widget.find('dashboard-widget')[0];
      widget.setWidgetType(config.widgetType);
      widget.setTitle(config.widgetTitle);
      widget.setProperties(config.properties);

      if (config.ntRoot) {
        widget.setNtRoot(config.ntRoot, true);
      }
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


      $(this.root).on('click, focus, contextmenu', '.task-card-list > li', (ev) => {
        $(this.root).find('.task-card-list > li').removeClass('focus');
        $(ev.currentTarget).addClass('focus');
      });

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
          resize: function(e, ui, $widget) {
            let widget = $widget.find('dashboard-widget')[0];
            widget.onResize();

            // Widget resizes again to fit grid after a short animation, so wait before
            // calling again.
            setTimeout(() => {
              widget.onResize();
            }, 1000);
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

      $(() => {
        this.opts.savedWidgets.forEach(widgetConfig => {

          // Wait until widget is registered before adding it
          const promise = new Promise(function(resolve, reject) {
            if (widgetConfig.widgetType in dashboard.store.getState().widgets.registered) {
              resolve();
            }

            dashboard.events.on('registerWidget', () => {
              if (widgetConfig.widgetType in dashboard.store.getState().widgets.registered) {
                resolve();
              }
            });
          });

          promise.then(() => {
            this.addSavedWidget(widgetConfig);
          });
        });
      });
    });

  </script>


</widgets>