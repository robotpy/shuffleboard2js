import * as ActionTypes from "./action-types";

export function registerWidget(widgetType, config = {}) {

  const widgetProperties = config.class.properties || {};

  Object.defineProperty(config.class, 'properties', {
    get() {
      return {
        ...widgetProperties,
        sourceKey: {
          type: String,
          attribute: 'source-key',
          reflect: true
        },
        sourceValue: {
          type: Object,
          attribute: false
        },
        sourceType: {
          type: String,
          attribute: false
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

export function clearSources() {
  return {
    type: ActionTypes.CLEAR_SOURCES
  };
};

export function sourcesChanged() {

  let sourceChanges = {};

  if (arguments.length === 1) {
    sourceChanges = arguments[0];
  } 
  else {
    const key = arguments[0];
    const value = arguments[1];
    sourceChanges[key] = value;
  }

  return {
    type: ActionTypes.SOURCES_CHANGED,
    payload: {
      sourceChanges
    }
  };
}