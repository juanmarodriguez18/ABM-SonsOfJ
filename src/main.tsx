import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource/poppins";
import Theme from "./themes/Theme";
import { CarritoContextProvider } from "./components/Carrito/CarritoContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
      <ThemeProvider theme={Theme}>
        <CarritoContextProvider>
          <App />
        </CarritoContextProvider>
      </ThemeProvider>
  </React.StrictMode>
);
