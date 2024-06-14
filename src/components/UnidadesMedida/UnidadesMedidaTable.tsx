import * as React from "react";
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
import { UnidadMedida } from "../../types/UnidadMedida";

interface UnidadesMedidaTableProps {
  data: UnidadMedida[];
  onEdit: (unidadMedida: UnidadMedida) => void;
  onDelete: (unidadMedida: UnidadMedida) => void;
}

const UnidadesMedidaTable: React.FC<UnidadesMedidaTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const columns = [
    { label: "Denominación", dataKey: "denominacion", width: "100%" },
    { label: "Operaciones", dataKey: "actions", width: "100%" },
  ];

  const rowContent = (unidadMedida: UnidadMedida) => (
    <TableRow
      sx={{ display: 'table', width: '100%' }}
      key={unidadMedida.id}
      style={{backgroundColor: unidadMedida.eliminado ? "#ffebee" : "inherit"}}
    >
      <TableCell align="center" width="50%">{unidadMedida.denominacion}</TableCell>
      <TableCell align="center" width="50%">
        {unidadMedida.eliminado ? (
          <IconButton
            aria-label="restore"
            onClick={() => onDelete(unidadMedida)}
            title="Recuperar"
          >
            <RestoreIcon />
          </IconButton>
        ) : (
          <>
            <IconButton
              aria-label="edit"
              onClick={() => onEdit(unidadMedida)}
              title="Editar"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => onDelete(unidadMedida)}
              title="Eliminar"
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );

  return (
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
          <TableRow sx={{ display: 'flex', flexDirection: 'row' }}>
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
        <TableBody sx={{ display: 'block', overflowY: 'auto', maxHeight: '74vh' }}>
          {data.map((unidadMedida) => rowContent(unidadMedida))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UnidadesMedidaTable;
