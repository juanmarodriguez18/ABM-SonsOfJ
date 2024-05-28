import { Box, Container } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: "100vh",
        width: "100vw",
        padding: 1.5,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          boxShadow: 5,
          borderRadius: 8,
          display: "flex",
          bgcolor: "#eee",
          overflow: "hidden",
        }}
      >
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            borderRadius: 8,
            bgcolor: "#ccc",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default Layout;
