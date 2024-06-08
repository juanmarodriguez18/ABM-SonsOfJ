import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { UnidadMedida } from '../../types/UnidadMedida';

interface UnidadMedidaFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (unidadMedida: UnidadMedida) => void;
  initialData?: UnidadMedida;
}

const UnidadMedidaForm: React.FC<UnidadMedidaFormProps> = ({ show, onHide, onSave, initialData }) => {
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

    const unidadMedida: UnidadMedida = {
      ...initialData,
      denominacion,
    } as UnidadMedida;
    onSave(unidadMedida);
  };

  const handleClose = () => {
    setDenominacion('');
    setError('');
    onHide();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Editar Unidad de Medida' : 'Agregar Unidad de Medida'}</DialogTitle>
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

export default UnidadMedidaForm;
