import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
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
import { crearArticuloManufacturadoDetalle } from '../../services/ArticuloManufacturadoDetalleService';

interface AgregarArticuloManufacturadoModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: (articulo: ArticuloManufacturado) => void;
    isEdit?: boolean; // Indicador de edición
    articuloManufacturadoInicial?: ArticuloManufacturado; // Artículo a editar
    articulosInsumo: ArticuloInsumo[];
    unidadesMedida: UnidadMedida[];
    imagenesArticulo: ImagenArticulo[];
}

const AgregarArticuloManufacturadoModal: React.FC<AgregarArticuloManufacturadoModalProps> = ({
    show,
    handleClose,
    onSave,
    isEdit = false,
    articuloManufacturadoInicial,
    articulosInsumo,
    unidadesMedida,
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


    useEffect(() => {
        async function cargarDatosIniciales() {
            const imagenes = await getImagenesArticulo();
            setSelectedImagen(imagenes);

            const categorias = await getCategorias();
            setCategorias(categorias);

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
            <Modal show={show} onHide={handleClose} size="lg" style={{zIndex: 1050}} >
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Modificar Artículo Manufacturado' : 'Agregar Artículo Manufacturado'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formDenominacion">
                            <Form.Label>Denominación</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la denominación"
                                value={denominacion}
                                onChange={(e) => setDenominacion(e.target.value)}
                            />
                        </Form.Group>

                        <Row>
                            <Form.Group as={Col} controlId="formPrecioVenta">
                                <Form.Label>Precio de Venta</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese el precio de venta"
                                    value={precioVenta}
                                    onChange={(e) => setPrecioVenta(Number(e.target.value))}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formUnidadMedida">
                                <Form.Label>Unidad de Medida</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={unidadMedidaId}
                                    onChange={(e) => setUnidadMedidaId(Number(e.target.value))}
                                >
                                    <option value={0}>Seleccionar unidad de medida...</option>
                                    {unidadesMedida.map((um) => (
                                        <option key={um.id} value={um.id}>
                                            {um.denominacion}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Row>

                        <Form.Group controlId="formDescripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Ingrese la descripción"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formTiempoEstimado">
                            <Form.Label>Tiempo Estimado (minutos)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingrese el tiempo estimado en minutos"
                                value={tiempoEstimado}
                                onChange={(e) => setTiempoEstimado(Number(e.target.value))}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPreparacion">
                            <Form.Label>Preparación</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Ingrese los pasos de preparación"
                                value={preparacion}
                                onChange={(e) => setPreparacion(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCategoria">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                as="select"
                                value={categoriaId}
                                onChange={(e) => setCategoriaId(Number(e.target.value))}
                            >
                                <option value={0}>Seleccionar categoría...</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.denominacion}
                                    </option>
                                ))}
                            </Form.Control>
                            <Button className='btn-Guardar' variant="outline-primary" size="sm" onClick={toggleAgregarCategoriaModal}>
                                Nueva Categoría
                            </Button>
                        </Form.Group>

                        <Form.Group controlId="formImagen">
                            <Form.Label>Imagen</Form.Label>
                            {selectedImagen ? (
                                <div className="selected-image">
                                    <img src={selectedImagen.url} alt="Imagen seleccionada" />
                                </div>
                            ) : (
                                <div>No hay imagen seleccionada</div>
                            )}
                            <Button className='btn-Guardar' variant="outline-primary" size="sm" onClick={toggleAgregarImagenModal}>
                                Nueva Imagen
                            </Button>
                        </Form.Group>

                        <Form.Group controlId="formArticuloManufacturadoDetalles">
                            <Form.Label>Detalles del Artículo Manufacturado</Form.Label>
                            {articuloManufacturadoDetalles.map((detalle, index) => (
                                <Row key={index}>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            placeholder="Cantidad"
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
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            as="select"
                                            value={detalle.articuloInsumo?.id}
                                            onChange={(e) =>
                                                setArticuloManufacturadoDetalles((prevState) =>
                                                    prevState.map((prevDetalle, idx) =>
                                                        idx === index
                                                            ? {
                                                                  ...prevDetalle,
                                                                  articuloInsumo: articulosInsumo.find(
                                                                      (ai) => ai.id === Number(e.target.value)
                                                                  ) || prevDetalle.articuloInsumo,
                                                              }
                                                            : prevDetalle
                                                    )
                                                )
                                            }
                                        >
                                            <option value={0}>Seleccionar insumo...</option>
                                            {articulosInsumo.map((ai) => (
                                                <option key={ai.id} value={ai.id}>
                                                    {ai.denominacion}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                </Row>
                            ))}
                            <Button className='btn-Guardar' variant="outline-primary" size="sm" onClick={() => setShowDetalleModal(true)}>
                                Agregar Detalle
                            </Button>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn-Cancelar' variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button className='btn-Guardar' variant="primary" onClick={handleGuardar}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            <AgregarArticuloDetalleModal
                show={showDetalleModal}
                onHide={() => setShowDetalleModal(false)}
                agregarArticuloDetalle={agregarDetalle}
                articulosInsumo={articulosInsumo}
            />

            <div>
                {/* Modal para agregar imagen */}
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
                actualizarCategorias = {handleActualizarCategoria}
            />
        </>
    );
};

export default AgregarArticuloManufacturadoModal;
