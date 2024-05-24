// /components/UnidadesMedida/UnidadMedidaForm.tsx

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { UnidadMedida } from '../../types/UnidadMedida';
import { postData, putData } from '../../services/GenericFetch';

interface Props {
  unidadMedida?: UnidadMedida;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

const UnidadMedidaForm: React.FC<Props> = ({ unidadMedida, onSaveSuccess, onCancel }) => {
  const [denominacion, setDenominacion] = useState(unidadMedida?.denominacion || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: UnidadMedida = {
      id: unidadMedida?.id || 0,
      eliminado: unidadMedida?.eliminado || false,
      denominacion,
    };

    try {
      if (unidadMedida) {
        await putData(`/api/unidadesmedida/${unidadMedida.id}`, data); // Ajusta la ruta según tu API
      } else {
        await postData('/api/unidadesmedida', data); // Ajusta la ruta según tu API
      }
      onSaveSuccess();
    } catch (error) {
      console.error('Error saving unidad de medida:', error);
    }
  };

  return (
    <div>
      <h2>{unidadMedida ? 'Modificar Unidad de Medida' : 'Agregar Unidad de Medida'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDenominacion">
          <Form.Label>Denominación</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la denominación"
            value={denominacion}
            onChange={(e) => setDenominacion(e.target.value)}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            Guardar
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UnidadMedidaForm;
