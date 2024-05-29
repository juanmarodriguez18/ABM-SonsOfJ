import * as React from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore'; // Nuevo icono de restaurar
import { UnidadMedida } from '../../types/UnidadMedida';

interface UnidadesMedidaTableProps {
  data: UnidadMedida[];
  onEdit: (unidadMedida: UnidadMedida) => void;
  onDelete: (unidadMedida: UnidadMedida) => void;
}

const UnidadesMedidaTable: React.FC<UnidadesMedidaTableProps> = ({ data, onEdit, onDelete }) => {
  const columns = [
    { label: 'Denominación', dataKey: 'denominacion', width: 200 },
    { label: 'Acciones', dataKey: 'actions', width: 120 },
  ];

  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column, index) => (
        <TableCell key={index} variant="head" style={{ width: column.width }}>
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (unidadMedida: UnidadMedida) => (
    <TableRow key={unidadMedida.id} style={{ backgroundColor: unidadMedida.eliminado ? '#ffebee' : 'inherit' }}>
      <TableCell>{unidadMedida.denominacion}</TableCell>
      <TableCell>
        {unidadMedida.eliminado ? ( // Verifica si la unidad de medida está eliminada
          <IconButton aria-label="restore" onClick={() => onDelete(unidadMedida)} title="Recuperar">
            <RestoreIcon />
          </IconButton>
        ) : (
          <>
            <IconButton aria-label="edit" onClick={() => onEdit(unidadMedida)} title="Editar">
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => onDelete(unidadMedida)} title="Eliminar">
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {fixedHeaderContent()}
          </TableHead>
          <TableBody>
            {data.map((unidadMedida) => (
              rowContent(unidadMedida)
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UnidadesMedidaTable;
