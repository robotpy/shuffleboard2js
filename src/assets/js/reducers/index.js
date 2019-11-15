import * as ActionTypes from "../constants/action-types";
import { set } from 'lodash';

const initialState = {
  replay: {
    state: 'RECORDING', 
    recording: [],
    recordingLength: 0,
    recordingTime: 0,
    loopRecord: false
  },
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

    case ActionTypes.STOP_RECORDING:
      
      return {
        ...state,
        replay: {
          ...state.replay,
          state: 'RECORDING_STOPPED'
        }
      };

    case ActionTypes.START_RECORDING:
      
      return {
        ...state,
        replay: {
          ...state.replay,
          state: 'RECORDING'
        }
      };

    case ActionTypes.RESUME_REPLAY:
      
      return {
        ...state,
        replay: {
          ...state.replay,
          state: 'REPLAYING'
        }
      };

    case ActionTypes.PAUSE_REPLAY:
      
      return {
        ...state,
        replay: {
          ...state.replay,
          state: 'REPLAYING_PAUSED'
        }
      };

    case ActionTypes.GO_TO_TIME:

      const timePercent = Math.clamp(action.payload.timePercent, 0, 1);
      const recordingTime = timePercent * state.replay.recordingLength;
      
      return {
        ...state,
        replay: {
          ...state.replay,
          recordingTime: recordingTime
        }
      };

    case ActionTypes.STOP_REPLAY:
      
      return {
        ...state,
        replay: {
          ...state.replay,
          state: 'RECORDING',
        }
      };

    case ActionTypes.LOAD_REPLAY:

      const recording = action.payload.recording;
      
      if (recording.updates.length > 0) {
        var recordingLength = Math.max(recording.updates[recording.updates.length - 1].time, 1);
      }
      else {
        var recordingLength = 1;
      }
      
      return {
        ...state,
        replay: {
          ...state.replay,
          state: 'REPLAYING_PAUSED',
          recording,
          recordingLength,
          recordingTime: 0
        }
      };

    case ActionTypes.SET_LOOPING:

      return {
        ...state,
        replay: {
          ...state.replay,
          loopRecord: action.payload.loop
        }
      };

    default:
      return state;
  }
}

export default rootReducer;