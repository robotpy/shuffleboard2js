import _ from 'lodash';
import { getSubtable, getType } from 'assets/js/networktables';


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

      if (!this.ntRoot) {
        return {};
      }

      let ntValue = getSubtable(this.ntRoot);

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