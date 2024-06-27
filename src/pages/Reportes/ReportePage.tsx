import React from 'react';
import { Box, Typography, Button, TextField, Grid, Paper } from '@mui/material';

const ReportePage: React.FC = () => {
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
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary">
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
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
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
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
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
            />
            <TextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
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
    </Box>
  );
};

export default ReportePage;