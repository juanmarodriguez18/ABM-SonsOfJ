import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Divider, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
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
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { useDatosSeleccion } from './useDatosSeleccion';
import CheckoutMP from './MercadoPago/CheckoutMP';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';

interface CartItemProps {
  detalle: PedidoDetalle;
  onRemove: () => void;
}

function CartItem({ detalle, onRemove }: CartItemProps) {
  const imagenArticulo = Array.from(detalle.articulo.imagenesArticulo.values())[0]?.url || '';
  return (
    <ListItem key={detalle.articulo.id} alignItems="flex-start" sx={{ borderRadius: 8 }}>
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
  const [pedido, setPedido] = useState<Pedido | null>(null);

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
        return new PedidoDetalle(0, false, cantidad, subTotal, articulo);
      });

      const horaActual = new Date();
      const maxTiempoEstimado = Math.max(
        ...cart.map(detalle => {
          if (detalle.articulo instanceof ArticuloManufacturado) {
            return detalle.articulo.tiempoEstimadoMinutos;
          }
          return 0;
        })
      );
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

      if (totalPedido === undefined || isNaN(totalPedido)) {
        throw new Error('El total del pedido no es válido.');
      }

      const nuevoPedido = new Pedido(
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
        clienteSeleccionado
      );

      setPedido(nuevoPedido);

      console.log('Pedido a enviar:', JSON.stringify(nuevoPedido));

      await guardarPedidoEnBD(nuevoPedido);

      if (formaPago === FormaPago.EFECTIVO) {
        alert('El pedido se guardó correctamente.');
        limpiarCarrito();
      } else {
        alert('El pedido se guardó correctamente. Complete el pago con Mercado Pago.');
      }
    } catch (error) {
      console.error('Error al confirmar la compra:', error);
      alert('Ocurrió un error al confirmar la compra. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handlePagoCompleto = () => {
    limpiarCarrito();
  };

  const montoCarrito = typeof totalPedido === 'number' ? totalPedido : 0;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>
      <List sx={{ bgcolor: '#F5F5F5', borderRadius: 2, marginBottom: 4 }}>
        {cart.map((detalle) => (
          <CartItem
            key={detalle.articulo.id}
            detalle={detalle}
            onRemove={() => removeCarrito(detalle.articulo as ArticuloManufacturado | ArticuloInsumo)}
          />
        ))}
      </List>
      <Typography variant="h6" gutterBottom>
        Total Pedido: ${totalPedido}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="tipo-envio-label">Tipo de Envío</InputLabel>
            <Select
              labelId="tipo-envio-label"
              label="Tipo de Envío"
              value={tipoEnvio}
              onChange={(e) => setTipoEnvio(e.target.value as TipoEnvio)}
            >
              <MenuItem value={TipoEnvio.DELIVERY}>Delivery</MenuItem>
              <MenuItem value={TipoEnvio.TAKE_AWAY}>Retirar</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="forma-pago-label">Forma de Pago</InputLabel>
            <Select
              labelId="forma-pago-label"
              label="Forma de Pago"
              value={formaPago}
              onChange={(e) => setFormaPago(e.target.value as FormaPago)}
            >
              <MenuItem value={FormaPago.EFECTIVO}>Efectivo</MenuItem>
              <MenuItem value={FormaPago.MERCADO_PAGO}>Mercado Pago</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="sucursal-label">Sucursal</InputLabel>
            <Select
              labelId="sucursal-label"
              label="Sucursal"
              value={sucursalSeleccionada?.id || ''}
              onChange={(e) => setSucursalSeleccionada(sucursales.find(s => s.id === e.target.value) || null)}
            >
              {sucursales.map(sucursal => (
                <MenuItem key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              label="Cliente"
              value={clienteSeleccionado?.id || ''}
              onChange={(e) => setClienteSeleccionado(clientes.find(c => c.id === e.target.value) || null)}
            >
              {clientes.map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>{cliente.nombre} {cliente.apellido}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="domicilio-label">Domicilio</InputLabel>
            <Select
              labelId="domicilio-label"
              label="Domicilio"
              value={domicilioSeleccionado?.id || ''}
              onChange={(e) => setDomicilioSeleccionado(clienteSeleccionado?.domicilios.find(d => d.id === e.target.value) || null)}
              disabled={!clienteSeleccionado}
            >
              {clienteSeleccionado?.domicilios.map(domicilio => (
                <MenuItem key={domicilio.id} value={domicilio.id}>{domicilio.calle} {domicilio.numero}, {domicilio.localidad.nombre}, {domicilio.localidad.provincia.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
          onClick={mostrarCarritoJSON}
        >
          Mostrar Cart Json
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          startIcon={<ShoppingCartIcon />}
          onClick={confirmarCompra}
        >
          Confirmar Compra
        </Button>
      </Box>
      {formaPago === FormaPago.MERCADO_PAGO && pedido && (
        <CheckoutMP montoCarrito={montoCarrito} pedido={pedido} onPagoCompleto={handlePagoCompleto} />
      )}
    </Box>
  );
}

export default Carrito;
