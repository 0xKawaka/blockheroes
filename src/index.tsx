import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ServerHandler from "./Classes/IO/ServerHandler";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

let serverHandler = new ServerHandler()

root.render(
  // <React.StrictMode>
  <App serverHandler={serverHandler} />
  // </React.StrictMode>
);

// reportWebVitals();