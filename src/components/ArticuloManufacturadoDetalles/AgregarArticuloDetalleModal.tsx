import React, { useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, Typography, Box, ListItem, ListItemAvatar, ListItemText, Avatar
} from '@mui/material';
import Autosuggest from 'react-autosuggest';
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
    const [sugerencias, setSugerencias] = useState<ArticuloInsumo[]>([]);
    const [valorInput, setValorInput] = useState<string>('');

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
                setValorInput('');
                onHide();
            } catch (error) {
                console.error('Error al guardar el detalle:', error);
            }
        }
    };

    const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        const filteredSuggestions = inputLength === 0 ? [] : articulosInsumo.filter(articulo =>
            articulo.denominacion.toLowerCase().includes(inputValue)
        );

        setSugerencias(filteredSuggestions);
    };

    const onSuggestionsClearRequested = () => {
        setSugerencias([]);
    };

    const getSuggestionValue = (suggestion: ArticuloInsumo) => suggestion.denominacion;

    const renderSuggestion = (suggestion: ArticuloInsumo) => (
        <ListItem button onClick={() => setArticuloInsumoSeleccionado(suggestion)}>
            <ListItemAvatar>
                <Avatar src={Array.from(suggestion.imagenesArticulo)[0].url} />
            </ListItemAvatar>
            <ListItemText primary={suggestion.denominacion} />
        </ListItem>
    );

    const onSuggestionSelected = (_event: React.FormEvent<any>, { suggestion }: { suggestion: ArticuloInsumo }) => {
        setArticuloInsumoSeleccionado(suggestion);
    };

    const inputProps = {
        placeholder: "Buscar artículo insumo",
        value: valorInput,
        onChange: (_e: React.ChangeEvent<any>, { newValue }: { newValue: string }) => {
            setValorInput(newValue);
        },
        onKeyPress: (e: React.KeyboardEvent<any>) => {
            if (e.key === 'Enter' && sugerencias.length > 0) {
                setArticuloInsumoSeleccionado(sugerencias[0]);
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
                        <Typography>Artículo Insumo</Typography>
                        <Autosuggest
                            suggestions={sugerencias}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            onSuggestionSelected={onSuggestionSelected}
                            inputProps={inputProps}
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
