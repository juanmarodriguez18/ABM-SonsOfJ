import { ReactNode, createContext, useEffect, useState } from 'react';
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';

interface CartItem {
  articulo: ArticuloManufacturado;
  cantidad: number;
}

interface CartContextType {
  cart: CartItem[];
  addCarrito: (product: ArticuloManufacturado) => void;
  removeCarrito: (product: ArticuloManufacturado) => void;
  removeItemCarrito: (product: ArticuloManufacturado) => void;
  limpiarCarrito: () => void;
  updateCarrito: (articulo: ArticuloManufacturado, cantidad: number) => void;
  totalPedido?: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addCarrito: () => {},
  removeCarrito: () => {},
  removeItemCarrito: () => {},
  limpiarCarrito: () => {},
  updateCarrito: () => {},
  totalPedido: 0
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPedido, setTotalPedido] = useState<number>(0);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    calcularTotalCarrito();
  }, [cart]);

  const addCarrito = (product: ArticuloManufacturado) => {
    const existingItemIndex = cart.findIndex(item => item.articulo.id === product.id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].cantidad += 1;
      setCart(updatedCart);
    } else {
      setCart(prevCart => [...prevCart, { articulo: product, cantidad: 1 }]);
    }
  };

  const updateCarrito = (articulo: ArticuloManufacturado, cantidad: number) => {
    setCart((prevCarrito) => {
      if (cantidad <= 0) {
        return prevCarrito.filter((item) => item.articulo.id !== articulo.id);
      }
      return prevCarrito.map((item) =>
        item.articulo.id === articulo.id ? { ...item, cantidad } : item
      );
    });
  };

  const removeCarrito = (product: ArticuloManufacturado) => {
    setCart(prevCart => prevCart.filter(item => item.articulo.id !== product.id));
  };

  const removeItemCarrito = (product: ArticuloManufacturado) => {
    const existingItem = cart.find(item => item.articulo.id === product.id);
    if (existingItem) {
      if (existingItem.cantidad > 1) {
        const updatedCart = cart.map(item => {
          if (item.articulo.id === product.id) {
            return { ...item, cantidad: item.cantidad - 1 };
          }
          return item;
        });
        setCart(updatedCart);
      } else {
        setCart(prevCart => prevCart.filter(item => item.articulo.id !== product.id));
      }
    }
  };

  const limpiarCarrito = () => {
    setCart([]);
  };

  const calcularTotalCarrito = () => {
    let total = 0;
    cart.forEach(item => {
      total += item.articulo.precioVenta * item.cantidad;
    });
    setTotalPedido(total);
  };

  return (
    <CartContext.Provider value={{ cart, addCarrito, updateCarrito, limpiarCarrito, removeCarrito, removeItemCarrito, totalPedido }}>
      {children}
    </CartContext.Provider>
  );
}
