import { LitElement } from 'lit-element';
import store from "../redux/store";
import { isNull } from 'lodash';
import { connect } from 'pwa-helpers';
import { getSubtable, getTypes } from '../networktables';

export default class Widget extends connect(store)(LitElement) {

  constructor() {
    super();
    this.widgetConfig = dashboard.store.getState().widgets.registered[this.nodeName.toLowerCase()];
    if (!this.widgetConfig) {
      return;
    }

    this.table = {};
    this.ntRoot = null;
    dashboard.events.trigger('widgetAdded', this);

    Object.defineProperty(this, 'ntRoot', {
      get() {
        return this._ntRoot;
      },
      set(value) {
        const oldValue = this._ntRoot;
        const subtable = getSubtable(value);
        if (isNull(subtable)) {
          this._ntRoot = value;
          this.requestUpdate('ntRoot', oldValue);
          this.table = {};
        } else {          
          if (!this.isAcceptedType(getTypes(value))) {
            throw new Error('Unexpected type');
          }
          this._ntRoot = value;     
          this.requestUpdate('ntRoot', oldValue);
          this.table = subtable;
        }
      }
    });
  }

  isAcceptedType(ntTypes) {

    if (isNull(ntTypes)) {
      return false;
    }

    for (let i = 0; i < ntTypes.length; i++) {
      if (this.widgetConfig.acceptedTypes.indexOf(ntTypes[i]) > -1) {
        return true;
      }
    }
    return false;
  }

  resized() {}

  stateChanged() {
    if (this.isAcceptedType(getTypes(this.ntRoot))) {
      this.table = getSubtable(this.ntRoot);
    }
  }
}