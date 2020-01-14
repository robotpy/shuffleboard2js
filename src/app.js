import './elements/components';
import Widget from './elements/widget';
import store from "./redux/store";
import riot from 'riot';
import NetworkTablesWrapper from './networktables';
import './elements/dashboard-app';
import * as actions from  './redux/actions';
import toastr from 'toastr';
import * as CurvedArrow from './curved-arrow';
import * as storage from './storage';
import * as Lit from 'lit-element';
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
    LitElement: Widget
  }
};

new NetworkTablesWrapper(store);
