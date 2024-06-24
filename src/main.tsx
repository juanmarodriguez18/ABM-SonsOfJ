import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource/poppins";
import Theme from "./themes/Theme";
import { CarritoContextProvider } from "./components/Carrito/CarritoContext";
import { PedidosProvider } from "./components/Pedido/PedidosContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={Theme}>
      <CarritoContextProvider>
        <PedidosProvider>
          <App />
        </PedidosProvider>
      </CarritoContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
