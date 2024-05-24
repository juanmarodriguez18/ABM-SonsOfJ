// /pages/UnidadMedida.tsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import UnidadesMedidaList from '../UnidadesMedida/UnidadesMedidaList';
import UnidadMedidaForm from '../UnidadesMedida/UnidadMedidaForm';
import { UnidadMedida } from '../../types/UnidadMedida';
import { getData, deleteData } from '../../services/GenericFetch';

const UnidadesMedida: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedida | undefined>(undefined);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  const fetchUnidadesMedida = async () => {
    try {
      const data = await getData<UnidadMedida[]>('/api/unidadesmedida'); // Ajusta la ruta según tu API
      setUnidadesMedida(data);
    } catch (error) {
      console.error('Error fetching unidades de medida:', error);
    }
  };

  const handleAdd = () => {
    setSelectedUnidadMedida(undefined);
    setEditMode(true);
  };

  const handleEdit = (unidadMedida: UnidadMedida) => {
    setSelectedUnidadMedida(unidadMedida);
    setEditMode(true);
  };

  const handleSaveSuccess = () => {
    setEditMode(false);
    fetchUnidadesMedida();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta unidad de medida?')) {
      try {
        await deleteData(`/api/unidadesmedida/${id}`); // Ajusta la ruta según tu API
        fetchUnidadesMedida();
      } catch (error) {
        console.error('Error deleting unidad de medida:', error);
      }
    }
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col md={editMode ? 6 : 12}>
          {!editMode && (
            <div>
              <Button variant="success" onClick={handleAdd}>
                Agregar Unidad de Medida
              </Button>
              <UnidadesMedidaList unidadesMedida={unidadesMedida} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          )}
          {editMode && (
            <UnidadMedidaForm unidadMedida={selectedUnidadMedida} onSaveSuccess={handleSaveSuccess} onCancel={() => setEditMode(false)} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UnidadesMedida;
