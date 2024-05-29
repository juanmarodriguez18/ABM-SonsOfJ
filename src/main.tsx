import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "@fontsource/poppins";
import Theme from "./themes/Theme.tsx";
import Layout from "./components/Layout/Layout.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline>
      <ThemeProvider theme={Theme}>
        <Layout>
          <App />
        </Layout>
      </ThemeProvider>
    </CssBaseline>
  </React.StrictMode>
);
