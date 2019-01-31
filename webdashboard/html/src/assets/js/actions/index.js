import * as ActionTypes from "../constants/action-types";



export function registerWidget(widgetType, config = {}) {
  config = { 
    label: widgetType,
    category: 'Unknown',
    minX: 1,
    minY: 1,
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

export function ntWsConnectionChanged(connected) {
  return {
    type: ActionTypes.NT_WEBSOCKET_CONNECTION_CHANGED,
    payload: {
      connected
    }
  };
}

export function ntValueChanged(key, value) {
  return {
    type: ActionTypes.NT_VALUE_CHANGED,
    payload: {
      key,
      value
    }
  };
}