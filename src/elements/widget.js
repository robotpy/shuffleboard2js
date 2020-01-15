import { LitElement } from 'lit-element';
import store from "../redux/store";
import { isNull } from 'lodash';
import { connect } from 'pwa-helpers';
import { getSubtable, getTypes } from '../networktables';

class UnexpectedType extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
    this.name = 'UnexpectedType';
  }
}

export default class Widget extends connect(store)(LitElement) {

  constructor() {
    super();
    this.widgetConfig = dashboard.store.getState().widgets.registered[this.nodeName.toLowerCase()];
    if (!this.widgetConfig) {
      return;
    }

    Object.defineProperty(this, 'ntRoot', {
      get() {
        return this._ntRoot;
      },
      set(value) {

        if (isNull(value)) {
          return;
        }

        const oldValue = this._ntRoot;
        const subtable = getSubtable(value);
        if (isNull(subtable)) {
          this._ntRoot = value;
          this.requestUpdate('ntRoot', oldValue);
          this.table = {};
        } else {          
          if (!this.isAcceptedType(getTypes(value))) {
            const widgetId = this.getAttribute('widget-id');
            throw new UnexpectedType(`Unexpected type for widget with widget-id '${widgetId}'`);
          }
          this._ntRoot = value;     
          this.requestUpdate('ntRoot', oldValue);
          this.table = subtable;
        }
      }
    });

    this.table = {};
    this.ntRoot = null;
    dashboard.events.trigger('widgetAdded', this);
    this.setInitialNtRoot();
  }

  async setInitialNtRoot() {
    await this.updateComplete;
    const widgetId = this.getAttribute('widget-id');
    const source = dashboard.storage.getWidgetSource(widgetId);
    if (source) {
      this.ntRoot = source;
    }
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