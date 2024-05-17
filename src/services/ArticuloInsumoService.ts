// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/insumos';

export const getInsumos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching insumos:", error);
    throw error;
  }
};

export const getInsumoById = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artículo manufacturado con ID ${id}:`, error);
      throw error;
    }
  };
  
  export const crearInsumo = async (nuevoInsumo: any) => {
    try {
      const response = await axios.post(API_URL, nuevoInsumo);
      return response.data;
    } catch (error) {
      console.error("Error al crear un insumo:", error);
      throw error;
    }
  };
  
  export const eliminarInsumo = async (id: number) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { eliminado: true });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar lógicamente un artículo manufacturado:", error);
      throw error;
    }
  };
  
  export const actualizarInsumo = async (id: number, datosActualizados: any) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, datosActualizados);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar un artículo manufacturado:", error);
      throw error;
    }
  };

  