import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { Categoria } from '../../types/Categoria';
import { UnidadMedida } from '../../types/UnidadMedida';
import { getCategorias } from '../../services/CategoriaService';
import { getUnidadesMedida } from '../../services/UnidadMedidaService';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import { ImagenArticulo } from '../../types/ImagenArticulo';
import { crearInsumo } from '../../services/ArticuloInsumoService';
import uploadImage from '../../services/CloudinaryService';

interface InsumoFormProps {
    show: boolean;
    onHide: () => void;
    onSave: (articuloInsumo: ArticuloInsumo) => void;
    initialData?: ArticuloInsumo;
}

const InsumoForm: React.FC<InsumoFormProps> = ({
    show,
    onHide,
    onSave,
    initialData,
}) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [error, setError] = useState<string>('');
    const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(
        initialData || new ArticuloInsumo( false, '', 0, new Set<ImagenArticulo>(), new UnidadMedida(), {} as Categoria, 0, 0, 0, false));

    useEffect(() => {
        if (initialData) {
            setArticuloInsumo(initialData);
        } else {
            // Inicializamos con valores por defecto
            setArticuloInsumo(new ArticuloInsumo( false, '', 0, new Set<ImagenArticulo>(), new UnidadMedida(), {} as Categoria, 0, 0, 0, false));
        }
    }, [initialData]);

    useEffect(() => {
        // Cargamos categorías y unidades de medida
        getCategorias().then((data) => {
            setCategorias(data);
            // Si no hay initialData, inicializamos con la primera categoría
            if (!initialData && data.length > 0) {
                setArticuloInsumo((prev) => ({
                    ...prev,
                    categoria: data[0],
                }));
            }
        });
        getUnidadesMedida().then((data) => {
            setUnidadesMedida(data);
            // Si no hay initialData, inicializamos con la primera unidad de medida
            if (!initialData && data.length > 0) {
                setArticuloInsumo((prev) => ({
                    ...prev,
                    unidadMedida: data[0],
                }));
            }
        });
    }, [initialData]);

    const handleSubmit = async () => {
        if (!articuloInsumo.denominacion.trim()) {
            setError('La denominación no puede estar vacía');
            return;
        }
    
        try {
            // Convertimos el Set de imágenes a un array de objetos con propiedad 'url'
            const imagenesArticuloArray = Array.from(articuloInsumo.imagenesArticulo).map(
                (imagen: ImagenArticulo) => ({ id: 0, url: imagen.url, eliminado: false })
            );
    
            const insumoParaGuardar = {
                ...articuloInsumo,
                id: articuloInsumo.id || 0, // Asegurar que el id esté presente
                imagenesArticulo: imagenesArticuloArray,
            };
    
            console.log('JSON enviado al backend:', JSON.stringify(insumoParaGuardar));
    
            const nuevoInsumo = await crearInsumo(insumoParaGuardar); // Crear un nuevo insumo
            alert('El insumo se guardó correctamente.');
            onSave(nuevoInsumo);
        } catch (error) {
            console.error('Error al guardar el insumo:', error);
            alert(
                'Hubo un error al guardar el insumo. Por favor, inténtalo de nuevo.'
            );
        }
    };
    
    
    const handleClose = () => {
        setArticuloInsumo(new ArticuloInsumo( false, '', 0, new Set<ImagenArticulo>(), new UnidadMedida(), {} as Categoria, 0, 0, 0, false));
        setError('');
        onHide();
    };

    const handleChange = (field: keyof ArticuloInsumo, value: any) => {
        setArticuloInsumo((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file, setArticuloInsumo); // Llama a la función de utilidad
        }
    };

    return (
        <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Editar Artículo Insumo' : 'Agregar Artículo Insumo'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="denominacion"
                    label="Denominación"
                    type="text"
                    fullWidth
                    value={articuloInsumo.denominacion}
                    onChange={(e) => handleChange('denominacion', e.target.value)}
                    error={!!error}
                    helperText={error}
                />
                <TextField
                    margin="dense"
                    id="precioCompra"
                    label="Precio de Compra"
                    type="number"
                    fullWidth
                    value={articuloInsumo.precioCompra}
                    onChange={(e) => handleChange('precioCompra', +e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="precioVenta"
                    label="Precio de Venta"
                    type="number"
                    fullWidth
                    value={articuloInsumo.precioVenta}
                    onChange={(e) => handleChange('precioVenta', +e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="stockActual"
                    label="Stock Actual"
                    type="number"
                    fullWidth
                    value={articuloInsumo.stockActual}
                    onChange={(e) => handleChange('stockActual', +e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="stockMinimo"
                    label="Stock Mínimo"
                    type="number"
                    fullWidth
                    value={articuloInsumo.stockMinimo}
                    onChange={(e) => handleChange('stockMinimo', +e.target.value)}
                />
                <FormControl fullWidth margin="dense" error={!!error}>
                    <InputLabel id="unidadMedida-label">Unidad de Medida</InputLabel>
                    <Select
                        labelId="unidadMedida-label"
                        id="unidadMedida"
                        value={articuloInsumo.unidadMedida.id || ''}
                        onChange={(e) =>
                            handleChange(
                                'unidadMedida',
                                unidadesMedida.find((um) => um.id === e.target.value) || new UnidadMedida()
                            )
                        }
                        fullWidth
                    >
                        {unidadesMedida.map((unidad) => (
                            <MenuItem key={unidad.id} value={unidad.id}>
                                {unidad.denominacion}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{error}</FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="dense" error={!!error}>
                    <InputLabel id="categoria-label">Categoría</InputLabel>
                    <Select
                        labelId="categoria-label"
                        id="categoria"
                        value={articuloInsumo.categoria.id || ''}
                        onChange={(e) =>
                            handleChange(
                                'categoria',
                                categorias.find((cat) => cat.id === e.target.value) || ({} as Categoria)
                            )
                        }
                        fullWidth
                    >
                        {categorias.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.denominacion}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{error}</FormHelperText>
                </FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={articuloInsumo.esParaElaborar}
                            onChange={(e) => handleChange('esParaElaborar', e.target.checked)}
                            color="primary"
                        />
                    }
                    label="¿Es para elaborar?"
                />
                {/* Lógica para manejar las imágenes */}
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="imagen"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="imagen">
                    <Button variant="contained" color="primary" component="span">
                        Cargar Imagen
                    </Button>
                </label>
                {Array.from(articuloInsumo.imagenesArticulo).map((imagen, index) => (
                    <div key={imagen.id}>
                        <img src={imagen.url} alt={`Imagen ${index + 1}`} width="100" />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setArticuloInsumo((prev) => {
                                    const newImages = new Set(prev.imagenesArticulo);
                                    newImages.delete(imagen);
                                    return {
                                        ...prev,
                                        imagenesArticulo: newImages,
                                    };
                                });
                            }}
                        >
                            Eliminar
                        </Button>
                    </div>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InsumoForm;
