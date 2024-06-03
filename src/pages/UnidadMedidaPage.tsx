import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { UnidadMedida } from '../types/UnidadMedida';
import SearchBar from '../components/SearchBar/SearchBar';
import UnidadesMedidaTable from '../components/UnidadesMedida/UnidadesMedidaTable';
import UnidadMedidaForm from '../components/UnidadesMedida/UnidadMedidaForm';
import {
  actualizarUnidadMedida,
  crearUnidadMedida,
  eliminarUnidadMedida,
  recuperarUnidadMedida,
} from '../services/UnidadMedidaService';
import axios from 'axios';

const UnidadMedidaPage: React.FC = () => {
  const endpoint = "http://localhost:8080/unidad-medida";
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedida | undefined>(undefined);

  // Función para cargar las unidades de medida
  const fetchUnidadesMedida = async () => {
    try {
      const response = await axios.get(endpoint);
      setUnidadesMedida(response.data);
    } catch (error) {
      console.error("Error fetching unidades de medida:", error);
    }
  };

  // Cargar unidades de medida al cargar la página
  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  // Filtrado de unidades de medida
  const filteredUMedida = unidadesMedida.filter((unidad: UnidadMedida) =>
    unidad.denominacion.toLowerCase().includes(query.toLowerCase())
  );

  // Función para guardar o actualizar una unidad de medida
  const handleGuardarUnidadMedida = async (unidadMedida: UnidadMedida) => {
    try {
      if (unidadMedida.id) {
        // Actualizar unidad de medida existente
        const updatedUnidadMedida = await actualizarUnidadMedida(
          unidadMedida.id,
          unidadMedida
        );
        setUnidadesMedida((prevData) =>
          prevData.map((um) =>
            um.id === updatedUnidadMedida.id ? updatedUnidadMedida : um
          )
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

  // Función para manejar la eliminación o recuperación de una unidad de medida
  const handleEliminarRecuperarUnidadMedida = async (unidadMedida: UnidadMedida) => {
    try {
      if (unidadMedida.eliminado) {
        await recuperarUnidadMedida(unidadMedida.id); // Recuperar unidad de medida
        setUnidadesMedida((prevData) =>
          prevData.map((um) =>
            um.id === unidadMedida.id ? { ...um, eliminado: false } : um
          )
        );
      } else {
        await eliminarUnidadMedida(unidadMedida.id); // Eliminar unidad de medida
        setUnidadesMedida((prevData) =>
          prevData.map((um) =>
            um.id === unidadMedida.id ? { ...um, eliminado: true } : um
          )
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la unidad de medida:", error);
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
