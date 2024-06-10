import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface CustomButtonProps {
  onClick: () => void;
  text: string;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, text, icon }) => {
  return (
    <Button
      className="btn-Guardar"
      onClick={onClick}
      sx={{
        bgcolor: "#43a047",
        color: "#fff",
        borderRadius: 8,
        textTransform: "none",
        ml: 2,
        "&:hover": {
          bgcolor: "#1b5e20",
        },
      }}
    >
      {icon ? icon : <AddIcon />}
      {text}
    </Button>
  );
};

export default CustomButton;
