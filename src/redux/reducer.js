import * as ActionTypes from "./action-types";
import { set, forEach, camelCase } from 'lodash';

const initialState = {
  networktables: {
    values: {},
    rawValues: {},
    robotConnected: false
  },
  sources: {
    __normalizedKey__: undefined,
    __key__: undefined,
    __value__: undefined,
    __type__: undefined,
    __name__: undefined,
    __table__: {}
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

    case ActionTypes.SOURCES_CHANGED:

      let sources = { ...state.sources };
      let { sourceChanges } = action.payload;

      const normalizeKey = (key) => {
        return key
          .split('/')
          .map(keyPart => camelCase(keyPart))
          .join('/');
      };

      forEach(sourceChanges, ({ value, type, name }, key) => {
        const normalizedKey = normalizeKey(key);
        const keyParts = normalizedKey.split('/');

        let table = sources.__table__;

        keyParts.forEach((keyPart, index) => {
          const inSources = keyPart in table;

          if (!inSources) {
            table[keyPart] = {
              __normalizedKey__: undefined,
              __key__: undefined,
              __value__: undefined,
              __type__: undefined,
              __name__: undefined,
              __table__: {}
            }
          }

          if (keyParts.length - 1 === index) {

            table[keyPart].__normalizedKey__ = normalizedKey;
            table[keyPart].__key__ = key;

            if (typeof key !== 'undefined') {
              table[keyPart].__key__ = key;
            }
            if (typeof value !== 'undefined') {
              table[keyPart].__value__ = value;
            }
            if (typeof type !== 'undefined') {
              table[keyPart].__type__ = type;
            }
            if (typeof name !== 'undefined') {
              table[keyPart].__name__ = name;
            }
          } else {
            table = table[keyPart].__table__;
          }
        });
      });

      return {
        ...state,
        sources: {
          ...sources
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