import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { UnidadMedida } from '../../types/UnidadMedida';

interface UnidadMedidaFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (unidadMedida: UnidadMedida) => void;
  initialData?: UnidadMedida;
}

const UnidadMedidaForm: React.FC<UnidadMedidaFormProps> = ({ show, onHide, onSave, initialData }) => {
  const [denominacion, setDenominacion] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setDenominacion(initialData.denominacion);
    } else {
      setDenominacion('');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!denominacion.trim()) {
      setError('La denominación no puede estar vacía');
      return;
    }

    const unidadMedida: UnidadMedida = {
      ...initialData,
      denominacion,
    } as UnidadMedida;
    onSave(unidadMedida);
  };

 const handleClose = () => {
    setDenominacion('');
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Editar Unidad de Medida' : 'Agregar Unidad de Medida'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Denominacion</Form.Label>
            <Form.Control
              type="text"
              value={denominacion}
              onChange={(e) => {
                setDenominacion(e.target.value);
                setError('');
              }}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-Cancelar" variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button className="btn-Guardar" variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UnidadMedidaForm;
