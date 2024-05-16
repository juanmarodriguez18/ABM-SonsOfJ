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