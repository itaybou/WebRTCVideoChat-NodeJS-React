import "./styles.css";

import App from "./App";
import { ContextProvider } from "./SocketContext";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
