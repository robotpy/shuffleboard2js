import * as ActionTypes from "./action-types";
import { forEach, isEmpty } from 'lodash';
import { normalizeKey } from '../source-managers';

const initialState = {
  sources: {},
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

    case ActionTypes.INIT_SOURCES:

      let newSources = { ...state.sources[action.payload.providerName] };

      if (isEmpty(newSources)) {
        newSources = {
          __normalizedKey__: undefined,
          __key__: undefined,
          __value__: undefined,
          __type__: undefined,
          __name__: undefined,
          __sources__: {}
        };
      }

      return {
        ...state,
        sources: {
          ...state.sources,
          [action.payload.providerName]: newSources
        }
      };

    case ActionTypes.SOURCES_CHANGED:

      let { sourceChanges, providerName } = action.payload;
      let sourcesRoot = { ...state.sources[providerName] };

      if (isEmpty(sourcesRoot)) {
        sourcesRoot = {
          __normalizedKey__: undefined,
          __key__: undefined,
          __value__: undefined,
          __type__: undefined,
          __name__: undefined,
          __sources__: {}
        };
      }

      forEach(sourceChanges, ({ value, type, name }, key) => {
        const normalizedKey = normalizeKey(key);
        const keyParts = normalizedKey.split('/');

        let sources = sourcesRoot.__sources__;

        keyParts.forEach((keyPart, index) => {
          const inSources = keyPart in sources;

          if (!inSources) {
            sources[keyPart] = {
              __normalizedKey__: undefined,
              __key__: undefined,
              __value__: undefined,
              __type__: undefined,
              __name__: undefined,
              __sources__: {}
            }
          }

          if (keyParts.length - 1 === index) {

            sources[keyPart].__normalizedKey__ = normalizedKey;
            sources[keyPart].__key__ = key;

            if (typeof key !== 'undefined') {
              sources[keyPart].__key__ = key;
            }
            if (typeof value !== 'undefined') {
              sources[keyPart].__value__ = value;
            }
            if (typeof type !== 'undefined') {
              sources[keyPart].__type__ = type;
            }
            if (typeof name !== 'undefined') {
              sources[keyPart].__name__ = name;
            }
          } else {
            sources = sources[keyPart].__sources__;
          }
        });
      });

      return {
        ...state,
        sources: {
          ...state.sources,
          [providerName]: sourcesRoot
        }
      };

    case ActionTypes.CLEAR_SOURCES:

      const shouldClear = action.payload.providerName in state.sources;

      if (!shouldClear) {
        return state;
      }
      
      return {
        ...state,
        sources: {
          ...state.sources,
          [action.payload.providerName]: {
            __normalizedKey__: undefined,
            __key__: undefined,
            __value__: undefined,
            __type__: undefined,
            __name__: undefined,
            __sources__: {}
          }
        }
      };

    case ActionTypes.REMOVE_SOURCES:

      let allSources = { ...state.sources };
      delete allSources[action.payload.providerName];
      
      return {
        ...state,
        sources: allSources
      };

    default:
      return state;


  }
}

export default rootReducer;