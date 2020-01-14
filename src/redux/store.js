import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer"; 
import * as ActionTypes from "./action-types";

const fireEventsMiddleware = store => next => action => {

  next(action);

  if (action.type === ActionTypes.REGISTER_WIDGET) {
    dashboard.events.trigger('registerWidget');
  }
};


const middleware = applyMiddleware(fireEventsMiddleware);
const store = createStore(rootReducer, middleware);

export default store;