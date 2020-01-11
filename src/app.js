import './assets/js/elements/components';
import { includeStyles } from './assets/js/render-utils';
import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import NetworkTablesWrapper from './assets/js/networktables';
import "assets/js/tags/app.tag";
import * as actions from  './assets/js/actions';
import 'assets/scss/app.scss';
import toastr from 'toastr';
import * as CurvedArrow from 'assets/js/curved-arrow';
import * as storage from 'assets/js/storage';
import * as Lit from 'lit-element';
import ObservableSlim from 'observable-slim';
require('assets/js/require-extensions');
require('assets/js/menu');


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
          console.log("WIDGET ADDED");
        }
      }

      resized() {}
    },
    includeStyles
  }
};

riotReduxConnect(riot, store);

const ntWrapper = new NetworkTablesWrapper(store);

riot.mount('app');


