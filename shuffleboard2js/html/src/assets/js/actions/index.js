import * as ActionTypes from "../constants/action-types";



export function registerWidget(widgetType, config = {}) {
  config = { 
    label: widgetType,
    category: 'Unknown',
    acceptedTypes: [],
    minX: 1,
    minY: 1,
    properties: {
      tag: null,
      defaults: {}
    },
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


/**
 * Replay Actions
 */

 export function stopRecording() {
   return {
     type: ActionTypes.STOP_RECORDING
   };
 }

 export function startRecording() {
  return {
    type: ActionTypes.START_RECORDING
  };
}

export function resumeReplay() {
  return {
    type: ActionTypes.RESUME_REPLAY
  };
}

export function pauseReplay() {
  return {
    type: ActionTypes.PAUSE_REPLAY
  };
}

export function goToTime(timePercent) {
  return {
    type: ActionTypes.GO_TO_TIME,
    payload: {
      timePercent
    }
  };
}

export function setLooping(loop) {
  return {
    type: ActionTypes.SET_LOOPING,
    payload: {
      loop
    }
  }
}

export function stopReplay() {
  return {
    type: ActionTypes.STOP_REPLAY
  };
}

export function loadReplay(recording) {
  return {
    type: ActionTypes.LOAD_REPLAY,
    payload: {
      recording
    }
  };
}