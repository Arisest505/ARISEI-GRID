import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; //  Aquí
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <DndProvider backend={HTML5Backend} >
          <BrowserRouter>
                <Toaster position="top-center" richColors expand />
                  <AuthProvider> 
                    <App />
                  </AuthProvider>
    </BrowserRouter>
    </DndProvider>

  </React.StrictMode>
);
