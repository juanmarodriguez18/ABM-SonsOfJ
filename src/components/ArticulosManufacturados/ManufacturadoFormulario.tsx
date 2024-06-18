import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, DialogTitle, DialogContent, FormControl, DialogActions, Dialog, FormLabel, Autocomplete, IconButton, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AgregarCategoriaModal from '../Categorias/AgregarCategoriaModal';
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { ImagenArticulo } from '../../types/ImagenArticulo';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import { UnidadMedida } from '../../types/UnidadMedida';
import { ArticuloManufacturadoDetalle } from '../../types/ArticuloManufacturadoDetalle';
import { Categoria } from '../../types/Categoria';
import { actualizarCategoria, getCategorias } from '../../services/CategoriaService';
import '../../styles/InsumoFormulario.css';
import { actualizarArticuloManufacturado, crearArticuloManufacturado } from '../../services/ArticuloManufacturadoService';
import { crearUnidadMedida, getUnidadesMedida } from '../../services/UnidadMedidaService';
import { CameraAlt } from '@mui/icons-material';
import uploadImage from '../../services/CloudinaryService';
import { Delete as DeleteIcon } from '@mui/icons-material';
import AgregarUnidadMedidaModal from '../UnidadesMedida/AgregarUnidadMedidaModal';

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
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showAgregarCategoriaModal, setShowAgregarCategoriaModal] = useState<boolean>(false);
    const [showAgregarUM, setShowAgregarUM] = useState<boolean>(false);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [manufacturado, setManufacturado] = useState<ArticuloManufacturado>(new ArticuloManufacturado(0, false, '', 0, new Set<ImagenArticulo>(),
        new UnidadMedida(), new Categoria(), '', 0, '', new Set<ArticuloManufacturadoDetalle>()));
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const filteredArticulosInsumo = articulosInsumo.filter((insumo) => insumo.esParaElaborar && insumo.eliminado === false);
    const filteredUnidadesMedida = unidadesMedida.filter((um) => um.eliminado === false);
    const filteredCategorias = categorias.filter((cat) => cat.eliminado === false);

    useEffect(() => {
        if (isEdit && articuloManufacturadoInicial) {
            setManufacturado(articuloManufacturadoInicial);
        } else {
            setManufacturado(new ArticuloManufacturado(0, false, '', 0, new Set<ImagenArticulo>(), new UnidadMedida(), new Categoria(), '', 0, '', new Set<ArticuloManufacturadoDetalle>()));
        }
    }, [show, isEdit, articuloManufacturadoInicial]);

    useEffect(() => {
        async function cargarDatosIniciales() {
            try {
                const categorias = await getCategorias();
                setCategorias(categorias);

                const unidadesMedida = await getUnidadesMedida();
                setUnidadesMedida(unidadesMedida);

                if (isEdit && articuloManufacturadoInicial) {
                    const detallesManufacturado = Array.from(articuloManufacturadoInicial.articuloManufacturadoDetalles).map(detalle => ({
                        ...detalle,
                        articuloInsumo: { ...detalle.articuloInsumo },
                    }));
                    setManufacturado({ ...articuloManufacturadoInicial, articuloManufacturadoDetalles: new Set(detallesManufacturado) });
                }

                // Si estamos editando y hay un insumo inicial, configurar las imágenes del insumo
                if (isEdit && articuloManufacturadoInicial) {
                    // Convertir el Set de imagenesArticulo a un array de ImagenArticulo
                    const imagenesManufacturado = Array.from(articuloManufacturadoInicial.imagenesArticulo).map(imagen => new ImagenArticulo(imagen.id, imagen.eliminado, imagen.url));
                    setManufacturado({ ...articuloManufacturadoInicial, imagenesArticulo: new Set(imagenesManufacturado) });
                }
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                setTxtValidacion("Error al cargar datos iniciales. Por favor, inténtelo de nuevo más tarde.");
            }
        }
        cargarDatosIniciales();
    }, [show, isEdit, articuloManufacturadoInicial]);

    const handleGuardar = async () => {
        // Validación de campos
        if (!manufacturado.denominacion || manufacturado.denominacion.trim() === "") {
            setTxtValidacion("Ingrese la denominación del producto");
            return;
        }
        if (!manufacturado.precioVenta || manufacturado.precioVenta <= 0) {
            setTxtValidacion("Ingrese un precio válido");
            return;
        }
        if (!manufacturado.tiempoEstimadoMinutos || manufacturado.tiempoEstimadoMinutos <= 0) {
            setTxtValidacion("Ingrese un tiempo estimado válido");
            return;
        }
        if (!manufacturado.descripcion || manufacturado.descripcion.trim() === "") {
            setTxtValidacion("Ingrese la descripción del producto");
            return;
        }
        if (!manufacturado.preparacion || manufacturado.preparacion.trim() === "") {
            setTxtValidacion("Ingrese la preparación del producto");
            return;
        }
        if (!manufacturado.unidadMedida || !manufacturado.unidadMedida.id) {
            setTxtValidacion("Seleccione una unidad de medida");
            return;
        }
        if (!manufacturado.categoria || !manufacturado.categoria.id) {
            setTxtValidacion("Seleccione una categoría");
            return;
        }
        if (manufacturado.imagenesArticulo.size === 0) {
            setTxtValidacion("Ingrese al menos una imagen para el producto");
            return;
        }
        if (manufacturado.articuloManufacturadoDetalles.size === 0) {
            setTxtValidacion("Ingrese al menos un detalle para el producto");
            return;
        }

        try {
            const imagenesArticuloArray = Array.from(manufacturado.imagenesArticulo);
            const detallesArticuloArray = Array.from(manufacturado.articuloManufacturadoDetalles);
            const articuloParaGuardar = {
                ...manufacturado,
                imagenesArticulo: imagenesArticuloArray,
                articuloManufacturadoDetalles: detallesArticuloArray
            };

            if (isEdit && manufacturado.id) {
                console.log('JSON enviado al backend:', JSON.stringify(articuloParaGuardar));
                await actualizarArticuloManufacturado(manufacturado.id, articuloParaGuardar); // Actualizar artículo
                alert('El ArticuloManufacturado se actualizó correctamente');
                onSave({
                    ...articuloParaGuardar,
                    imagenesArticulo: new Set(imagenesArticuloArray),
                    articuloManufacturadoDetalles: new Set(detallesArticuloArray)
                });
            } else {
                console.log('JSON enviado al backend:', JSON.stringify(articuloParaGuardar));
                const articuloCreado = await crearArticuloManufacturado(articuloParaGuardar); // Crear nuevo artículo
                alert('El ArticuloManufacturado se guardó correctamente');
                onSave(articuloCreado);
            }

            handleClose();
        } catch (error) {
            console.error('Error al guardar el artículo manufacturado:', error);
            setTxtValidacion("Error al guardar el Articulo. Por favor, inténtelo de nuevo más tarde.");
        }
    };

    const handleNuevaUnidadMedida = async (denominacion: string) => {
        try {
            const nuevaUnidadMedida = await crearUnidadMedida({ denominacion });
            setUnidadesMedida([...unidadesMedida, nuevaUnidadMedida]);
            setManufacturado({ ...manufacturado, unidadMedida: nuevaUnidadMedida });
            setShowAgregarUM(false);
        } catch (error) {
            console.error("Error al crear una nueva unidad de medida:", error);
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
        setManufacturado((prevManufacturado) => {
            const nuevoDetalle = {
                id: 0,
                cantidad: 0,
                articuloInsumo: createEmptyArticuloInsumo(),
                eliminado: false,
            };

            // Crear una copia del conjunto actual y agregar el nuevo detalle
            const nuevosDetalles = new Set(prevManufacturado.articuloManufacturadoDetalles);
            nuevosDetalles.add(nuevoDetalle);

            return {
                ...prevManufacturado,
                articuloManufacturadoDetalles: nuevosDetalles,
            };
        });
    };


    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const url = await uploadImage(file); // Llamada a tu función de subida de imagen
            const nuevaImagen = new ImagenArticulo(0, false, url);

            setManufacturado({
                ...manufacturado,
                imagenesArticulo: new Set<ImagenArticulo>([nuevaImagen])
            });
        }
    };

    const toggleAgregarUMModal = () => {
        setShowAgregarUM(!showAgregarUM);
    };

    const toggleAgregarCategoriaModal = () => {
        setShowAgregarCategoriaModal(!showAgregarCategoriaModal);
    };

    const handleArticuloInsumoChange = (index: number, insumo: ArticuloInsumo | null) => {
        setManufacturado((prevManufacturado) => {
            // Convertir el conjunto a un array para poder utilizar map
            const detallesArray = Array.from(prevManufacturado.articuloManufacturadoDetalles);
            detallesArray[index] = {
                ...detallesArray[index],
                articuloInsumo: insumo || createEmptyArticuloInsumo(),
            };

            return {
                ...prevManufacturado,
                articuloManufacturadoDetalles: new Set(detallesArray),
            };
        });
    };



    const eliminarDetalle = (index: number) => {
        setManufacturado((prevManufacturado) => {
            // Convertir el conjunto a un array para poder eliminar el detalle
            const detallesArray = Array.from(prevManufacturado.articuloManufacturadoDetalles);
            detallesArray.splice(index, 1);

            return {
                ...prevManufacturado,
                articuloManufacturadoDetalles: new Set(detallesArray),
            };
        });
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
                                value={manufacturado.denominacion}
                                onChange={(e) => setManufacturado({ ...manufacturado, denominacion: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                id="precioVenta"
                                label="Precio de Venta"
                                type="number"
                                fullWidth
                                value={manufacturado.precioVenta}
                                onChange={(e) => setManufacturado({ ...manufacturado, precioVenta: Number(e.target.value) })}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                margin="dense"
                                id="tiempoEstimado"
                                label="Tiempo Estimado (minutos)"
                                type="number"
                                fullWidth
                                value={manufacturado.tiempoEstimadoMinutos}
                                onChange={(e) => setManufacturado({ ...manufacturado, tiempoEstimadoMinutos: Number(e.target.value) })}
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
                                value={manufacturado.descripcion}
                                onChange={(e) => setManufacturado({ ...manufacturado, descripcion: e.target.value })}
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
                                value={manufacturado.preparacion}
                                onChange={(e) => setManufacturado({ ...manufacturado, preparacion: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="cmbUnidadMedida-label">Unidad de Medida</InputLabel>
                                <Select
                                    labelId="cmbUnidadMedida-label"
                                    id="cmbUnidadMedida"
                                    label="Unidad de Medida"
                                    value={manufacturado.unidadMedida.id || ''}
                                    onChange={e => setManufacturado({ ...manufacturado, unidadMedida: { id: parseInt(e.target.value as string), denominacion: "", eliminado: false } })}
                                >
                                    <MenuItem value="">Seleccione una unidad de medida</MenuItem>
                                    {filteredUnidadesMedida.map(unidad => (
                                        <MenuItem key={unidad.id} value={unidad.id}>{unidad.denominacion}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button className="btn-Guardar" onClick={toggleAgregarUMModal} sx={{ marginTop: 2, marginBottom: 2 }}>Nueva U. Medida</Button>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="cmbCategoria-label">Categoría</InputLabel>
                                <Select
                                    labelId="cmbCategoria-label"
                                    id="cmbCategoria"
                                    label="Categoría"
                                    value={manufacturado.categoria?.id || ''}
                                    onChange={e => setManufacturado({
                                        ...manufacturado,
                                        categoria: {
                                            id: parseInt(e.target.value as string),
                                            denominacion: categorias.find(c => c.id === parseInt(e.target.value as string))?.denominacion || '',
                                            eliminado: false
                                        }
                                    })}
                                >
                                    <MenuItem value="">Seleccione una categoría</MenuItem>
                                    {Array.isArray(categorias) && categorias.length > 0 ? (
                                        filteredCategorias.map(categoria => (
                                            <MenuItem key={categoria.id} value={categoria.id}>{categoria.denominacion}</MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Cargando categorías...</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <Button className="btn-Guardar" onClick={toggleAgregarCategoriaModal} sx={{ marginTop: 2, marginBottom: 2 }}>Nueva Categoria</Button>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                {manufacturado.imagenesArticulo.size > 0 ? (
                                    <div className="selected-image">
                                        {/* Obtener la última imagen */}
                                        <img className="img" src={Array.from(manufacturado.imagenesArticulo)[manufacturado.imagenesArticulo.size - 1].url} alt="Imagen seleccionada" />
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
                            <Button onClick={agregarDetalle} variant="contained" color="primary" startIcon={<AddIcon />} sx={{ marginBottom: 2 }}>
                                Agregar Detalle
                            </Button>
                        </Grid>
                        {Array.from(manufacturado.articuloManufacturadoDetalles).map((detalle, index) => (
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
                                            setManufacturado((prevManufacturado) => {
                                                const detallesArray = Array.from(prevManufacturado.articuloManufacturadoDetalles);
                                                detallesArray[index] = {
                                                    ...detalle,
                                                    cantidad: Number(e.target.value),
                                                };
                                                return {
                                                    ...prevManufacturado,
                                                    articuloManufacturadoDetalles: new Set(detallesArray),
                                                };
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={7}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            id={`autocomplete-articuloInsumo-${index}`}
                                            options={filteredArticulosInsumo}
                                            getOptionLabel={(option) => option.denominacion || ""}
                                            value={detalle.articuloInsumo.id !== 0 ? detalle.articuloInsumo : null}
                                            onChange={(_event, newValue) =>
                                                handleArticuloInsumoChange(index, newValue)
                                            }
                                            isOptionEqualToValue={(option, value) =>
                                                value && value.id ? option.id === value.id : option.denominacion === value.denominacion
                                            }
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
                        <Grid item xs={12}>
                            <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
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
            <AgregarUnidadMedidaModal
                show={showAgregarUM}
                onHide={() => setShowAgregarUM(false)}
                agregarUnidadMedida={handleNuevaUnidadMedida}
            />
            <AgregarCategoriaModal
                show={showAgregarCategoriaModal}
                onHide={toggleAgregarCategoriaModal}
                actualizarCategorias={handleActualizarCategoria}
            />
        </>
    );
};

export default ManufacturadoFormulario;
