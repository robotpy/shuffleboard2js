import _ from 'lodash';
import { getSubtable, getType } from 'assets/js/networktables';


<widget>
  <div class="dragger">
    <input type="text" name="widget-title" class="widget-title" onchange={onTitleChange} value="{this.opts.title}" />
  </div>
  <div class="widget-type" ref="widgetType" tables="{opts.ntValue}"></div>

  <style>
    .widget-type {
      overflow: auto;
      width: 100%;
      height: calc(100% - 38px);
    }

    .widget-title {
      text-align: center;
      width: 100%;
      border: none;
      text-overflow: ellipsis;
      background: cornflowerblue;
      font-weight: bold;
    }

    .widget-title:focus {
      outline: none;
    }

  </style>

  <script>

    this.ntRoot = null;
    this.widgetType = null;
    this.widgetTitle = null;

    this.onTitleChange = (ev) => {
      this.widgetTitle = ev.target.value;
      this.opts.title = this.widgetTitle || this.ntRoot;
      this.update();
    };

    this.setTitle = (title) => {
      this.widgetTitle = title || '';
      this.opts.title = this.widgetTitle || this.ntRoot;
      this.update();
    }

    this.onResize = () => {
      this.refs.widgetType._tag.trigger('resize');
      this.refs.widgetType._tag.update();
    }

    this.isAcceptedType = (ntType, widgetType = this.widgetType) => {
      let widgetConfig = dashboard.store.getState().widgets.registered[widgetType];

      if (!widgetConfig) {
        return false;
      }

      return widgetConfig.acceptedTypes.indexOf(ntType) > -1;
    }

    this.setNtRoot = (root) => {
      let ntType = getType(root);
      
      if (this.isAcceptedType(ntType)) {
        this.ntRoot = root;
        this.manuallyUpdate();
      }
    };

    this.setWidgetType = (type) => {

      let ntType = getType(this.ntRoot);

      if (!ntType || this.isAcceptedType(ntType, type)) {
        this.widgetType = type;
        riot.mount(this.refs.widgetType, type, {
          table: {}
        });

        this.manuallyUpdate();
      }
    };

    this.manuallyUpdate = () => {
      this.opts = {
        ...this.opts,
        ...this.mapStateToOpts(dashboard.store.getState())
      };

      this.update();
      this.refs.widgetType._tag.update();
    }

    this.mapStateToOpts = (state) => {

      if (!this.ntRoot) {
        return {};
      }

      let ntValue = getSubtable(this.ntRoot);
      
      if (this.refs.widgetType) {
        this.refs.widgetType._tag.opts.table = ntValue;
        this.refs.widgetType._tag.opts.ntRoot = this.ntRoot;
        this.refs.widgetType._tag.update();
      }

      return {
        ntValue,
        title: this.widgetTitle || this.ntRoot
      };
    };

    this.reduxConnect(this.mapStateToOpts, null);


  </script>
</widget>