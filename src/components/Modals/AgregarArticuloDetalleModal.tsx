import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Image } from 'react-bootstrap';
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
        <div>
            {suggestion.denominacion}
        </div>
    );

    const onSuggestionSelected = (event: React.FormEvent<any>, { suggestion }: { suggestion: ArticuloInsumo }) => {
        setArticuloInsumoSeleccionado(suggestion);
    };

    const inputProps = {
        placeholder: "Buscar artículo insumo",
        value: valorInput,
        onChange: (e: React.ChangeEvent<any>, { newValue }: { newValue: string }) => {
            setValorInput(newValue);
        },
        onKeyPress: (e: React.KeyboardEvent<any>) => {
            if (e.key === 'Enter' && sugerencias.length > 0) {
                setArticuloInsumoSeleccionado(sugerencias[0]);
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
                            <Col className='col' xs={6} md={4}>
                                <Image className='img' src={Array.from(articuloInsumoSeleccionado.imagenesArticulo)[0].url} thumbnail />
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

