import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

interface AgregarUnidadMedidaModalProps {
    show: boolean;
    onHide: () => void;
    agregarUnidadMedida: (denominacion: string) => void;
}

const AgregarUnidadMedidaModal: React.FC<AgregarUnidadMedidaModalProps> = ({ show, onHide, agregarUnidadMedida }) => {
    const [denominacionInput, setDenominacionInput] = useState<string>('');

    const handleClose = () => {
        onHide();
    };

    const handleGuardar = () => {
        agregarUnidadMedida(denominacionInput);
        setDenominacionInput('');
        onHide();
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Agregar Nueva Unidad de Medida</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="denominacion"
                    label="Denominación"
                    type="text"
                    fullWidth
                    value={denominacionInput}
                    onChange={(e) => setDenominacionInput(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} variant="contained" color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgregarUnidadMedidaModal;
