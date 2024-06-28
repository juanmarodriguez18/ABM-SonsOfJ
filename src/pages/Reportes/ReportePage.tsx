import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const ReportePage: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [rankingComidas, setRankingComidas] = useState([]);
  const [open, setOpen] = useState(false);

  const handleGenerarRanking = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reportes/ranking-comidas', {
        params: {
          fechaInicio,
          fechaFin
        }
      });
      setRankingComidas(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Error al generar el ranking', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reporte General
      </Typography>

      <Grid container spacing={3}>
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
            <Button variant="contained" color="primary" onClick={handleGenerarRanking}>
              Generar Reporte
            </Button>
            <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
              Exportar a Excel
            </Button>
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
            <Button variant="contained" color="primary">
              Generar Reporte
            </Button>
            <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
              Exportar a Excel
            </Button>
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
            <Button variant="contained" color="primary">
              Generar Reporte
            </Button>
            <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
              Exportar a Excel
            </Button>
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
            <Button variant="contained" color="primary">
              Generar Reporte
            </Button>
            <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
              Exportar a Excel
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
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
          <Button onClick={handleClose} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ReportePage;
