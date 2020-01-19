import * as ActionTypes from "./action-types";
import { set, forEach } from 'lodash';
import { normalizeKey } from '../sources';

const initialState = {
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

    case ActionTypes.SOURCES_CHANGED:

      let sources = { ...state.sources };
      let { sourceChanges } = action.payload;

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

    case ActionTypes.CLEAR_SOURCES:
      return {
        ...state,
        sources: {
          __normalizedKey__: undefined,
          __key__: undefined,
          __value__: undefined,
          __type__: undefined,
          __name__: undefined,
          __table__: {}
        }
      };

    default:
      return state;
  }
}

export default rootReducer;