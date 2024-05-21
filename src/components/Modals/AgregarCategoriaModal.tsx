import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { crearCategoria } from '../../services/CategoriaService';
import '../../styles/InsumoFormulario.css';

interface ModalFormularioCategoriaProps {
    show: boolean;
    onHide: () => void;
    actualizarCategorias: (id: number, datosActualizados: any) => Promise<void>; // Corregir la firma de la función
}

const ModalFormularioCategoria: React.FC<ModalFormularioCategoriaProps> = ({ show, onHide, actualizarCategorias }) => {
    const [denominacion, setDenominacion] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const nuevaCategoria = await crearCategoria({ denominacion });
            actualizarCategorias(nuevaCategoria.id, nuevaCategoria); // Actualizamos la lista de categorías después de agregar una nueva
            onHide(); // Cerramos el modal
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDenominacion">
                        <Form.Label>Denominación</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese la denominación de la categoría"
                            value={denominacion}
                            onChange={(e) => setDenominacion(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button className="btn-Guardar" variant="primary" type="submit">
                        Guardar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalFormularioCategoria;
