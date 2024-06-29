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
  Modal,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { format } from "date-fns";
import { Pedido } from "../types/Pedido";
import { getAllPedidos, getPedidosByFecha } from "../services/PedidoService";
import axios from "axios";

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoDetalleVisible, setPedidoDetalleVisible] = useState<number | null>(null);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState<string>("");
  const [filtroFechaFin, setFiltroFechaFin] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);

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

  const handleFechaInicioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroFechaFin(event.target.value);
  };

  const handleEstadoChange = (event: SelectChangeEvent<string>) => {
    setFiltroEstado(event.target.value as string);
  };

  const handleBuscarClick = async () => {
    if (filtroFechaInicio && filtroFechaFin) {
      try {
        const pedidosFiltrados = await getPedidosByFecha(filtroFechaInicio, filtroFechaFin);
        setFilteredPedidos(pedidosFiltrados);
        setModalOpen(true);
      } catch (error) {
        console.error("Error al buscar pedidos:", error);
      }
    } else {
      alert("Por favor, selecciona las fechas de inicio y fin.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleExportarExcel = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/pedidos/export/excel`, {
        params: {
          fechaInicio: filtroFechaInicio,
          fechaFin: filtroFechaFin,
          estado: filtroEstado // Incluyendo el estado en los parámetros de la solicitud
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pedidos.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  const filteredPedidosByEstado = filtroEstado
    ? filteredPedidos.filter(pedido => pedido.estado === filtroEstado)
    : filteredPedidos;

  return (
    <Box p={3}>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Pedidos
        </Typography>
        <Box display="flex" alignItems="center">
          <TextField
            id="filtro-fecha-inicio"
            label="Fecha Inicio"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
            value={filtroFechaInicio}
            onChange={handleFechaInicioChange}
            style={{ marginRight: 10 }}
          />
          <TextField
            id="filtro-fecha-fin"
            label="Fecha Fin"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
            value={filtroFechaFin}
            onChange={handleFechaFinChange}
            style={{ marginRight: 10 }}
          />
          <Button variant="contained" color="primary" onClick={handleBuscarClick}>
            Buscar
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 8,
          width: "100%",
          marginTop: 2,
          bgcolor: "#eee",
          boxShadow: 2,
          maxHeight: "74vh",
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
            {pedidos.map((pedido) => (
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

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...modalStyle, width: 800 }}> {/* Ancho del modal ajustado */}
          <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Listado de pedidos por fecha
          </Typography>
          <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
            <InputLabel id="filtro-estado-label">Estado</InputLabel>
            <Select
              labelId="filtro-estado-label"
              id="filtro-estado"
              value={filtroEstado}
              onChange={handleEstadoChange}
              label="Estado"
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              <MenuItem value="PENDIENTE">Pendiente</MenuItem>
              <MenuItem value="CANCELADO">Cancelado</MenuItem>
              <MenuItem value="LISTO_PARA_ENTREGA">Listo para entrega</MenuItem>
              <MenuItem value="ENTREGADO">Entregado</MenuItem>
              <MenuItem value="PREPARACION">Preparación</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Código</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Tipo Envío</TableCell>
                <TableCell align="center">Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPedidosByEstado.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell align="center">{pedido.id}</TableCell>
                  <TableCell align="center">${pedido.total}</TableCell>
                  <TableCell align="center">{pedido.estado}</TableCell>
                  <TableCell align="center">{pedido.tipoEnvio}</TableCell>
                  <TableCell align="center">{format(new Date(pedido.fechaPedido), "dd/MM/yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} textAlign="center">
          <Button
            variant="contained"
            style={{ backgroundColor: 'green', color: 'white' }}
            onClick={handleExportarExcel}
          >
            Pedidos Excel
          </Button>
        </Box>
      </Box>
    </Modal>
  </Box>
);
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default PedidosPage;
