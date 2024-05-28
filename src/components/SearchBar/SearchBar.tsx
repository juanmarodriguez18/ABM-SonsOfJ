import React from "react";
import { TextField, Typography } from "@mui/material";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <>
      <Typography variant="subtitle2" sx={{ alignSelf: "flex-end" }}>
        Buscar por denominación:
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          width: "20%",
          marginBottom: 2,
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#3f51b5", // Cambiar el color del borde cuando está enfocado
            },
        }}
      />
    </>
  );
};

export default SearchBar;
