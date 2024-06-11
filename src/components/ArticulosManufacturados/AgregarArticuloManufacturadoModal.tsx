import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, MenuItem, DialogTitle, DialogContent, FormControl, InputLabel, Select, DialogActions, Dialog, FormLabel, Autocomplete } from '@mui/material';
import AgregarArticuloDetalleModal from '../ArticuloManufacturadoDetalles/AgregarArticuloDetalleModal';
import AgregarImagenModal from '../ImagenesArticulo/AgregarImagenModal';
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
import { crearArticuloManufacturadoDetalle, getArticulosManufacturadosDetalle } from '../../services/ArticuloManufacturadoDetalleService';
import { getUnidadesMedida } from '../../services/UnidadMedidaService';
import { CameraAlt } from '@mui/icons-material';

interface AgregarArticuloManufacturadoModalProps {
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

const AgregarArticuloManufacturadoModal: React.FC<AgregarArticuloManufacturadoModalProps> = ({
    show,
    handleClose,
    onSave,
    isEdit = false,
    articuloManufacturadoInicial,
    articulosInsumo,
    imagenesArticulo,
    
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
    const [showDetalleModal, setShowDetalleModal] = useState<boolean>(false);
    const [showAgregarImagenModal, setShowAgregarImagenModal] = useState<boolean>(false);
    const [showAgregarCategoriaModal, setShowAgregarCategoriaModal] = useState<boolean>(false);
    const [, setImagenesArticulos] = useState<ImagenArticulo[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);


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
                await actualizarArticuloManufacturado(nuevoArticuloManufacturado.id, articuloParaGuardar); // Actualizar artículo
                alert('El ArticuloManufacturado se actualizó correctamente');
            } else {
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

    const agregarDetalle = async (detalle: ArticuloManufacturadoDetalle) => {
        try {
            // Llamada al backend para guardar el detalle usando tu servicio
            const response = await crearArticuloManufacturadoDetalle(detalle);

            // Manejar la respuesta como sea necesario (actualización de estado, etc.)
            console.log('Detalle agregado correctamente:', response);

            // Ejemplo: Actualizar el estado de detalles si es necesario
            setArticuloManufacturadoDetalles([...articuloManufacturadoDetalles, response]);
        } catch (error) {
            console.error('Error al agregar detalle:', error);
            // Manejar el error apropiadamente
        }
    };

    const handleImagenSeleccionada = (imagen: ImagenArticulo) => {
        setSelectedImagen(imagen);
    };

    const handleSetImagenes = (nuevasImagenes: ImagenArticulo[]) => {
        setImagenesArticulos(nuevasImagenes);
    };

    const toggleAgregarImagenModal = () => {
        setShowAgregarImagenModal(!showAgregarImagenModal);
    };

    const toggleAgregarCategoriaModal = () => {
        setShowAgregarCategoriaModal(!showAgregarCategoriaModal);
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
                                        <FormLabel sx={{ margin: 2}}>No hay imagen seleccionada</FormLabel>
                                    </div>
                                )}
                                <Button className="btn-Guardar" onClick={toggleAgregarImagenModal} sx={{ marginTop: 2, marginBottom: 2 }}>
                                    Nueva Imagen
                                </Button>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                <FormLabel id="detalles-label">Detalles del Artículo Manufacturado</FormLabel>
                                {articuloManufacturadoDetalles.map((detalle, index) => (
                                    <Grid container spacing={2} key={index}>
                                        <Grid item xs={6}>
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
                                        <Grid item xs={6}>
                                        <FormControl fullWidth margin="dense">
                                            <Autocomplete
                                                id={`detalle-insumo-${index}`}
                                                options={articulosInsumo}
                                                getOptionLabel={(option) => option.denominacion}
                                                value={detalle.articuloInsumo || null}
                                                onChange={(_event, newValue) =>
                                                    setArticuloManufacturadoDetalles((prevState) =>
                                                        prevState.map((prevDetalle, idx) =>
                                                            idx === index
                                                                ? {
                                                                    ...prevDetalle,
                                                                    articuloInsumo: newValue || prevDetalle.articuloInsumo,
                                                                }
                                                                : prevDetalle
                                                        )
                                                    )
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Insumo"
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>

                                    </Grid>
                                ))}
                                <Button className="btn-Guardar" onClick={() => setShowDetalleModal(true)}>
                                    Agregar Detalle
                                </Button>
                            </FormControl>
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

            <AgregarArticuloDetalleModal
                show={showDetalleModal}
                onHide={() => setShowDetalleModal(false)}
                agregarArticuloDetalle={agregarDetalle}
                articulosInsumo={articulosInsumo}
            />

            <div>
                {showAgregarImagenModal && (
                    <AgregarImagenModal
                        show={showAgregarImagenModal}
                        onSave={handleImagenSeleccionada}
                        toggleModal={toggleAgregarImagenModal}
                        imagenes={imagenesArticulo}
                        setImagenes={handleSetImagenes}
                    />
                )}
            </div>

            <AgregarCategoriaModal
                show={showAgregarCategoriaModal}
                onHide={toggleAgregarCategoriaModal}
                actualizarCategorias={handleActualizarCategoria}
            />
        </>
    );
};

export default AgregarArticuloManufacturadoModal;
