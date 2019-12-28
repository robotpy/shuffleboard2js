import * as ActionTypes from "../constants/action-types";
import pathModule from 'path';
import { get } from 'lodash';


export function registerWidget(widgetType, config = {}) {

  const isCustomElement = !!customElements.get(widgetType);

  if (isCustomElement) {
    const widget = customElements.get(widgetType);
    widget.properties = {
      table: { type: Object },
      widgetProps: { type: Object },
      ntRoot: { type: String }
    };
    widget.prototype.resized = () => {};
  }

  const propertiesTag = get(config, 'properties.tag');
  let isPropertiesTagCustomElement = false;
  if (propertiesTag && customElements.get(propertiesTag)) {
    isPropertiesTagCustomElement = true;
  }

  config.properties = {
    isCustomElement: isPropertiesTagCustomElement,
    tag: null,
    defaults: {},
    ...config.properties
  };

  config = { 
    label: widgetType,
    category: 'Unknown',
    acceptedTypes: [],
    defaultsFor: [],
    image: '',
    minX: 1,
    minY: 1,
    isCustomElement,
    ...config
  };

  return {
    type: ActionTypes.REGISTER_WIDGET,
    payload: {
      widgetType,
      config
    }
  };
}

export function addWidget(widgetType, row, col) {
  return {
    type: ActionTypes.ADD_WIDGET,
    payload: {
      widgetType,
      id: 0,
      initialPosition: {
        row,
        col
      }
    }
  };
}

export function removeWidget(widgetId) {
  return {
    type: ActionTypes.REMOVE_WIDGET,
    payload: {
      widgetId
    }
  };
}


/**
 * NetworkTables actions
 */

export function ntRobotConnectionChanged(connected) {
  return {
    type: ActionTypes.NT_ROBOT_CONNECTION_CHANGED,
    payload: {
      connected
    }
  };
}

export function ntValueChanged() {

  let valueChanges = {};

  if (arguments.length === 1) {
    valueChanges = arguments[0];
  } 
  else {
    const key = arguments[0];
    const value = arguments[1];
    valueChanges[key] = value;
  }


  return {
    type: ActionTypes.NT_VALUE_CHANGED,
    payload: {
      valueChanges
    },
    meta: {
      record: true
    }
  };
}

export function initNetworktTables() {
  return {
    type: ActionTypes.INIT_NETWORKTABLES
  };
};

export function clearNetworkTables() {
  return {
    type: ActionTypes.CLEAR_NETWORKTABLES
  };
};
