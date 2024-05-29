import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useFetchData } from '../components/Shared/Hooks';
import { UnidadMedida } from '../types/UnidadMedida';
import SearchBar from '../components/SearchBar/SearchBar';
import UnidadesMedidaTable from '../components/UnidadesMedida/UnidadesMedidaTable';
import UnidadMedidaForm from '../components/UnidadesMedida/UnidadMedidaForm';
import { actualizarUnidadMedida, crearUnidadMedida } from '../services/UnidadMedidaService';
import { handleEliminarRecuperar } from '../components/Shared/Functions';

const UnidadMedidaPage: React.FC = () => {
  const endpoint = "http://localhost:8080/unidad-medida";
  const { data: unidadesMedida, setFilteredData: setUnidadesMedida } = useFetchData<UnidadMedida>(endpoint);
  const [query, setQuery] = React.useState('');
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = React.useState<UnidadMedida | undefined>(undefined);

  // Filtrado de unidades de medida
  const filteredUMedida = unidadesMedida.filter((unidad: UnidadMedida) =>
    unidad.denominacion.toLowerCase().includes(query.toLowerCase())
  );

  // Función para guardar o actualizar una unidad de medida
  const handleGuardarUnidadMedida = async (unidadMedida: UnidadMedida) => {
    try {
      if (unidadMedida.id) {
        // Actualizar unidad de medida existente
        const updatedUnidadMedida = await actualizarUnidadMedida(unidadMedida.id, unidadMedida);
        setUnidadesMedida((prevData) =>
          prevData.map((um) => (um.id === updatedUnidadMedida.id ? updatedUnidadMedida : um))
        );
      } else {
        // Crear nueva unidad de medida
        const nuevaUnidadMedida = await crearUnidadMedida(unidadMedida);
        setUnidadesMedida([...unidadesMedida, nuevaUnidadMedida]);
      }
      setShowForm(false); // Ocultar el formulario después de guardar
    } catch (error) {
      console.error("Error al guardar la unidad de medida:", error);
    }
  };

  // Función para mostrar el formulario de nueva unidad de medida
  const handleNuevaUnidadMedida = () => {
    setSelectedUnidadMedida(undefined);
    setShowForm(true);
  };

  // Función para editar una unidad de medida
  const handleEditarUnidadMedida = (unidadMedida: UnidadMedida) => {
    setSelectedUnidadMedida(unidadMedida);
    setShowForm(true);
  };

  // Función para eliminar o recuperar una unidad de medida
  const handleEliminarRecuperarUnidadMedida = async (unidadMedida: UnidadMedida) => {
    await handleEliminarRecuperar<UnidadMedida>(unidadMedida, setUnidadesMedida, endpoint);
  };

  // Función para manejar la búsqueda en la barra de búsqueda
  const handleSearch = (value: string) => {
    setQuery(value);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Button className='btn-Guardar' variant="primary" onClick={handleNuevaUnidadMedida}>
        Agregar Unidad Medida
      </Button>
      <UnidadesMedidaTable
        data={filteredUMedida}
        onEdit={handleEditarUnidadMedida}
        onDelete={handleEliminarRecuperarUnidadMedida}
      />
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

export default UnidadMedidaPage;
