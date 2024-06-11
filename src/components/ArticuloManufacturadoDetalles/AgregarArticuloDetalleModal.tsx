import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Box, ListItem, ListItemAvatar, ListItemText, Avatar, Autocomplete
} from '@mui/material';
import { ArticuloManufacturadoDetalle } from '../../types/ArticuloManufacturadoDetalle';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import { crearArticuloManufacturadoDetalle, obtenerUltimoId } from '../../services/ArticuloManufacturadoDetalleService';

interface AgregarArticuloDetalleModalProps {
    show: boolean;
    onHide: () => void;
    agregarArticuloDetalle: (detalle: ArticuloManufacturadoDetalle) => void;
    articulosInsumo: ArticuloInsumo[];
}

const AgregarArticuloDetalleModal: React.FC<AgregarArticuloDetalleModalProps> = ({
    show,
    onHide,
    agregarArticuloDetalle,
    articulosInsumo,
}) => {
    const [cantidadInput, setCantidadInput] = useState<number>(0);
    const [articuloInsumoSeleccionado, setArticuloInsumoSeleccionado] = useState<ArticuloInsumo | null>(null);

    const handleClose = () => {
        onHide();
    };

    const handleGuardar = async () => {
        if (articuloInsumoSeleccionado && cantidadInput > 0) {
            try {
                const ultimoId = await obtenerUltimoId();
                const nuevoId = ultimoId + 1;

                const nuevoDetalle: ArticuloManufacturadoDetalle = {
                    id: nuevoId,
                    eliminado: false,
                    cantidad: cantidadInput,
                    articuloInsumo: articuloInsumoSeleccionado,
                };

                agregarArticuloDetalle(nuevoDetalle);
                await crearArticuloManufacturadoDetalle(nuevoDetalle);

                setCantidadInput(0);
                setArticuloInsumoSeleccionado(null);
                onHide();
            } catch (error) {
                console.error('Error al guardar el detalle:', error);
            }
        }
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Agregar Detalle de Artículo Manufacturado</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Cantidad"
                            type="number"
                            value={cantidadInput}
                            onChange={(e) => setCantidadInput(parseInt(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            options={articulosInsumo}
                            getOptionLabel={(option) => option.denominacion}
                            renderOption={(props, option) => (
                                <ListItem {...props}>
                                    <ListItemAvatar>
                                        <Avatar src={Array.from(option.imagenesArticulo)[0].url} />
                                    </ListItemAvatar>
                                    <ListItemText primary={option.denominacion} />
                                </ListItem>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Buscar artículo insumo"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            value={articuloInsumoSeleccionado}
                            onChange={(_event, newValue) => {
                                setArticuloInsumoSeleccionado(newValue);
                            }}
                        />
                        {articuloInsumoSeleccionado && (
                            <Box mt={2}>
                                <img
                                    src={Array.from(articuloInsumoSeleccionado.imagenesArticulo)[0].url}
                                    alt="Imagen seleccionada"
                                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleGuardar}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgregarArticuloDetalleModal;
