import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource/poppins";
import Theme from "./themes/Theme";
import { CarritoContextProvider } from "./components/Carrito/CarritoContext";
import { PedidosProvider } from "./components/Pedido/PedidosContext";
import { AuthProvider } from "./components/ControlAcceso/AuthContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CssBaseline />
      <ThemeProvider theme={Theme}>
        <CarritoContextProvider>
          <PedidosProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PedidosProvider>
        </CarritoContextProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
