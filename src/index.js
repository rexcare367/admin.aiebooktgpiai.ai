import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { SoftUIControllerProvider } from "context";
import { RewardsProvider } from "./context/RewardsContext"; // Add this import
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AdminAuthProvider>
      <SoftUIControllerProvider>
        <RewardsProvider>
          <App />
        </RewardsProvider>
      </SoftUIControllerProvider>
    </AdminAuthProvider>
  </BrowserRouter>
);
