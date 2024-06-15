import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, MenuItem, DialogTitle, DialogContent, FormControl, InputLabel, Select, DialogActions, Dialog, FormLabel, Autocomplete, IconButton } from '@mui/material';
import AgregarCategoriaModal from '../Categorias/AgregarCategoriaModal';
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { ImagenArticulo } from '../../types/ImagenArticulo';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import { UnidadMedida } from '../../types/UnidadMedida';
import { ArticuloManufacturadoDetalle } from '../../types/ArticuloManufacturadoDetalle';
import { Categoria } from '../../types/Categoria';
import { getImagenesArticulo } from '../../services/ImagenArticuloService';
import { actualizarCategoria, getCategorias } from '../../services/CategoriaService';
import '../../styles/InsumoFormulario.css';
import { actualizarArticuloManufacturado, crearArticuloManufacturado } from '../../services/ArticuloManufacturadoService';
import { getArticulosManufacturadosDetalle } from '../../services/ArticuloManufacturadoDetalleService';
import { getUnidadesMedida } from '../../services/UnidadMedidaService';
import { CameraAlt } from '@mui/icons-material';
import uploadImage from '../../services/CloudinaryService';
import { Delete as DeleteIcon } from '@mui/icons-material';

interface ManufacturadoFormularioProps {
    show: boolean;
    handleClose: () => void;
    onSave: (articulo: ArticuloManufacturado) => void;
    isEdit?: boolean; // Indicador de edición
    articuloManufacturadoInicial?: ArticuloManufacturado; // Artículo a editar
    articulosInsumo: ArticuloInsumo[];
    unidadesMedida: UnidadMedida[];
    imagenesArticulo: ImagenArticulo[];
    detalles: ArticuloManufacturadoDetalle[];
    setDetalles: React.Dispatch<React.SetStateAction<ArticuloManufacturadoDetalle[]>>;
}

const createEmptyArticuloInsumo = (): ArticuloInsumo => ({
    id: 0,
    denominacion: '',
    precioVenta: 0,
    precioCompra: 0,
    stockActual: 0,
    stockMinimo: 0,
    unidadMedida: {
        id: 0,
        denominacion: '',
        eliminado: false
    },
    categoria: {
        id: 0,
        denominacion: '',
        eliminado: false
    },
    esParaElaborar: false,
    eliminado: false,
    imagenesArticulo: new Set<ImagenArticulo>(),
});

