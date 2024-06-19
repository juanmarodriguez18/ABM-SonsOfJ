import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Typography,
  IconButton,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { format } from "date-fns";
import { Pedido } from "../../types/Pedido";
import { actualizarPedido, getAllPedidos } from "../../services/PedidoService"; // Asegúrate de tener esta función en tu servicio
import { Estado } from "../../types/enums/Estado";
import { TipoEnvio } from "../../types/enums/TipoEnvio";

const CajeroPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoDetalleVisible, setPedidoDetalleVisible] = useState< number | null >(null);
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  const [filtroCodigo, setFiltroCodigo] = useState<string>("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidosFromServer = await getAllPedidos();
        setPedidos(pedidosFromServer);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    };

    fetchPedidos();
  }, []);

  const togglePedidoDetalle = (pedidoId: number) => {
    if (pedidoDetalleVisible === pedidoId) {
      setPedidoDetalleVisible(null);
    } else {
      setPedidoDetalleVisible(pedidoId);
    }
  };

  const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroFecha(event.target.value);
  };

  const handleCodigoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroCodigo(event.target.value);
  };

  const handleChangeEstado = async (pedido: Pedido, nuevoEstado: Estado) => {
    try {
      const pedidoActualizado = { ...pedido, estado: nuevoEstado };
      await actualizarPedido(pedido.id, pedidoActualizado);
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) => (p.id === pedido.id ? pedidoActualizado : p))
      );
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      // Manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const filteredPedidosPendientes = pedidos.filter((pedido) => {
    const fechaPedido = format(new Date(pedido.fechaPedido), "dd/MM/yyyy");
    return (
      fechaPedido.includes(filtroFecha) &&
      pedido.id.toString().includes(filtroCodigo) &&
      pedido.estado === "PENDIENTE"
    );
  });

  const filteredPedidosListos = pedidos.filter((pedido) => {
    const fechaPedido = format(new Date(pedido.fechaPedido), "dd/MM/yyyy");
    return (
      fechaPedido.includes(filtroFecha) &&
      pedido.id.toString().includes(filtroCodigo) &&
      pedido.estado === "LISTO_PARA_ENTREGA"
    );
  });

  console.log("TipoEnvio.DELIVERY:", TipoEnvio.DELIVERY);
  console.log("TipoEnvio.TAKE_AWAY:", TipoEnvio.TAKE_AWAY);

  return (
    <Box
      p={3}
      sx={{
        maxHeight: '100vh',
        overflow: 'auto',
      }}
    >
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Pedidos Pendientes
        </Typography>

        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            id="filtro-fecha"
            label="Filtrar por Fecha"
            variant="outlined"
            size="small"
            value={filtroFecha}
            onChange={handleFechaChange}
            style={{ marginRight: 10 }}
          />
          <TextField
            id="filtro-codigo"
            label="Filtrar por Código"
            variant="outlined"
            size="small"
            value={filtroCodigo}
            onChange={handleCodigoChange}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 8,
            width: "100%",
            marginTop: 2,
            bgcolor: "#eee",
            boxShadow: 2,
          }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: "#aaa" }}>
              <TableRow>
                <TableCell align="center">Código</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Tipo Envío</TableCell>
                <TableCell align="center">Fecha</TableCell>
                <TableCell align="center">Detalles</TableCell>
                <TableCell align="center">Operaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPedidosPendientes.map((pedido) => (
                <React.Fragment key={pedido.id}>
                  <TableRow>
                    <TableCell align="center">{pedido.id}</TableCell>
                    <TableCell align="center">${pedido.total}</TableCell>
                    <TableCell align="center">{pedido.estado}</TableCell>
                    <TableCell align="center">{pedido.tipoEnvio}</TableCell>
                    <TableCell align="center">{format(new Date(pedido.fechaPedido), "dd/MM/yyyy")}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => togglePedidoDetalle(pedido.id)}
                      >
                        {pedidoDetalleVisible === pedido.id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleChangeEstado(pedido, Estado.PREPARACION)}
                        style={{ marginRight: 8 }}
                      >
                        Aceptar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleChangeEstado(pedido, Estado.RECHAZADO)}
                      >
                        Rechazar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse
                        in={pedidoDetalleVisible === pedido.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Detalles del Pedido
                          </Typography>
                          <Table size="small" aria-label="purchases">
                            <TableBody>
                              <TableRow>
                                <TableCell>Nombre Cliente:</TableCell>
                                <TableCell>{pedido.cliente.nombre} {pedido.cliente.apellido}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Dirección:</TableCell>
                                <TableCell>{pedido.domicilio.calle} {pedido.domicilio.numero}, {pedido.domicilio.localidad.nombre}, {pedido.domicilio.localidad.provincia.nombre}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Artículos:</TableCell>
                                <TableCell>
                                  <Table size="small" aria-label="detalle-pedido">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Denominación</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                        <TableCell>Precio Unitario</TableCell>
                                        <TableCell>Sub-Total</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {pedido.pedidoDetalles.map((detalle) => (
                                        <TableRow key={detalle.articulo.id}>
                                          <TableCell>{detalle.articulo.denominacion}</TableCell>
                                          <TableCell>{detalle.cantidad}</TableCell>
                                          <TableCell>${detalle.articulo.precioVenta}</TableCell>
                                          <TableCell>${detalle.articulo.precioVenta * detalle.cantidad}</TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell>Total:</TableCell>
                                        <TableCell>${pedido.total}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Typography variant="h4" gutterBottom>
          Pedidos Listos para entregar
        </Typography>

        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            id="filtro-fecha"
            label="Filtrar por Fecha"
            variant="outlined"
            size="small"
            value={filtroFecha}
            onChange={handleFechaChange}
            style={{ marginRight: 10 }}
          />
          <TextField
            id="filtro-codigo"
            label="Filtrar por Código"
            variant="outlined"
            size="small"
            value={filtroCodigo}
            onChange={handleCodigoChange}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 8,
            width: "100%",
            marginTop: 2,
            bgcolor: "#eee",
            boxShadow: 2,
          }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: "#aaa" }}>
              <TableRow>
                <TableCell align="center">Código</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Tipo Envío</TableCell>
                <TableCell align="center">Fecha</TableCell>
                <TableCell align="center">Detalles</TableCell>
                <TableCell align="center">Operaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPedidosListos.map((pedido) => (
                <React.Fragment key={pedido.id}>
                  <TableRow>
                    <TableCell align="center">{pedido.id}</TableCell>
                    <TableCell align="center">${pedido.total}</TableCell>
                    <TableCell align="center">{pedido.estado}</TableCell>
                    <TableCell align="center">{pedido.tipoEnvio}</TableCell>
                    <TableCell align="center">{format(new Date(pedido.fechaPedido), "dd/MM/yyyy")}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => togglePedidoDetalle(pedido.id)}
                      >
                        {pedidoDetalleVisible === pedido.id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {pedido.tipoEnvio === TipoEnvio.DELIVERY && (
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => handleChangeEstado(pedido, Estado.EN_DELIVERY)}
                          style={{ marginRight: 8 }}
                        >
                          Delivery
                        </Button>
                      )}
                      {pedido.tipoEnvio === TipoEnvio.TAKE_AWAY && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleChangeEstado(pedido, Estado.ENTREGADO)}
                          style={{ marginRight: 8 }}
                        >
                          Take Away
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleChangeEstado(pedido, Estado.CANCELADO)}
                      >
                        Cancelar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse
                        in={pedidoDetalleVisible === pedido.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Detalles del Pedido
                          </Typography>
                          <Table size="small" aria-label="purchases">
                            <TableBody>
                              <TableRow>
                                <TableCell>Nombre Cliente:</TableCell>
                                <TableCell>{pedido.cliente.nombre} {pedido.cliente.apellido}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Dirección:</TableCell>
                                <TableCell>{pedido.domicilio.calle} {pedido.domicilio.numero}, {pedido.domicilio.localidad.nombre}, {pedido.domicilio.localidad.provincia.nombre}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Artículos:</TableCell>
                                <TableCell>
                                  <Table size="small" aria-label="detalle-pedido">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Denominación</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                        <TableCell>Precio Unitario</TableCell>
                                        <TableCell>Sub-Total</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {pedido.pedidoDetalles.map((detalle) => (
                                        <TableRow key={detalle.articulo.id}>
                                          <TableCell>{detalle.articulo.denominacion}</TableCell>
                                          <TableCell>{detalle.cantidad}</TableCell>
                                          <TableCell>${detalle.articulo.precioVenta}</TableCell>
                                          <TableCell>${detalle.articulo.precioVenta * detalle.cantidad}</TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell>Total:</TableCell>
                                        <TableCell>${pedido.total}</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CajeroPedidos;
