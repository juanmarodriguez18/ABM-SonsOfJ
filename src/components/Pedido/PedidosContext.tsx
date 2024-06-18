import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pedido } from '../../types/Pedido';
import { getAllPedidos } from '../../services/PedidoService';

interface PedidosContextType {
  pedidos: Pedido[];
  actualizarPedidos: () => void; // Función para actualizar y notificar a los consumidores
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

  useEffect(() => {
    actualizarPedidos();
  }, []); // Llamar a actualizarPedidos al montar el componente

  // Función para actualizar los pedidos y notificar a los consumidores
  const actualizarPedidos = () => {
    getAllPedidos()
      .then((pedidos) => setPedidos(pedidos))
      .catch(console.error);
  };

  // Esto garantiza que siempre obtengas los pedidos actualizados
  useEffect(() => {
    const timer = setInterval(() => {
      actualizarPedidos();
    },1000); // Actualiza cada 10 segundos o el intervalo que prefieras

    return () => clearInterval(timer);
  }, []);

  const value = {
    pedidos,
    actualizarPedidos,
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
};
