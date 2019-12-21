import * as ActionTypes from "../constants/action-types";
import { set } from 'lodash';

const initialState = {
  networktables: {
    values: {},
    rawValues: {},
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
    case ActionTypes.CLEAR_NETWORKTABLES:
      return {
        ...state,
        networktables: {
          ...state.networktables,
          values: {},
          rawValues: {}
        }
      }
    case ActionTypes.NT_VALUE_CHANGED:

      let values = { ...state.networktables.values };
      let valueChanges = action.payload.valueChanges;

      for (let key in valueChanges) {

        let value = valueChanges[key];

        let segments = key.split('/')
          .filter(segment => {
            return segment !== '';
          });

        if (segments.length > 0 && !key.endsWith('/')) {
          segments[segments.length - 1] += '/';
        }

        let path = segments
          .map(segment => {
            return `['${segment}']`;
          })
          .join('');

        if (key.endsWith('/')) {
          path += "['/']";
        }

        set(values, path, value);
      }

      return {
        ...state,
        networktables: {
          ...state.networktables,
          values,
          rawValues: {
            ...state.networktables.rawValues,
            ...valueChanges
          }
        }
      };

    case ActionTypes.INIT_NETWORKTABLES:

      return {
        ...state,
        networktables: {
          ...state.networktables,
          values: {},
          rawValues: {}
        }
      };

    default:
      return state;
  }
}

export default rootReducer;