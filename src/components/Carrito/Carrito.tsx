import { guardarPedidoEnBD } from '../../services/PedidoService';
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { PedidoDetalle } from '../../types/PedidoDetalle';
import { useCarrito } from './useCarrito';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  IconButton, 
  Divider, 
  Button 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface CartItemProps {
  articulo: ArticuloManufacturado;
  cantidad: number;
  onRemove: () => void;
}

function CartItem({ articulo, cantidad, onRemove }: CartItemProps) {
  const imagenArticulo = Array.from(articulo.imagenesArticulo.values())[0]?.url || '';
  return (
    <ListItem key={articulo.id} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={articulo.denominacion} src={imagenArticulo} />
      </ListItemAvatar>
      <ListItemText
        primary={articulo.denominacion}
        secondary={
          <>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
            >
              ${articulo.precioVenta}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color="textSecondary"
            >
              {' - '}
              <b>{cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}</b>
            </Typography>
          </>
        }
      />
      <IconButton edge="end" aria-label="delete" onClick={onRemove}>
        <DeleteIcon />
      </IconButton>
      <Divider variant="inset" component="li" />
    </ListItem>
  );
}

export function Carrito() {
  const { cart, removeCarrito, limpiarCarrito, totalPedido } = useCarrito();

  const mostrarCarritoJSON = () => {
    console.log(cart);
  };

  const confirmarCompra = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío. Por favor, añade productos antes de confirmar la compra.');
      return;
    }

    try {
      const pedidoDetalles = cart.map(({ articulo, cantidad }) => {
        const subTotal = articulo.precioVenta * cantidad;
        return new PedidoDetalle(0, false, cantidad, subTotal, articulo);
      });

      // Guardar el pedido
      await guardarPedidoEnBD(pedidoDetalles);

      // Mostrar el mensaje de éxito con el ID del pedido
      alert(`El pedido se guardó correctamente.`);

      // Limpiar el carrito después de confirmar la compra
      limpiarCarrito();
    } catch (error) {
      console.error('Error al confirmar la compra:', error);
      alert('Ocurrió un error al confirmar la compra. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Carrito de Compras
      </Typography>
      <List>
        {cart.map(({ articulo, cantidad }) => (
          <CartItem
            key={articulo.id}
            articulo={articulo}
            cantidad={cantidad}
            onRemove={() => removeCarrito(articulo)}
          />
        ))}
      </List>
      <Typography variant="h6" gutterBottom>
        Total Pedido: ${totalPedido}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ClearAllIcon />}
          onClick={limpiarCarrito}
        >
          Limpiar Carrito
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon />}
          onClick={confirmarCompra}
        >
          Confirmar Compra
        </Button>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="outlined"
          onClick={mostrarCarritoJSON}
        >
          Mostrar Cart Json
        </Button>
      </Box>
    </Box>
  );
}
