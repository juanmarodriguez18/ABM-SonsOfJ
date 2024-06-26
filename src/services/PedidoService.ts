import axios, { AxiosResponse } from "axios";
import { Pedido } from "../types/Pedido";
import { Factura } from "../types/Factura";

const urlPedidos = import.meta.env.VITE_API_URL + '/pedidos';

// Función para guardar un pedido en la base de datos
export async function guardarPedidoEnBD(pedido: Pedido): Promise<void> {
    try {
        const response = await fetch(urlPedidos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(pedido) // Enviar el objeto Pedido convertido a JSON
        });
        if (!response.ok) {
            throw new Error('Error al guardar el pedido');
        }
    } catch (error) {
        console.error('Error en guardarPedidoEnBD:', error);
        throw new Error('Error al guardar el pedido. Por favor, inténtalo de nuevo más tarde.');
    }
}

// Función para obtener todos los pedidos desde la base de datos
export async function getAllPedidos(): Promise<Pedido[]> {
    try {
        const response = await fetch(urlPedidos, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }
        const data: Pedido[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getAllPedidos:', error);
        throw new Error('Error al obtener los pedidos. Por favor, inténtalo de nuevo más tarde.');
    }
}

// Función para obtener un pedido por su ID
export async function getPedidoById(id: number): Promise<Pedido | null> {
    try {
        const response = await fetch(`${urlPedidos}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        if (!response.ok) {
            throw new Error('Pedido no encontrado');
        }
        const pedido: Pedido = await response.json();
        return pedido;
    } catch (error) {
        console.error(`Error al obtener el pedido con ID ${id}:`, error);
        return null;
    }
}

export const actualizarPedido = async (id: number, datosActualizados: any) => {
    try {
      const response = await axios.put(`${urlPedidos}/${id}`, datosActualizados);
      return response.data;
    } catch (error: any) {
      console.error("Error al actualizar un pedido:", error);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        console.log("Error response data:", error.response.data); // Registro adicional
        const errorMessage = error.response.data.error; // Acceder a .error en lugar de .message
        throw new Error(errorMessage);
      } else {
        throw new Error("Error desconocido al actualizar el pedido");
      }
    }
  };

export const facturarPedido = async (pedido: Pedido, email: string) => {
    try {
        const factura: Factura = new Factura(
            0, false, new Date(), pedido.formaPago, pedido.total, pedido
        );

        const response = await fetch(`http://localhost:8080/facturacion/emitir?emailCliente=${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(factura)
        });

        return response.json;
    } catch(error) {
        console.log(error);
    }
}

export const getPedidosBySucursal = async (sucursalId: number): Promise<Pedido[]> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sucursales/${sucursalId}/pedidos`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pedidos para sucursal con ID ${sucursalId}:`, error);
      throw error;
    }
};

// Función para obtener pedidos por rango de fechas
export async function getPedidosByFecha(fechaInicio: string, fechaFin: string): Promise<Pedido[]> {
    try {
        const response: AxiosResponse<any, any> = await axios.get(`${urlPedidos}/filtrar`, {
            params: {
                fechaInicio,
                fechaFin
            },
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        if (response.status !== 200) {
            throw new Error('Error al obtener los pedidos por fecha');
        }
        return response.data;
    } catch (error) {
        console.error('Error en getPedidosByFecha:', error);
        throw new Error('Error al obtener los pedidos por fecha. Por favor, inténtalo de nuevo más tarde.');
    }
}

export const descargarFactura = async (pedido: Pedido) => {
    const response = await fetch(`http://localhost:8080/facturacion/factura/${pedido.id}`);
    if(response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "factura.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return blob;
    } else {
        console.error("Error al descargar el archivo: ", response.statusText);
    }
};
