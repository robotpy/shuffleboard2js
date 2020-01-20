import './elements/components';
import Widget from './elements/widget';
import Dashboard from './elements/dashboard';
import ProviderSettings from './elements/provider-settings';
import store from "./redux/store";
import riot from 'riot';
import './elements/dashboard-app';
import * as actions from  './redux/actions';
import toastr from 'toastr';
import * as CurvedArrow from './curved-arrow';
import * as storage from './storage';
import * as Lit from 'lit-element';
import * as mouse from './mouse';
import * as sourceProviders from './source-providers';
import * as sourceManagers from './source-managers';

require('./require-extensions');
require('./menu');

window.dashboard = {
  store,
  actions,
  events: riot.observable(),
  toastr,
  CurvedArrow,
  registerWidget: function(tagName, config) {
    const { widgets } = store.getState();
    const widgetExists = tagName in widgets.registered;
    if (config.class && !widgetExists) {
      store.dispatch(actions.registerWidget(tagName, config));
    }
  },
  storage,
  lit: {
    ...Lit,
    Widget,
    Dashboard,
    ProviderSettings
  },
  mouse,
  sourceProviders,
  sourceManagers
};
