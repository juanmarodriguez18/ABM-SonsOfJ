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
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { format } from "date-fns";
import { Pedido } from "../types/Pedido";
import { getAllPedidos } from "../services/PedidoService";

const PedidosPage: React.FC = () => {
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

  const filteredPedidos = pedidos.filter((pedido) => {
    const fechaPedido = format(new Date(pedido.fechaPedido), "dd/MM/yyyy");
    return (
      fechaPedido.includes(filtroFecha) &&
      pedido.id.toString().includes(filtroCodigo)
    );
  });

  return (
    <Box p={3}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Pedidos
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
            maxHeight: "80vh",
            overflow: "auto",
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
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPedidos.map((pedido) => (
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
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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

export default PedidosPage;
