import * as ActionTypes from "./action-types";

export function registerWidget(widgetType, config = {}) {

  const { widgets } = dashboard.store.getState();
  const widgetExists = widgetType in widgets.registered;
  if (!config.class || widgetExists) {
    return;
  }

  const widgetProperties = config.class.properties || {};

  Object.defineProperty(config.class, 'properties', {
    get() {
      return {
        ...widgetProperties,
        table: { 
          type: Object, 
          attribute: false
        },
        ntRoot: { 
          type: String, 
          attribute: 'nt-root', 
          reflect: true
        }
      }
    }
  });

  config = { 
    class: null,
    label: widgetType,
    category: 'Unknown',
    acceptedTypes: [],
    image: '',
    ...config
  };

  // Make this happen after the action is dispatched
  // TODO: Find a better way to do this. maybe thunks?
  setTimeout(() => {
    customElements.define(widgetType, config.class);
  });

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
