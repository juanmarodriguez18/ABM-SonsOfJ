import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource/poppins";
import Theme from "./themes/Theme";
import { CarritoContextProvider } from "./components/Carrito/CarritoContext";
import { PedidosProvider } from "./components/Pedido/PedidosContext";
import { BrowserRouter } from "react-router-dom";
import { Auth0ProviderWithNavigate } from "./components/Auth0/Auth0ProviderWithNavigate";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={Theme}>
      <CarritoContextProvider>
        <PedidosProvider>
          <BrowserRouter>
            <Auth0ProviderWithNavigate>
              <App />
            </Auth0ProviderWithNavigate>
          </BrowserRouter>
        </PedidosProvider>
      </CarritoContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
