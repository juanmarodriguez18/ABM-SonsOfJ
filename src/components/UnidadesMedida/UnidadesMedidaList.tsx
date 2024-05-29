import { Button, Row, Col } from 'react-bootstrap';
import { UnidadMedida } from '../../types/UnidadMedida';
import { useFetchData, useFilterData } from '../Shared/Hooks';
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';
import UnidadesMedida from './UnidadMedida';
import UnidadMedidaForm from './UnidadMedidaForm';
import { crearUnidadMedida, actualizarUnidadMedida } from '../../services/UnidadMedidaService';

const UnidadesMedidaList: React.FC = () => {
  const endpoint = "http://localhost:8080/unidad-medida";
  const { data: unidadesMedida, setFilteredData: setUnidadesMedida } = useFetchData<UnidadMedida>(endpoint);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedida | undefined>(undefined);
  const filteredUMedida = useFilterData(unidadesMedida, query, (unidad: UnidadMedida) => unidad.denominacion.toLowerCase().includes(query.toLowerCase()));

  const handleGuardarUnidadMedida = async (unidadMedida: UnidadMedida) => {
    try {
      if (unidadMedida.id) {
        const updatedUnidadMedida = await actualizarUnidadMedida(unidadMedida.id, unidadMedida);
        setUnidadesMedida(unidadesMedida.map(um => (um.id === updatedUnidadMedida.id ? updatedUnidadMedida : um)));
      } else {
        const nuevaUnidadMedida = await crearUnidadMedida(unidadMedida);
        setUnidadesMedida([...unidadesMedida, nuevaUnidadMedida]);
      }
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar la unidad de medida:", error);
    }
  };

  const handleNuevaUnidadMedida = () => {
    setSelectedUnidadMedida(undefined);
    setShowForm(true);
  };

  const handleEditarUnidadMedida = (unidadMedida: UnidadMedida) => {
    setSelectedUnidadMedida(unidadMedida);
    setShowForm(true);
  };

  return (
    <div>
      <SearchBar onSearch={setQuery} />
      <Button className='btn-Guardar' variant="primary" onClick={handleNuevaUnidadMedida}>
        Agregar Unidad Medida
      </Button>
      <Row>
        <Col>
          <b>Denominacion:</b>
        </Col>
      </Row>
      <ul>
        {filteredUMedida.map(unidadMedida => (
          <li key={unidadMedida.id}>
            <UnidadesMedida
              unidadMedida={unidadMedida}
              onEditar={() => handleEditarUnidadMedida(unidadMedida)}
            />
          </li>
        ))}
      </ul>
      {/* Modal para agregar/editar unidad de medida */}
      <UnidadMedidaForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSave={handleGuardarUnidadMedida}
        initialData={selectedUnidadMedida}
      />
    </div>
  );
};

export default UnidadesMedidaList;
