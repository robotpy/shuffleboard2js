import './elements/components';
import store from "./redux/store";
import riot from 'riot';
import NetworkTablesWrapper from './networktables';
import './elements/dashboard-app';
import * as actions from  './redux/actions';
import toastr from 'toastr';
import * as CurvedArrow from './curved-arrow';
import * as storage from './storage';
import * as Lit from 'lit-element';
import ObservableSlim from 'observable-slim';
require('./require-extensions');
require('./menu');


window.dashboard = {
  store,
  actions,
  events: riot.observable(),
  toastr,
  CurvedArrow,
  registerWidget: function(tagName, config) {
    store.dispatch(actions.registerWidget(tagName, config));
  },
  storage,
  lit: {
    ...Lit,
    LitElement: class ExtendedLitElement extends Lit.LitElement {

      constructor() {
        super();
        this._oldWidgetProps = {};

        const widgetConfig = dashboard.store.getState().widgets.registered[this.nodeName.toLowerCase()];
        if (widgetConfig) {
          this.table = {};
          this.widgetProps = ObservableSlim.create({...widgetConfig.properties.defaults}, false, () => {
            this.requestUpdate('widgetProps', this._oldWidgetProps);
            this._oldWidgetProps = { ...this.widgetProps };
          });
          dashboard.events.trigger('widgetAdded', this);
        }
      }

      resized() {}
    }
  }
};


const ntWrapper = new NetworkTablesWrapper(store);


