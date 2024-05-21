import React, { useState } from 'react';
import { Modal, Button, Form, Col, Image } from 'react-bootstrap';
import { ArticuloManufacturadoDetalle } from '../../types/ArticuloManufacturadoDetalle';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import { crearArticuloManufacturadoDetalle, obtenerUltimoId } from '../../services/ArticuloManufacturadoDetalleService';


interface AgregarArticuloDetalleModalProps {
    show: boolean;
    onHide: () => void;
    agregarArticuloDetalle: (detalle: ArticuloManufacturadoDetalle) => void;
    articulosInsumo: ArticuloInsumo[]; // Lista de artículos insumo para seleccionar
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
                // Obtener el último id
                const ultimoId = await obtenerUltimoId();
    
                // Calcular el nuevo id
                const nuevoId = ultimoId + 1;
    
                // Crear el nuevo detalle con el nuevo id
                const nuevoDetalle: ArticuloManufacturadoDetalle = {
                    id: nuevoId,
                    eliminado: false,
                    cantidad: cantidadInput,
                    articuloInsumo: articuloInsumoSeleccionado,
                };
    
                // Agregar el detalle al estado local y al backend
                agregarArticuloDetalle(nuevoDetalle);
                await crearArticuloManufacturadoDetalle(nuevoDetalle);
    
                // Limpiar los inputs y cerrar el modal
                setCantidadInput(0);
                setArticuloInsumoSeleccionado(null);
                onHide();
            } catch (error) {
                console.error('Error al guardar el detalle:', error);
                // Manejar el error aquí
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Agregar Detalle de Artículo Manufacturado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formCantidad">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Ingrese la cantidad"
                            value={cantidadInput}
                            onChange={(e) => setCantidadInput(parseInt(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formArticuloInsumo">
                        <Form.Label>Artículo Insumo</Form.Label>
                        <Form.Control
                            as="select"
                            value={articuloInsumoSeleccionado?.id || ''}
                            onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                const selectedArticulo = articulosInsumo.find(art => art.id === selectedId) || null;
                                setArticuloInsumoSeleccionado(selectedArticulo);
                            }}
                        >
                            <option value="">Seleccione un artículo</option>
                            {articulosInsumo.map(articulo => (
                                <option key={articulo.id} value={articulo.id}>{articulo.denominacion}</option>
                            ))}
                        </Form.Control>
                        {articuloInsumoSeleccionado && (
                            <Col xs={6} md={4}>
                                <Image src={Array.from(articuloInsumoSeleccionado.imagenesArticulo)[0].url} thumbnail />
                            </Col>
                        )}
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
    );
};

export default AgregarArticuloDetalleModal;
