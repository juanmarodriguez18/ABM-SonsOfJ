import React, { useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import AgregarArticuloDetalleModal from './AgregarArticuloDetalleModal'; // Asegúrate de importar el modal
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';
import { ImagenArticulo } from '../types/ImagenArticulo';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import { UnidadMedida } from '../types/UnidadMedida';
import { ArticuloManufacturadoDetalle } from '../types/ArticuloManufacturadoDetalle';

interface AgregarArticuloManufacturadoModalProps {
    show: boolean;
    onHide: () => void;
    agregarArticuloManufacturado: (articulo: ArticuloManufacturado) => void;
    articulosInsumo: ArticuloInsumo[]; // Lista de artículos insumo disponibles
    imagenesArticulo: ImagenArticulo[]; // Lista de imágenes de artículos disponibles
    unidadesMedida: UnidadMedida[]; // Lista de unidades de medida disponibles
}

const AgregarArticuloManufacturadoModal: React.FC<AgregarArticuloManufacturadoModalProps> = ({
    show,
    onHide,
    agregarArticuloManufacturado,
    articulosInsumo,
    imagenesArticulo,
    unidadesMedida,
}) => {
    const [denominacion, setDenominacion] = useState<string>('');
    const [precioVenta, setPrecioVenta] = useState<number>(0);
    const [unidadMedidaId, setUnidadMedidaId] = useState<number>(0);
    const [descripcion, setDescripcion] = useState<string>('');
    const [tiempoEstimado, setTiempoEstimado] = useState<number>(0);
    const [preparacion, setPreparacion] = useState<string>('');
    const [articuloManufacturadoDetalles, setArticuloManufacturadoDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);
    const [showDetalleModal, setShowDetalleModal] = useState<boolean>(false);

    const handleGuardar = () => {
        const unidadMedidaSeleccionada = unidadesMedida.find((um) => um.id === unidadMedidaId);
    
        if (!unidadMedidaSeleccionada) {
            // Manejar el caso donde no se encuentra la unidad de medida
            console.error('No se encontró la unidad de medida');
            return;
        }
    
        const nuevoArticuloManufacturado: ArticuloManufacturado = {
            id: 0,
            denominacion,
            eliminado: false,
            precioVenta,
            unidadMedida: unidadMedidaSeleccionada,
            descripcion,
            tiempoEstimadoMinutos: tiempoEstimado,
            preparacion,
            imagenesArticulo: new Set(),  // Corregido a `new Set()`
            articuloManufacturadoDetalles: new Set(articuloManufacturadoDetalles.map((detalle) => ({
                ...detalle,
                articuloInsumo: detalle.articuloInsumo,
                eliminado: false,
            }))),
        };
    
        // Lógica para agregar el artículo manufacturado
        agregarArticuloManufacturado(nuevoArticuloManufacturado);
    
        // Limpiar los campos y cerrar el modal
        setDenominacion('');
        setPrecioVenta(0);
        setUnidadMedidaId(0);
        setDescripcion('');
        setTiempoEstimado(0);
        setPreparacion('');
        setArticuloManufacturadoDetalles([]);
    
        onHide();
    };

    const agregarDetalle = (detalle: ArticuloManufacturadoDetalle) => {
        setArticuloManufacturadoDetalles([...articuloManufacturadoDetalles, detalle]);
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Artículo Manufacturado</Modal.Title>
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
                                                            ? { ...prevDetalle, articuloInsumoId: Number(e.target.value) }
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
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => setShowDetalleModal(true)}
                            >
                                Agregar Detalle
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleGuardar}>
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
        </>
    );
};

export default AgregarArticuloManufacturadoModal;