const ManufacturadoFormulario: React.FC<ManufacturadoFormularioProps> = ({
    show,
    handleClose,
    onSave,
    isEdit = false,
    articuloManufacturadoInicial,
    articulosInsumo,

}) => {
    const [denominacion, setDenominacion] = useState<string>('');
    const [precioVenta, setPrecioVenta] = useState<number>(0);
    const [unidadMedidaId, setUnidadMedidaId] = useState<number>(0);
    const [descripcion, setDescripcion] = useState<string>('');
    const [tiempoEstimado, setTiempoEstimado] = useState<number>(0);
    const [preparacion, setPreparacion] = useState<string>('');
    const [categoriaId, setCategoriaId] = useState<number>(0);
    const [articuloManufacturadoDetalles, setArticuloManufacturadoDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);
    const [selectedImagen, setSelectedImagen] = useState<ImagenArticulo | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showAgregarCategoriaModal, setShowAgregarCategoriaModal] = useState<boolean>(false);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const filteredArticulosInsumo = articulosInsumo.filter((insumo) => insumo.esParaElaborar);


    useEffect(() => {
        async function cargarDatosIniciales() {
            const imagenes = await getImagenesArticulo();
            setSelectedImagen(imagenes);

            const categorias = await getCategorias();
            setCategorias(categorias);

            const unidadesMedida = await getUnidadesMedida();
            setUnidadesMedida(unidadesMedida);

            const detalles = await getArticulosManufacturadosDetalle();
            setArticuloManufacturadoDetalles(detalles);

            if (isEdit && articuloManufacturadoInicial) {
                setDenominacion(articuloManufacturadoInicial.denominacion);
                setPrecioVenta(articuloManufacturadoInicial.precioVenta);
                setUnidadMedidaId(articuloManufacturadoInicial.unidadMedida.id);
                setDescripcion(articuloManufacturadoInicial.descripcion);
                setTiempoEstimado(articuloManufacturadoInicial.tiempoEstimadoMinutos);
                setPreparacion(articuloManufacturadoInicial.preparacion);
                setCategoriaId(articuloManufacturadoInicial.categoria.id);
                setArticuloManufacturadoDetalles(Array.from(articuloManufacturadoInicial.articuloManufacturadoDetalles));
                setSelectedImagen(Array.from(articuloManufacturadoInicial.imagenesArticulo)[0]);
            } else {
                // Reset form if not editing
                setDenominacion('');
                setPrecioVenta(0);
                setUnidadMedidaId(0);
                setDescripcion('');
                setTiempoEstimado(0);
                setPreparacion('');
                setCategoriaId(0);
                setArticuloManufacturadoDetalles([]);
                setSelectedImagen(null);
            }
        }

        cargarDatosIniciales();
    }, [show, isEdit, articuloManufacturadoInicial]);

    const handleGuardar = async () => {

        if (!selectedImagen) {
            console.error('No se ha seleccionado ninguna imagen');
            return;
        }

        const unidadMedidaSeleccionada = unidadesMedida.find((um) => um.id === unidadMedidaId);
        const categoriaSeleccionada = categorias.find((cat) => cat.id === categoriaId);

        if (!unidadMedidaSeleccionada || !categoriaSeleccionada) {
            console.error('No se encontró la unidad de medida o la categoría seleccionada');
            return;
        }

        const nuevoArticuloManufacturado: ArticuloManufacturado = {
            id: isEdit && articuloManufacturadoInicial ? articuloManufacturadoInicial.id : 0,
            denominacion,
            eliminado: false,
            precioVenta,
            unidadMedida: unidadMedidaSeleccionada,
            categoria: categoriaSeleccionada,
            descripcion,
            tiempoEstimadoMinutos: tiempoEstimado,
            preparacion,
            imagenesArticulo: new Set([selectedImagen]),
            articuloManufacturadoDetalles: new Set(articuloManufacturadoDetalles.map((detalle) => ({
                ...detalle,
                id: detalle.id,
                articuloInsumo: detalle.articuloInsumo,
                eliminado: false,
            }))),
        };

        try {
            const imagenesArticuloArray = Array.from(nuevoArticuloManufacturado.imagenesArticulo);
            const detallesArticuloArray = Array.from(nuevoArticuloManufacturado.articuloManufacturadoDetalles);
            const articuloParaGuardar = {
                ...nuevoArticuloManufacturado,
                imagenesArticulo: imagenesArticuloArray,
                articuloManufacturadoDetalles: detallesArticuloArray
            };

            console.log('JSON enviado al servidor:', JSON.stringify(articuloParaGuardar, null, 2));

            if (isEdit && articuloManufacturadoInicial) {
                console.log('JSON enviado al backend:', JSON.stringify(articuloParaGuardar));
                await actualizarArticuloManufacturado(nuevoArticuloManufacturado.id, articuloParaGuardar); // Actualizar artículo
                alert('El ArticuloManufacturado se actualizó correctamente');
            } else {
                console.log('JSON enviado al backend:', JSON.stringify(articuloParaGuardar));
                const articuloCreado = await crearArticuloManufacturado(articuloParaGuardar); // Crear nuevo artículo
                alert('El ArticuloManufacturado se guardó correctamente');
                onSave(articuloCreado);
            }

            handleClose();
        } catch (error) {
            console.error('Error al guardar el artículo manufacturado:', error);
        }
    };

    const handleActualizarCategoria = async (id: number, datosActualizados: any) => {
        try {
            await actualizarCategoria(id, datosActualizados);
            const nuevasCategorias = await getCategorias();
            setCategorias(nuevasCategorias);  // Actualiza las categorías directamente
        } catch (error) {
            console.error(`Error al actualizar la categoría con ID ${id}:`, error);
            // Aquí puedes manejar el error según tus necesidades
        }
    };

    const agregarDetalle = () => {
        setArticuloManufacturadoDetalles([...articuloManufacturadoDetalles, {
            id: 0,
            cantidad: 0,
            articuloInsumo: createEmptyArticuloInsumo(),
            eliminado: false,
        }]);
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const url = await uploadImage(file); // Llamada a tu función de subida de imagen
            const nuevaImagen = new ImagenArticulo(0, false, url);

            setSelectedImagen(nuevaImagen);
        }
    };

    const toggleAgregarCategoriaModal = () => {
        setShowAgregarCategoriaModal(!showAgregarCategoriaModal);
    };

    const handleArticuloInsumoChange = (index: number, insumo: ArticuloInsumo | null) => {
        setArticuloManufacturadoDetalles((prevState) =>
            prevState.map((prevDetalle, idx) =>
                idx === index
                    ? { ...prevDetalle, articuloInsumo: insumo || createEmptyArticuloInsumo() }
                    : prevDetalle
            )
        );
    };

    const eliminarDetalle = (index: number) => {
        setArticuloManufacturadoDetalles((prevState) =>
            prevState.filter((_, idx) => idx !== index)
        );
    };

    return (
        <>
            <Dialog open={show} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md" style={{ zIndex: 1050 }}>
                <DialogTitle id="form-dialog-title">{isEdit ? 'Modificar Artículo Manufacturado' : 'Agregar Artículo Manufacturado'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>

                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                id="denominacion"
                                label="Denominación"
                                type="text"
                                fullWidth
                                value={denominacion}
                                onChange={(e) => setDenominacion(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                id="precioVenta"
                                label="Precio de Venta"
                                type="number"
                                fullWidth
                                value={precioVenta}
                                onChange={(e) => setPrecioVenta(Number(e.target.value))}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                id="tiempoEstimado"
                                label="Tiempo Estimado (minutos)"
                                type="number"
                                fullWidth
                                value={tiempoEstimado}
                                onChange={(e) => setTiempoEstimado(Number(e.target.value))}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                id="descripcion"
                                label="Descripción"
                                multiline
                                rows={3}
                                fullWidth
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                margin="dense"
                                id="preparacion"
                                label="Preparación"
                                multiline
                                rows={3}
                                fullWidth
                                value={preparacion}
                                onChange={(e) => setPreparacion(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="unidad-medida-label">Unidad de Medida</InputLabel>
                                <Select
                                    labelId="unidad-medida-label"
                                    id="unidadMedida"
                                    value={unidadMedidaId}
                                    onChange={(e) => setUnidadMedidaId(Number(e.target.value))}
                                    label="Unidad de Medida"
                                >
                                    <MenuItem value={0}>Seleccionar unidad de medida...</MenuItem>
                                    {unidadesMedida.map((um) => (
                                        <MenuItem key={um.id} value={um.id}>
                                            {um.denominacion}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="categoria-label">Categoría</InputLabel>
                                <Select
                                    labelId="categoria-label"
                                    id="categoria"
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                                    label="Categoría"
                                >
                                    <MenuItem value={0}>Seleccionar categoría...</MenuItem>
                                    {categorias.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.denominacion}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button className='btn-Guardar' onClick={toggleAgregarCategoriaModal} sx={{ marginTop: 2, marginBottom: 2 }}>
                                    Nueva Categoría
                                </Button>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                {selectedImagen ? (
                                    <div className="selected-image">
                                        <img src={selectedImagen.url} alt="Imagen seleccionada" />
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <CameraAlt fontSize="large" color="disabled" />
                                        <FormLabel sx={{ margin: 2 }}>No hay imagen seleccionada</FormLabel>
                                    </div>
                                )}
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-image"
                                    type="file"
                                    onChange={handleUploadImage}
                                />
                                <label htmlFor="upload-image">
                                    <Button component="span" className="btn-Guardar" sx={{ marginTop: 2, marginBottom: 2 }}>
                                        Nueva Imagen
                                    </Button>
                                </label>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button onClick={agregarDetalle}>Agregar Detalle</Button>
                        </Grid>
                        {articuloManufacturadoDetalles.map((detalle, index) => (
                            <Grid container spacing={2} key={index} alignItems="center">
                                <Grid item xs={3}>
                                    <TextField
                                        margin="dense"
                                        id={`detalle-cantidad-${index}`}
                                        label="Cantidad"
                                        type="number"
                                        fullWidth
                                        value={detalle.cantidad}
                                        onChange={(e) =>
                                            setArticuloManufacturadoDetalles((prevState) =>
                                                prevState.map((prevDetalle, idx) =>
                                                    idx === index
                                                        ? { ...prevDetalle, cantidad: Number(e.target.value) }
                                                        : prevDetalle
                                                )
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item xs={7}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            id={`autocomplete-articuloInsumo-${index}`}
                                            options={filteredArticulosInsumo}
                                            getOptionLabel={(option) => option.denominacion}
                                            value={detalle.articuloInsumo}
                                            onChange={(_event, newValue) => handleArticuloInsumoChange(index, newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Artículo Insumo"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={() => eliminarDetalle(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
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
            <AgregarCategoriaModal
                show={showAgregarCategoriaModal}
                onHide={toggleAgregarCategoriaModal}
                actualizarCategorias={handleActualizarCategoria}
            />
        </>
    );
};

export default ManufacturadoFormulario;
