import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index"; 


const recordActionsMiddleware = store => next => action => {

  if ('meta' in action && action.meta.record) {
    dashboard.recorder.recordAction(action);
  }

  next(action);
};

const middleware = applyMiddleware(recordActionsMiddleware);
const store = createStore(rootReducer, middleware);

export default store;