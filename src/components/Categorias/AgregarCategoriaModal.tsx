import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField
} from '@mui/material';
import { crearCategoria } from '../../services/CategoriaService';
import '../../styles/InsumoFormulario.css';

interface ModalFormularioCategoriaProps {
    show: boolean;
    onHide: () => void;
    actualizarCategorias: (id: number, datosActualizados: any) => Promise<void>; // Corregir la firma de la función
}

const ModalFormularioCategoria: React.FC<ModalFormularioCategoriaProps> = ({ show, onHide, actualizarCategorias }) => {
    const [denominacion, setDenominacion] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const nuevaCategoria = await crearCategoria({ denominacion });
            actualizarCategorias(nuevaCategoria.id, nuevaCategoria); // Actualizamos la lista de categorías después de agregar una nueva
            onHide(); // Cerramos el modal
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    };

    return (
        <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
            <DialogTitle>Agregar Nueva Categoría</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Denominación"
                        type="text"
                        placeholder="Ingrese la denominación de la categoría"
                        value={denominacion}
                        onChange={(e) => setDenominacion(e.target.value)}
                        required
                    />
                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button className="btn-Guardar" variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ModalFormularioCategoria;
