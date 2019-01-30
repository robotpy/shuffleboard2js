import * as ActionTypes from "../constants/action-types";
import { set } from 'lodash';

const initialState = {
  networktables: {
    values: {},
    rawValues: {},
    wsConnected: false,
    robotConnected: false
  },
  widgets: {
    categories: ['Unknown'],
    registered: {},
    added: {}
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_WIDGET:

      return {
        ...state,
        widgets: {
          ...state.widgets,
          added: {
            ...state.widgets.added,
            [action.payload.id]: {
              type: action.payload.widgetType,
              initialPosition: action.payload.initialPosition
            }
          }
        }
      };

    case ActionTypes.REMOVE_WIDGET:

      let added = {...state.widgets.added};
      
      delete added[action.payload.widgetId];

      return {
        ...state,
        widgets: {
          ...state.widgets,
          added
        }
      };

    case ActionTypes.REGISTER_WIDGET:

      let categories = state.widgets.categories;
      let category = action.payload.config.category;

      if (categories.indexOf(category) < 0) {
        categories.push(category);
      }

      return {
        ...state,
        widgets: {
          ...state.widgets,
          categories,
          registered: {
            ...state.widgets.registered,
            [action.payload.widgetType]: action.payload.config
          }
        }
      };

    case ActionTypes.NT_ROBOT_CONNECTION_CHANGED:
      return {
        ...state,
        networktables: {
          ...state.networktables,
          robotConnected: action.payload.connected
        }
      };
    case ActionTypes.NT_WEBSOCKET_CONNECTION_CHANGED:
      return {
        ...state,
        networktables: {
          ...state.networktables,
          wsConnected: action.payload.connected
        }
      };
    case ActionTypes.NT_VALUE_CHANGED:

      let values = { ...state.networktables.values };
      
      let segments = action.payload.key.split('/')
        .filter(segment => {
          return segment !== '';
        });

      if (segments.length > 0 && !action.payload.key.endsWith('/')) {
        segments[segments.length - 1] += '/';
      }

      let path = segments
        .map(segment => {
          return `['${segment}']`;
        })
        .join('');

      if (action.payload.key.endsWith('/')) {
        path += "['/']";
      }

      set(values, path, action.payload.value);

      return {
        ...state,
        networktables: {
          ...state.networktables,
          values,
          rawValues: {
            ...state.networktables.rawValues,
            [action.payload.key]: action.payload.value
          }
        }
      };
    default:
      return state;
  }
}

export default rootReducer;