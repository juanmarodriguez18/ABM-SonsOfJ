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
  const [pedidoDetalleVisible, setPedidoDetalleVisible] = useState<number | null>(null);
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  const [filtroCodigo, setFiltroCodigo] = useState<string>("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidosFromServer = await getAllPedidos();
        setPedidos(pedidosFromServer);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
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

  const filteredPedidos = pedidos.filter((pedido) => {
    const fechaPedido = format(new Date(pedido.fechaPedido), "dd/MM/yyyy");
    return (
      fechaPedido.includes(filtroFecha) &&
      pedido.id.toString().includes(filtroCodigo)
    );
  });

  return (
    <Box p={3}>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tipo Envío</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPedidos.map((pedido) => (
              <React.Fragment key={pedido.id}>
                <TableRow>
                  <TableCell>{pedido.id}</TableCell>
                  <TableCell>${pedido.total}</TableCell>
                  <TableCell>{pedido.estado}</TableCell>
                  <TableCell>{pedido.tipoEnvio}</TableCell>
                  <TableCell>{format(new Date(pedido.fechaPedido), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
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
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {pedido.pedidoDetalles.map((detalle) => (
                                      <TableRow key={detalle.articulo.id}>
                                        <TableCell>{detalle.articulo.denominacion}</TableCell>
                                        <TableCell>{detalle.cantidad}</TableCell>
                                        <TableCell>${detalle.articulo.precioVenta}</TableCell>
                                      </TableRow>
                                    ))}
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
  );
};

export default PedidosPage;
