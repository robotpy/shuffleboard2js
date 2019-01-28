import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/index"; 

const middleware = applyMiddleware();
const store = createStore(rootReducer, middleware);

export default store;