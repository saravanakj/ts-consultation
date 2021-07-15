import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import Home from "./pages/Home"
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomerList from './components/CustomerList/CustomerList';

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)} >
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/customer-list" component={CustomerList} />
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
