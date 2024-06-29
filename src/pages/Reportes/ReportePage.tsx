import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import '../../styles/ReportePage.css';  // Asegúrate de que la ruta sea correcta

const ReportePage: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [rankingComidas, setRankingComidas] = useState([]);
  const [pedidosPorCliente, setPedidosPorCliente] = useState([]);
  const [ingresosDiarios, setIngresosDiarios] = useState([]);
  const [ingresosMensuales, setIngresosMensuales] = useState([]);
  const [ganancia, setGanancia] = useState(0);
  const [openRanking, setOpenRanking] = useState(false);
  const [openPedidosCliente, setOpenPedidosCliente] = useState(false);
  const [openIngresosDiarios, setOpenIngresosDiarios] = useState(false);
  const [openIngresosMensuales, setOpenIngresosMensuales] = useState(false);
  const [openGanancia, setOpenGanancia] = useState(false);
  const [openGraficoRanking, setOpenGraficoRanking] = useState(false);
  const [openGraficoPedidosCliente, setOpenGraficoPedidosCliente] = useState(false);
  const [openGraficoIngresos, setOpenGraficoIngresos] = useState(false);
  const [openGraficoGanancia, setOpenGraficoGanancia] = useState(false);

  const handleGenerarRanking = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/ranking-comidas', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setRankingComidas(response.data);
      setOpenRanking(true);
    } catch (error) {
      console.error('Error al generar el ranking', error);
    }
  };

  const handleDescargarExcelRanking = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/excel/ranking-comidas', {
        params: {
          fechaInicio,
          fechaFin
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ranking_comidas.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el Excel', error);
    }
  };

  const handleGenerarPedidosPorCliente = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/cantidad-pedidos-cliente', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setPedidosPorCliente(response.data);
      setOpenPedidosCliente(true);
    } catch (error) {
      console.error('Error al generar el reporte de pedidos por cliente', error);
    }
  };

  const handleDescargarExcelPedidosPorCliente = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/excel/pedidos-cliente', {
        params: {
          fechaInicio,
          fechaFin
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pedidos_cliente.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el Excel', error);
    }
  };

  const handleGenerarIngresosDiarios = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/ingresos-diarios', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setIngresosDiarios(response.data);
      setOpenIngresosDiarios(true);
    } catch (error) {
      console.error('Error al generar el reporte de ingresos diarios', error);
    }
  };

  const handleDescargarExcelIngresosDiarios = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/excel/ingresos-diarios', {
        params: {
          fechaInicio,
          fechaFin
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ingresos_diarios.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el Excel', error);
    }
  };

  const handleGenerarIngresosMensuales = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/ingresos-mensuales', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setIngresosMensuales(response.data);
      setOpenIngresosMensuales(true);
    } catch (error) {
      console.error('Error al generar el reporte de ingresos mensuales', error);
    }
  };

  const handleDescargarExcelIngresosMensuales = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/excel/ingresos-mensuales', {
        params: {
          fechaInicio,
          fechaFin
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ingresos_mensuales.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el Excel', error);
    }
  };

  const handleGenerarGanancia = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/ganancia', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setGanancia(response.data);
      setOpenGanancia(true);
    } catch (error) {
      console.error('Error al generar el reporte de ganancia', error);
    }
  };

  const handleDescargarExcelGanancia = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/excel/ganancia', {
        params: {
          fechaInicio,
          fechaFin
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ganancia.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el Excel', error);
    }
  };

  const handleOpenGraficoRanking = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/ranking-comidas', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setRankingComidas(response.data);
      setOpenGraficoRanking(true);
    } catch (error) {
      console.error('Error al generar el gráfico de ranking de comidas', error);
    }
  };

  const handleOpenGraficoPedidosCliente = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/cantidad-pedidos-cliente', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setPedidosPorCliente(response.data);
      setOpenGraficoPedidosCliente(true);
    } catch (error) {
      console.error('Error al generar el gráfico de pedidos por cliente', error);
    }
  };

  const handleOpenGraficoIngresos = async () => {
    try {
      const responseDiarios = await axios.get('http://localhost:8080/api/reportes/ingresos-diarios', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      const responseMensuales = await axios.get('http://localhost:8080/api/reportes/ingresos-mensuales', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setIngresosDiarios(responseDiarios.data);
      setIngresosMensuales(responseMensuales.data);
      setOpenGraficoIngresos(true);
    } catch (error) {
      console.error('Error al generar los gráficos de ingresos', error);
    }
  };

  const handleOpenGraficoGanancia = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/ganancia', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setGanancia(response.data);
      setOpenGraficoGanancia(true);
    } catch (error) {
      console.error('Error al generar el gráfico de ganancia', error);
    }
  };

  const handleCloseRanking = () => {
    setOpenRanking(false);
  };

  const handleClosePedidosCliente = () => {
    setOpenPedidosCliente(false);
  };

  const handleCloseIngresosDiarios = () => {
    setOpenIngresosDiarios(false);
  };

  const handleCloseIngresosMensuales = () => {
    setOpenIngresosMensuales(false);
  };

  const handleCloseGanancia = () => {
    setOpenGanancia(false);
  };

  const handleCloseGraficoRanking = () => {
    setOpenGraficoRanking(false);
  };

  const handleCloseGraficoPedidosCliente = () => {
    setOpenGraficoPedidosCliente(false);
  };

  const handleCloseGraficoIngresos = () => {
    setOpenGraficoIngresos(false);
  };

  const handleCloseGraficoGanancia = () => {
    setOpenGraficoGanancia(false);
  };

  const formatDate = (epochTime: number) => {
    const date = new Date(epochTime);
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {/* Ranking de comidas más pedidas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ranking comidas más pedidas
            </Typography>
            <TextField
              label="Fecha Inicio"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#115293' } }} onClick={handleGenerarRanking}>
                Generar Reporte
              </Button>
              <Button className="report-button excel" onClick={handleDescargarExcelRanking}>
                Exportar a Excel
              </Button>
              <Button className="report-button graph" onClick={handleOpenGraficoRanking}>
                Gráfico
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Ingresos por períodos de tiempo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ingresos por períodos de tiempo
            </Typography>
            <TextField
              label="Fecha Inicio"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#115293' } }} onClick={handleGenerarIngresosDiarios}>
                Reporte Diario
              </Button>
              <Button sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#115293' } }} onClick={handleGenerarIngresosMensuales}>
                Reporte Mensual
              </Button>
              <Button className="report-button excel" onClick={handleDescargarExcelIngresosDiarios}>
                Excel Diario
              </Button>
              <Button className="report-button excel" onClick={handleDescargarExcelIngresosMensuales}>
                Excel Mensual
              </Button>
              <Button className="report-button graph" onClick={handleOpenGraficoIngresos}>
                Gráfico
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Cantidad de pedidos por cliente */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cantidad de pedidos por cliente
            </Typography>
            <TextField
              label="Fecha Inicio"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#115293' } }} onClick={handleGenerarPedidosPorCliente}>
                Generar Reporte
              </Button>
              <Button className="report-button excel" onClick={handleDescargarExcelPedidosPorCliente}>
                Exportar a Excel
              </Button>
              <Button className="report-button graph" onClick={handleOpenGraficoPedidosCliente}>
                Gráfico
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Monto de Ganancia */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monto de Ganancia
            </Typography>
            <TextField
              label="Fecha Inicio"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#115293' } }} onClick={handleGenerarGanancia}>
                Generar Reporte
              </Button>
              <Button className="report-button excel" onClick={handleDescargarExcelGanancia}>
                Exportar a Excel
              </Button>
              <Button className="report-button graph" onClick={handleOpenGraficoGanancia}>
                Gráfico
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Modal open={openRanking} onClose={handleCloseRanking}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Ranking de Comidas Más Pedidas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Comida</TableCell>
                  <TableCell align="right">Pedidos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankingComidas.map((row: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell align="right">{row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleCloseRanking} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openPedidosCliente} onClose={handleClosePedidosCliente}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Cantidad de Pedidos por Cliente
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="right">Apellido</TableCell>
                  <TableCell align="right">Cantidad de Pedidos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidosPorCliente.map((row: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell align="right">{row[1]}</TableCell>
                    <TableCell align="right">{row[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleClosePedidosCliente} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openIngresosDiarios} onClose={handleCloseIngresosDiarios}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Ingresos Diarios
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Día</TableCell>
                  <TableCell align="right">Ingresos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingresosDiarios.map((row: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(row[0])}</TableCell>
                    <TableCell align="right">{row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleCloseIngresosDiarios} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openIngresosMensuales} onClose={handleCloseIngresosMensuales}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Ingresos Mensuales
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Año</TableCell>
                  <TableCell align="right">Mes</TableCell>
                  <TableCell align="right">Ingresos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingresosMensuales.map((row: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell align="right">{row[1]}</TableCell>
                    <TableCell align="right">{row[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleCloseIngresosMensuales} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openGanancia} onClose={handleCloseGanancia}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Monto de Ganancia
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ganancia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="right">{ganancia}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleCloseGanancia} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openGraficoRanking} onClose={handleCloseGraficoRanking}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Gráfico de Ranking de Comidas
          </Typography>
          <Chart
            chartType="PieChart"
            data={[['Comida', 'Pedidos'], ...rankingComidas.map((row) => [row[0], row[1]])]}
            options={{ title: 'Ranking de Comidas Más Pedidas' }}
            width="100%"
            height="400px"
          />
          <Button onClick={handleCloseGraficoRanking} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openGraficoPedidosCliente} onClose={handleCloseGraficoPedidosCliente}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Gráfico de Pedidos por Cliente
          </Typography>
          <Chart
            chartType="PieChart"
            data={[['Cliente', 'Pedidos'], ...pedidosPorCliente.map((row) => [`${row[0]} ${row[1]}`, row[2]])]}
            options={{ title: 'Pedidos por Cliente' }}
            width="100%"
            height="400px"
          />
          <Button onClick={handleCloseGraficoPedidosCliente} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openGraficoIngresos} onClose={handleCloseGraficoIngresos}>
        <Box className="modal-box" sx={{ display: 'flex', gap: 2 }}>
          <Box>
            <Typography variant="h6" component="h2">
              Gráfico de Ingresos Diarios
            </Typography>
            <Chart
              chartType="ColumnChart"
              data={[['Día', 'Ingresos'], ...ingresosDiarios.map((row) => [formatDate(row[0]), row[1]])]}
              options={{ title: 'Ingresos Diarios' }}
              width="100%"
              height="400px"
            />
          </Box>
          <Box>
            <Typography variant="h6" component="h2">
              Gráfico de Ingresos Mensuales
            </Typography>
            <Chart
              chartType="ColumnChart"
              data={[['Mes', 'Ingresos'], ...ingresosMensuales.map((row) => [`${row[0]}-${row[1]}`, row[2]])]}
              options={{ title: 'Ingresos Mensuales' }}
              width="100%"
              height="400px"
            />
          </Box>
          <Button onClick={handleCloseGraficoIngresos} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>

      <Modal open={openGraficoGanancia} onClose={handleCloseGraficoGanancia}>
        <Box className="modal-box">
          <Typography variant="h6" component="h2">
            Gráfico de Ganancia
          </Typography>
          <Chart
            chartType="BarChart"
            data={[['Fecha', 'Ganancia'], ['Ganancia', ganancia]]}
            options={{ title: 'Monto de Ganancia' }}
            width="100%"
            height="400px"
          />
          <Button onClick={handleCloseGraficoGanancia} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ReportePage;
