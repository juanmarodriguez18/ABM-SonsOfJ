// /components/UnidadesMedida/UnidadesMedidaList.tsx

import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { UnidadMedida } from '../../types/UnidadMedida';

interface Props {
  unidadesMedida: UnidadMedida[];
  onEdit: (unidadMedida: UnidadMedida) => void;
  onDelete: (id: number) => void;
}

const UnidadesMedidaList: React.FC<Props> = ({ unidadesMedida, onEdit, onDelete }) => {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {unidadesMedida.map((unidad) => (
        <Col key={unidad.id}>
          <Card>
            <Card.Body>
              <Card.Title>{unidad.denominacion}</Card.Title>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button variant="info" onClick={() => onEdit(unidad)} className="me-2">
                  <i className="bi bi-pencil"></i> Editar
                </Button>
                <Button variant="danger" onClick={() => onDelete(unidad.id)}>
                  <i className="bi bi-trash"></i> Eliminar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default UnidadesMedidaList;
