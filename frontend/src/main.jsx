import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#020617",
          color: "#e5e7eb",
          border: "1px solid #1f2933"
        }
      }}
    />
  </React.StrictMode>
);
