import React from "react";
import ReactDOM from "react-dom";
import ChatBot from "./components/ChatBot";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <div className="bot-container">
    <ChatBot />
    </div>
  </React.StrictMode>,
  rootElement
);
