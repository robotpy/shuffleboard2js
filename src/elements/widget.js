import { LitElement } from 'lit-element';
import store from "../redux/store";
import { isNull, forEach } from 'lodash';
import { connect } from 'pwa-helpers';
import { getSource } from '../sources';
import { get as getProvider } from '../source-providers';


export default class Widget extends connect(store)(LitElement) {

  constructor() {
    super();
    this.widgetConfig = dashboard.store.getState().widgets.registered[this.nodeName.toLowerCase()];
    this.sourceProviderName = 'networktables';
    if (!this.widgetConfig) {
      return;
    }

    Object.defineProperty(this, 'sourceValue', {
      get() {
        return this._sourceValue;
      },
      set(value) {
        if ('__generated__' in value) {
          const oldValue = this._value;
          this._sourceValue = value;
          this.requestUpdate('sourceValue', oldValue);
          this._dispatchSourceValueChange();
        } else {
          const sourceProvider = getProvider(this.sourceProviderName);
          if (typeof this.sourceKey === 'string' && sourceProvider) {
            sourceProvider.updateFromDashboard(this.sourceKey, value);
          }
        }
      }
    });

    Object.defineProperty(this, 'sourceKey', {
      get() {
        return this._sourceKey;
      },
      set(value) {

        if (isNull(value)) {
          return;
        }

        const oldValue = this._sourceKey;
        const source = getSource(value);
        const widgetId = this.getAttribute('widget-id');

        if (isNull(source)) {
          this.sourceType = null;
          this._sourceKey = value;
          this.requestUpdate('sourceKey', oldValue);
          this._dispatchSourceKeyChange();
          this.sourceValue = { __generated__: true };
        } else if (!this.isAcceptedType(source.__type__)) {
          dashboard.toastr.error(`
            Can't add source to widget with ID '${widgetId}'. Widgets of type '${this.widgetConfig.label}' 
            doesn't accept type '${source.__type__}'. Accepted types are '${this.widgetConfig.acceptedTypes.join(', ')}'
          `);
        } else {
          this.sourceType = source.__type__;
          this._sourceKey = value;     
          this.requestUpdate('sourceKey', oldValue);
          this._dispatchSourceKeyChange();
          this.sourceValue = this._generateSourceValue(source);
          dashboard.toastr.success(`
            Successfully added source '${value}' to widget
            with ID '${widgetId}'
          `);
        }
      }
    });

    this.sourceValue = { __generated__: true };
    this.sourceKey = null;
    this.sourceType = null;
    dashboard.events.trigger('widgetAdded', this);
    this._setInitialSourceKey();

    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
  }

  async _setInitialSourceKey() {
    await this.updateComplete;
    const widgetId = this.getAttribute('widget-id');
    const source = dashboard.storage.getWidgetSource(widgetId);
    if (source) {
      this.sourceKey = source;
    }
  }

  _dispatchSourceKeyChange() {
    const event = new CustomEvent('source-key-change', {
      detail: {
        sourceKey: this.sourceKey
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _dispatchSourceValueChange() {
    const event = new CustomEvent('source-value-change', {
      detail: {
        sourceValue: this.sourceValue
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _generateSourceValue(source) {
    const sourceProvider = getProvider(this.sourceProviderName);
    const rawValue = source.__value__;
    const sourceType = source.__type__;
    const table = source.__table__;
    let value = {};

    if (sourceType === 'Boolean') {
      value = new Boolean(rawValue);
    } else if (sourceType === 'Number') {
      value = new Number(rawValue);
    } else if (sourceType === 'String') {
      value = new String(rawValue);
    } else if (sourceType === 'Array') {
      value = [...rawValue];
    }

    value.__generated__ = true;

    forEach(table, (source, propertyName) => {
      const tableValue = this._generateSourceValue(source);
      Object.defineProperty(value, propertyName, {
        get() {
          return tableValue;
        },
        set(value) {
          const sourceKey = source.__key__;
          if (typeof sourceKey === 'string' && sourceProvider) {
            sourceProvider.updateFromDashboard(sourceKey, value);
          }
        }
      });
    });

    return value;
  }

  isAcceptedType(sourceType) {

    if (typeof sourceType === 'undefined') {
      return false;
    }

    return this.widgetConfig.acceptedTypes.includes(sourceType);
  }
  
  hasAcceptedType() {
    return this.isAcceptedType(this.sourceType);
  }

  hasSource() {
    return !isNull(this.sourceKey) && typeof this.sourceKey !== 'undefined';
  }

  resized() {}

  stateChanged() {
    if (this.hasAcceptedType()) {
      const source = getSource(this.sourceKey);
      this.sourceValue = this._generateSourceValue(source);
    }
  }
}