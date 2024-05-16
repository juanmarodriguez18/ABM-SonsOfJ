// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/articulos-manufacturados';

export const getArticulosManufacturados = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching artículos manufacturados:", error);
    throw error;
  }
};

