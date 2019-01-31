import _ from 'lodash';


<widget>
  <div class="dragger"></div>
  <div class="widget-type" ref="widgetType" tables="{opts.ntValue}"></div>


  <script>

    this.ntRoot = null;
    this.widgetType = null;

    this.setNtRoot = (root) => {
      this.ntRoot = root;
    };

    this.getNtValue = () => {

    };

    this.setWidgetType = (type) => {
      this.widgetType = type;
      riot.mount(this.refs.widgetType, type, {
        table: {}
      });
    };

    const mapStateToOpts = (state) => {

      let ntKeys = Object.keys(state.networktables.rawValues).filter(key => {
        return key.startsWith(this.ntRoot);
      });

      if (ntKeys.length === 1) {
        var ntValue = state.networktables.rawValues[ntKeys];
      }
      else {
        let value = _.pick(state.networktables.rawValues, ntKeys);
        var ntValue = _.mapKeys(value, (value, key) => {
          return key.substring(this.ntRoot.length);
        });
      }

      if (this.refs.widgetType) {
        this.refs.widgetType._tag.opts.table = ntValue;
        this.refs.widgetType._tag.update();
      }


      return {
        ntValue
      };
    };

    this.reduxConnect(mapStateToOpts, null);


  </script>
</widget>