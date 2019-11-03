import React from "react";
import { Provider } from "react-redux";
import "./App.css";
import configureStore from "./store";
import { Page } from "./Page";

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <div style={{ height: "100vh", width: "100vw" }}>
      <Page />
    </div>
  </Provider>
);

export default App;
