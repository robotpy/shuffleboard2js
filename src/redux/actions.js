import * as ActionTypes from "./action-types";

export function registerWidget(widgetType, config = {}) {

  const widgetProperties = config.class.properties || {};

  Object.defineProperty(config.class, 'properties', {
    get() {
      return {
        ...widgetProperties,
        sourceProvider: {
          type: String,
          attribute: 'source-provider',
          reflect: true
        },
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

export function initSources(providerName) {
  return {
    type: ActionTypes.INIT_SOURCES,
    payload: {
      providerName
    }
  };
}

export function clearSources(providerName) {
  return {
    type: ActionTypes.CLEAR_SOURCES,
    payload: {
      providerName
    }
  };
};

export function removeSources(providerName) {
  return {
    type: ActionTypes.REMOVE_SOURCES,
    payload: {
      providerName
    }
  };
};

export function sourcesChanged(providerName, sourceChanges) {
  return {
    type: ActionTypes.SOURCES_CHANGED,
    payload: {
      providerName,
      sourceChanges
    }
  };
}