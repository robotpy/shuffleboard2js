import store from "assets/js/store/index";
import riot from 'riot';
import riotReduxConnect from 'riot-redux-connect';
import NetworkTablesWrapper from './assets/js/networktables';
import Recorder from './assets/js/recorder';
import "assets/js/tags/app.tag";
import * as actions from  'assets/js/actions';
import 'assets/scss/app.scss';
import toastr from 'toastr';
import * as CurvedArrow from 'assets/js/curved-arrow';
import * as storage from 'assets/js/storage';
require('assets/js/require-extensions');

window.dashboard = {
  store,
  actions,
  events: riot.observable(),
  toastr,
  CurvedArrow,
  registerWidget: function(tagName, config) {
    store.dispatch(actions.registerWidget(tagName, config));
  },
  storage
};

riotReduxConnect(riot, store);

window.dashboard.recorder = new Recorder(store);
const ntWrapper = new NetworkTablesWrapper(store);

riot.mount('app');


