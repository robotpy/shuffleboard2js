import { includeStyles } from './assets/js/render-utils';
import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import NetworkTablesWrapper from './assets/js/networktables';
import "assets/js/tags/app.tag";
import * as actions from  'assets/js/actions';
import 'assets/scss/app.scss';
import toastr from 'toastr';
import * as CurvedArrow from 'assets/js/curved-arrow';
import * as storage from 'assets/js/storage';
import * as Lit from 'lit-element';
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
    includeStyles
  }
};

riotReduxConnect(riot, store);

const ntWrapper = new NetworkTablesWrapper(store);

riot.mount('app');


