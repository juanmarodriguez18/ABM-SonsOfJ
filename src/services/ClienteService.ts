// src/services/ClienteService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/clientes';

export const getClientes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching clientes:", error);
    throw error;
  }
};