import store from "assets/js/store/index";
import riot from 'riot';
import NetworkTablesWrapper from './assets/js/networktables';
import Recorder from './assets/js/recorder';
//import "assets/js/tags/app.tag";
import * as Lit from 'lit-element';
import "./assets/js/elements/app-dashboard";
import * as actions from  'assets/js/actions';
import 'assets/scss/app.scss';
import toastr from 'toastr';
import * as CurvedArrow from 'assets/js/curved-arrow';
import * as storage from 'assets/js/storage';
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
  Lit
};


window.dashboard.recorder = new Recorder(store);
const ntWrapper = new NetworkTablesWrapper(store);
