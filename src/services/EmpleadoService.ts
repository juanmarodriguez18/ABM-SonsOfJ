// src/services/EmpleadoService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/empleados';

export const getEmpleados = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching empleados:", error);
    throw error;
  }
};

// Nueva función para obtener el primer empleado
export const obtenerPrimerEmpleado = async () => {
    try {
      const empleados = await getEmpleados();
      return empleados[0]; // Retorna el primer empleado de la lista
    } catch (error) {
      console.error('Error al obtener el primer empleado:', error);
      throw new Error('No se pudo obtener el primer empleado');
    }
  };