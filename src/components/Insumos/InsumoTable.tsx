import React from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";

interface InsumoTableProps {
  data: ArticuloInsumo[];
  onEdit: (articuloInsumo: ArticuloInsumo) => void;
  onDelete: (articuloInsumo: ArticuloInsumo) => void;
}

const InsumoTable: React.FC<InsumoTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const columns = [
    { label: "Denominación", dataKey: "denominacion", width: "100%" },
    { label: "Imagen", dataKey: "imagenesArticulo", width: "100%" },
    { label: "Precio Compra", dataKey: "precioCompra", width: "100%" },
    { label: "Stock Actual", dataKey: "stockActual", width: "100%" },
    { label: "Stock Mínimo", dataKey: "stockMinimo", width: "100%" },
    { label: "Es para elaborar", dataKey: "esParaElaborar", width: "100%" },
    { label: "Operaciones", dataKey: "actions", width: "100%" },
  ];

  const rowContent = (articuloInsumo: ArticuloInsumo) => {
    const primeraImagen = Array.from(articuloInsumo.imagenesArticulo)[0]?.url;

    return (
      <TableRow
        sx={{ display: "table", width: "100%" }}
        key={articuloInsumo.id}
        style={{backgroundColor: articuloInsumo.eliminado ? "#ffebee" : "inherit"}}
      >
        <TableCell align="center">
          {articuloInsumo.denominacion}
        </TableCell>
        <TableCell align="center">
          {primeraImagen && (
            <img
              className="img"
              src={primeraImagen}
              alt={articuloInsumo.denominacion}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          )}
        </TableCell>
        <TableCell align="center">
          {articuloInsumo.precioCompra}
        </TableCell>
        <TableCell align="center">
          {articuloInsumo.stockActual}
        </TableCell>
        <TableCell align="center">
          {articuloInsumo.stockMinimo}
        </TableCell>
        <TableCell align="center">
          {articuloInsumo.esParaElaborar ? "Sí" : "No"}
        </TableCell>
        <TableCell align="center">
          {articuloInsumo.eliminado ? (
            <IconButton
              aria-label="restore"
              onClick={() => onDelete(articuloInsumo)}
              title="Recuperar"
            >
              <RestoreIcon />
            </IconButton>
          ) : (
            <>
              <IconButton
                aria-label="edit"
                onClick={() => onEdit(articuloInsumo)}
                title="Editar"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => onDelete(articuloInsumo)}
                title="Eliminar"
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 8,
          width: "100%",
          marginTop: 2,
          bgcolor: "#eee",
          boxShadow: 2,
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: "#aaa" }}>
            <TableRow sx={{ display: "flex", flexDirection: "row" }}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  variant="head"
                  style={{ width: column.width, textAlign: "center" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{ display: "block", overflowY: "auto", maxHeight: "74vh" }}
          >
            {data.map((articuloInsumo) => rowContent(articuloInsumo))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default InsumoTable;
