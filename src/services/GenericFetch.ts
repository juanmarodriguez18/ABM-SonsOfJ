//src/services/GenericFetch.ts

import axios from "axios";

// Función generica para obtener datos mediante una solicitud GET
export async function getData<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${path}`);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json(); // Retorna los datos en formato JSON
  } catch (error) {
    return Promise.reject(error); // Rechaza la promesa con el error
  }
}

// Función generica para enviar datos mediante una solicitud POST
export async function postData<T>(path: string, data: T): Promise<T> {
  try {
    const response = await fetch(`${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convierte los datos a JSON y los envía en el cuerpo de la solicitud
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json(); // Retorna los datos en formato JSON
  } catch (error) {
    return Promise.reject(error); // Rechaza la promesa con el error
  }
}

// Función generica para actualizar datos mediante una solicitud PUT
export async function putData<T>(path: string, data: T): Promise<T> {
  try {
    const response = await fetch(`${path}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Convierte los datos a JSON y los envía en el cuerpo de la solicitud
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json(); // Retorna los datos en formato JSON
  } catch (error) {
    return Promise.reject(error); // Rechaza la promesa con el error
  }
}

// Función generica para eliminar datos mediante una solicitud DELETE
export async function deleteData(path: string) {
  try {
    const response = await fetch(`${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
  } catch (error) {
    console.error(error); // Imprime el error en la consola
  }
}

export const eliminarEntidad = async (id: number, path: string) => {
  try {
      const response = await axios.patch(`${path}/${id}`, { eliminado: true });
      return response.data;
  } catch (error) {
      console.error(`Error al eliminar lógicamente la entidad en ${path}:`, error);
      throw error;
  }
};

export const recuperarEntidad = async (id: number, path: string) => {
  try {
      const response = await axios.patch(`${path}/${id}`, { eliminado: false });
      return response.data;
  } catch (error) {
      console.error(`Error al recuperar la entidad en ${path}:`, error);
      throw error;
  }
};