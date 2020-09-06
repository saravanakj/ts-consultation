import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter,Route,Switch} from "react-router-dom";
import {persistStore} from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import Home from "./pages/Home"
import 'bootstrap/dist/css/bootstrap.min.css';

const App=({store})=> {
  return (
    <Provider store ={store}>
    <PersistGate loading={null} persistor={persistStore(store)} >
     <BrowserRouter>
     <Switch>
    <Route exact path="/" component={Home}/>
  </Switch>
  </BrowserRouter>
  </PersistGate>
  </Provider>
  );
}

export default App;
