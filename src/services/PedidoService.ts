import { Pedido } from "../types/Pedido";

const urlPedidos = 'http://localhost:8080/pedidos';

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
