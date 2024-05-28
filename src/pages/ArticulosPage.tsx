import React from "react";
import ArticuloList from "../components/ArticulosManufacturados/ArticuloList";
import { Typography } from "@mui/material";

const ArticulosPage: React.FC = () => {
  return (
    <>
      <Typography sx={{ p: 2 }} variant="h5">
        Manufacturados
      </Typography>
      <ArticuloList />
    </>
  );
};

export default ArticulosPage;
