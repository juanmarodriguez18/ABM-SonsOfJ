import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pedido } from '../../types/Pedido';
import { getAllPedidos, getPedidosBySucursal } from '../../services/PedidoService'; // Ajusta la importación según sea necesario

interface PedidosContextType {
  pedidos: Pedido[];
  pedidosPorSucursal: Pedido[];
  actualizarPedidos: () => void; // Función para actualizar y notificar a los consumidores
  pedidosBySucursal: (sucursalId: number) => Promise<Pedido[]>; // Función para obtener pedidos por sucursal
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error('usePedidos debe ser usado en PedidosProvider');
  }
  return context;
};

export const PedidosProvider = ({ children }: { children: ReactNode }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosPorSucursal, setPedidosPorSucursal] = useState<Pedido[]>([]);

  useEffect(() => {
    actualizarPedidos();
  }, []); // Llamar a actualizarPedidos al montar el componente

  // Función para actualizar todos los pedidos y notificar a los consumidores
  const actualizarPedidos = () => {
    getAllPedidos()
      .then((pedidos) => setPedidos(pedidos))
      .catch(console.error);
  };

  // Función para obtener los pedidos de una sucursal específica
  const pedidosBySucursal = async (sucursalId: number) => {
    try {
      const pedidosBySucursalData = await getPedidosBySucursal(sucursalId);
      setPedidosPorSucursal(pedidosBySucursalData); // Actualizar estado local con los pedidos por sucursal
      return pedidosBySucursalData;
    } catch (error) {
      console.error(`Error al obtener pedidos por sucursal ${sucursalId}:`, error);
      throw error;
    }
  };

  // Esto garantiza que siempre obtengas los pedidos actualizados
  useEffect(() => {
    const timer = setInterval(() => {
      actualizarPedidos();
    }, 10000); // Actualiza cada 10 segundos o el intervalo que prefieras

    return () => clearInterval(timer);
  }, []);

  const value = {
    pedidos,
    pedidosPorSucursal,
    actualizarPedidos,
    pedidosBySucursal,
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
};
