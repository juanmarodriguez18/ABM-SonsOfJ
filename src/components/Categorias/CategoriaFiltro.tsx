import React from "react";
import { FormControl, MenuItem, Select, Typography, Box } from "@mui/material";
import { Categoria } from "../../types/Categoria";

interface CategoriaFiltroProps {
  categorias: Categoria[];
  categoriaSeleccionada: string;
  setCategoriaSeleccionada: (categoria: string) => void;
}

const CategoriaFiltro: React.FC<CategoriaFiltroProps> = ({ categorias, categoriaSeleccionada, setCategoriaSeleccionada }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Typography variant="subtitle2" sx={{ mr: 1 }}>Filtrar por categoría:</Typography>
      <FormControl
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3f51b5',
          },
        }}
      >
        <Select
          size="small"
          id="categorias"
          className="form-select"
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          value={categoriaSeleccionada}
          sx={{
            width: 200,
            ml: 1,
            bgcolor: '#ccc',
          }}
        >
          <MenuItem value="">Seleccionar categoría...</MenuItem>
          {categorias.map((categoria, index) => (
            <MenuItem
              key={index}
              value={categoria.denominacion}
            >
              <Typography variant="subtitle2">
                {categoria.denominacion}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CategoriaFiltro;
