import React from "react";
import ArticuloList from "../components/ArticulosManufacturados/ArticuloList";
import { Typography } from "@mui/material";

const ArticulosPage: React.FC = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom p={3}>
        Articulos Manufacturados
      </Typography>
      <ArticuloList />
    </>
  );
};

export default ArticulosPage;
