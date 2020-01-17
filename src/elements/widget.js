import { LitElement } from 'lit-element';
import store from "../redux/store";
import { isNull, isArray } from 'lodash';
import { connect } from 'pwa-helpers';
import { getSubtable, getTypes } from '../networktables';


export default class Widget extends connect(store)(LitElement) {

  constructor() {
    super();
    this.widgetConfig = dashboard.store.getState().widgets.registered[this.nodeName.toLowerCase()];
    if (!this.widgetConfig) {
      return;
    }

    Object.defineProperty(this, 'table', {
      get() {
        return this._table;
      },
      set(value) {
        const oldValue = this._value;
        this._table = value;
        this.requestUpdate('table', oldValue);
        this._dispatchTableChange();
      }
    });

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
        const ntTypes = getTypes(value);
        const widgetId = this.getAttribute('widget-id');
        if (isNull(subtable)) {
          this.ntTypes = ntTypes;
          this._ntRoot = value;
          this.requestUpdate('ntRoot', oldValue);
          this._dispatchNtRootChange();
          this.table = {};
        } else if (!this.isAcceptedType(ntTypes)) {
          dashboard.toastr.error(`
            Can't add source to widget with ID '${widgetId}'. Widgets of type '${this.widgetConfig.label}' 
            doesn't accept type '${value}'. Accepted types are '${this.widgetConfig.acceptedTypes.join(', ')}'
          `);
        } else {
          this.ntTypes = ntTypes;
          this._ntRoot = value;     
          this.requestUpdate('ntRoot', oldValue);
          this._dispatchNtRootChange();
          this.table = subtable;
          dashboard.toastr.success(`
            Successfully added source '${value}' to widget
            with ID '${widgetId}'
          `);
        }
      }
    });

    this.table = {};
    this.ntRoot = null;
    dashboard.events.trigger('widgetAdded', this);
    this.setInitialNtRoot();

    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
  }

  async setInitialNtRoot() {
    await this.updateComplete;
    const widgetId = this.getAttribute('widget-id');
    const source = dashboard.storage.getWidgetSource(widgetId);
    if (source) {
      this.ntRoot = source;
    }
  }

  _dispatchNtRootChange() {
    const event = new CustomEvent('nt-root-change', {
      detail: {
        ntRoot: this.ntRoot
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _dispatchTableChange() {
    const event = new CustomEvent('table-change', {
      detail: {
        table: this.table
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
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

  hasAcceptedNtType() {
    return this.isAcceptedType(isArray(this.ntTypes) ? this.ntTypes : []);
  }

  hasNtSource() {
    return !isNull(this.ntRoot) && typeof this.ntRoot !== 'undefined';
  }

  isNtType(type) {
    return isArray(this.ntTypes) ? this.ntTypes.includes(type) : false;
  }

  resized() {}

  stateChanged() {
    if (this.isAcceptedType(getTypes(this.ntRoot))) {
      this.table = getSubtable(this.ntRoot);
    }
  }
}