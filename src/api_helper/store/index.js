
import {applyMiddleware, combineReducers, createStore} from "redux";

import ReduxThunk from "redux-thunk";
import home from "../slice/homeSlice"
import {persistReducer}  from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: []
};

const middleware = () => {
    return applyMiddleware(ReduxThunk);
   
  };
  const pReducer =persistReducer(
    persistConfig,
    combineReducers({
   home}));

export default createStore(pReducer,middleware());