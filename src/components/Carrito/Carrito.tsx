import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Divider, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { PedidoDetalle } from '../../types/PedidoDetalle';
import { useCarrito } from './useCarrito';
import { guardarPedidoEnBD } from '../../services/PedidoService';
import { Pedido } from '../../types/Pedido';
import { useState } from 'react';
import { Estado } from '../../types/enums/Estado';
import { TipoEnvio } from '../../types/enums/TipoEnvio';
import { FormaPago } from '../../types/enums/FormaPago';
import { Factura } from '../../types/Factura';
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { useDatosSeleccion } from './useDatosSeleccion';

interface CartItemProps {
  detalle: PedidoDetalle;
  onRemove: () => void;
}

function CartItem({ detalle, onRemove }: CartItemProps) {
  const imagenArticulo = Array.from(detalle.articulo.imagenesArticulo.values())[0]?.url || '';
  return (
    <ListItem key={detalle.articulo.id} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={detalle.articulo.denominacion} src={imagenArticulo} />
      </ListItemAvatar>
      <ListItemText
        primary={detalle.articulo.denominacion}
        secondary={
          <>
            <Typography component="span" variant="body2" color="textPrimary">
              ${detalle.articulo.precioVenta}
            </Typography>
            <Typography component="span" variant="body2" color="textSecondary">
              {' - '}
              <b>{detalle.cantidad} {detalle.cantidad === 1 ? 'unidad' : 'unidades'}</b>
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
  const { 
    sucursales, clientes, tipoEnvio, setTipoEnvio, formaPago, setFormaPago,
    sucursalSeleccionada, setSucursalSeleccionada, clienteSeleccionado, setClienteSeleccionado, 
    domicilioSeleccionado, setDomicilioSeleccionado, empleado 
  } = useDatosSeleccion();

  const [loading, setLoading] = useState(false);

  const mostrarCarritoJSON = () => {
    console.log(cart);
  };

  const confirmarCompra = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío. Por favor, añade productos antes de confirmar la compra.');
      return;
    }

    setLoading(true);

    try {
      const pedidoDetalles = cart.map(({ articulo, cantidad }) => {
        const subTotal = articulo.precioVenta * cantidad;
        return new PedidoDetalle(0, false, cantidad, subTotal, articulo as ArticuloManufacturado);
      });

      const horaActual = new Date();
      const maxTiempoEstimado = Math.max(...cart.map(detalle => (detalle.articulo as ArticuloManufacturado).tiempoEstimadoMinutos));
      const horaEstimadaFinalizacion = new Date(horaActual.getTime() + maxTiempoEstimado * 60000);

      if (!sucursalSeleccionada) {
        throw new Error('No se ha seleccionado una sucursal válida.');
      }

      if (!clienteSeleccionado || !domicilioSeleccionado) {
        throw new Error('No se ha seleccionado un cliente o domicilio válido.');
      }

      if (!empleado) {
        throw new Error('No se ha seleccionado un empleado válido.');
      }

      const factura = new Factura(
        0,
        false,
        new Date().toISOString(),
        0,
        0,
        '',
        '',
        formaPago,
        totalPedido
      );

      const pedido = new Pedido(
        0,
        false,
        horaEstimadaFinalizacion,
        totalPedido,
        0,
        Estado.PREPARACION,
        tipoEnvio,
        formaPago,
        new Date(),
        sucursalSeleccionada,
        domicilioSeleccionado,
        empleado,
        pedidoDetalles,
        clienteSeleccionado,
        factura
      );

      console.log('Pedido a enviar:', JSON.stringify(pedido)); // Aquí se imprime el JSON completo del pedido

      await guardarPedidoEnBD(pedido);

      alert(`El pedido se guardó correctamente.`);
      limpiarCarrito();
    } catch (error) {
      console.error('Error al confirmar la compra:', error);
      alert('Ocurrió un error al confirmar la compra. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Carrito de Compras
      </Typography>
      <List>
        {cart.map((detalle) => (
          <CartItem
            key={detalle.articulo.id}
            detalle={detalle}
            onRemove={() => removeCarrito(detalle.articulo as ArticuloManufacturado)}
          />
        ))}
      </List>
      <Typography variant="h6" gutterBottom>
        Total Pedido: ${totalPedido}
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel id="tipo-envio-label">Tipo de Envío</InputLabel>
        <Select
          labelId="tipo-envio-label"
          value={tipoEnvio}
          onChange={(e) => setTipoEnvio(e.target.value as TipoEnvio)}
        >
          <MenuItem value={TipoEnvio.DELIVERY}>Delivery</MenuItem>
          <MenuItem value={TipoEnvio.TAKE_AWAY}>Retirar</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="forma-pago-label">Forma de Pago</InputLabel>
        <Select
          labelId="forma-pago-label"
          value={formaPago}
          onChange={(e) => setFormaPago(e.target.value as FormaPago)}
        >
          <MenuItem value={FormaPago.EFECTIVO}>Efectivo</MenuItem>
          <MenuItem value={FormaPago.MERCADO_PAGO}>Mercado Pago</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="sucursal-label">Sucursal</InputLabel>
        <Select
          labelId="sucursal-label"
          value={sucursalSeleccionada?.id || ''}
          onChange={(e) => setSucursalSeleccionada(sucursales.find(s => s.id === e.target.value) || null)}
        >
          {sucursales.map(sucursal => (
            <MenuItem key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="cliente-label">Cliente</InputLabel>
        <Select
          labelId="cliente-label"
          value={clienteSeleccionado?.id || ''}
          onChange={(e) => setClienteSeleccionado(clientes.find(c => c.id === e.target.value) || null)}
        >
          {clientes.map(cliente => (
            <MenuItem key={cliente.id} value={cliente.id}>{cliente.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="domicilio-label">Domicilio</InputLabel>
        <Select
          labelId="domicilio-label"
          value={domicilioSeleccionado?.id || ''}
          onChange={(e) => setDomicilioSeleccionado(clienteSeleccionado?.domicilios.find(d => d.id === e.target.value) || null)}
          disabled={!clienteSeleccionado}
        >
          {clienteSeleccionado?.domicilios.map(domicilio => (
            <MenuItem key={domicilio.id} value={domicilio.id}>{domicilio.calle}</MenuItem>
          ))}
        </Select>
      </FormControl>

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
          disabled={loading}
        >
          Confirmar Compra
        </Button>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="outlined"
          onClick={mostrarCarritoJSON}
        >
          Mostrar Cart JSON
        </Button>
      </Box>
    </Box>
  );
}

export default Carrito;
