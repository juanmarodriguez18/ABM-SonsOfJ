// src/services/SucursalService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/sucursales';

export const getSucursales = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching sucursales:", error);
    throw error;
  }
};