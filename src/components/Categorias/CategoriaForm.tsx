import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Categoria } from '../../types/Categoria';


interface CategoriaFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (categoria: Categoria) => void;
  initialData?: Categoria;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ show, onHide, onSave, initialData }) => {
  const [denominacion, setDenominacion] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setDenominacion(initialData.denominacion);
    } else {
      setDenominacion('');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!denominacion.trim()) {
      setError('La denominación no puede estar vacía');
      return;
    }

    const categoria: Categoria = {
      ...initialData,
      denominacion,
    } as Categoria;
    onSave(categoria);
  };

  const handleClose = () => {
    setDenominacion('');
    setError('');
    onHide();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Categoria' : 'Agregar Categoria'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="denominacion"
          label="Denominación"
          type="text"
          fullWidth
          value={denominacion}
          onChange={(e) => {
            setDenominacion(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriaForm;
