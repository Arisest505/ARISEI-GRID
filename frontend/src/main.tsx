import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";


ReactDOM.createRoot(document.getElementById("root")!).render(

  <React.StrictMode>
    <Analytics />
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-center" richColors expand />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </DndProvider>
  </React.StrictMode>
);