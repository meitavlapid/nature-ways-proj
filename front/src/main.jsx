import React from "react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./style.css";
import { UserProvider } from "../hooks/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
