import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface AgregarUnidadMedidaModalProps {
    show: boolean;
    onHide: () => void;
    agregarUnidadMedida: (denominacion: string) => void; // Definir correctamente el tipo de la función
}

const AgregarUnidadMedidaModal: React.FC<AgregarUnidadMedidaModalProps> = ({ show, onHide, agregarUnidadMedida }) => {
    const [denominacionInput, setDenominacionInput] = useState<string>('');

    const handleClose = () => {
        onHide();
    };

    const handleGuardar = () => {
        agregarUnidadMedida(denominacionInput); // Llamar a la función agregarUnidadMedida con el valor correcto
        setDenominacionInput('');
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Unidad de Medida</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formDenominacion">
                        <Form.Label>Denominación</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese la denominación"
                            value={denominacionInput}
                            onChange={(e) => setDenominacionInput(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleGuardar}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AgregarUnidadMedidaModal;
