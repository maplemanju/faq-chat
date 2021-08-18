import React from "react";
import ReactDOM from "react-dom";
import ChatBot from "./ChatBot";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ChatBot />
  </React.StrictMode>,
  rootElement
);
