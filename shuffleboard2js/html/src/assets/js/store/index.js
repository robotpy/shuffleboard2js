import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index"; 
import * as ActionTypes from "../constants/action-types";


const recordActionsMiddleware = store => next => action => {

  if ('meta' in action && action.meta.record) {
    dashboard.recorder.recordAction(action);
  }

  next(action);
};

const fireEventsMiddleware = store => next => action => {

  next(action);

  if (action.type === ActionTypes.LOAD_REPLAY) {
    dashboard.events.trigger('loadReplay');
  }
};


const middleware = applyMiddleware(recordActionsMiddleware, fireEventsMiddleware);
const store = createStore(rootReducer, middleware);

export default store;