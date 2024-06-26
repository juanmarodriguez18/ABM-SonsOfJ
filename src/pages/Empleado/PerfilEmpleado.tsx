import {
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../../components/ControlAcceso/AuthContext';

const ProfilePage = () => {
  const { empleado } = useAuth();
  const defaultImage = 'https://i.postimg.cc/P5MjVtmw/imagen-perfil-por-defecto.jpg';

  // Formatear la fecha de nacimiento si es necesario
  const formatFechaNacimiento = (fecha: string | undefined) => {
    if (!fecha) return 'N/A';
    const dateObj = new Date(fecha);
    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    return formattedDate;
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align='center'>
        Perfil del Empleado
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container justifyContent="center" alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar
                    sx={{ width: 240, height: 240 }}
                    alt={empleado?.nombre || 'Imagen de perfil por defecto'}
                    src={empleado?.imagenEmpleado?.url || defaultImage}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h6">
                    Nombre: {empleado?.nombre} {empleado?.apellido}
                  </Typography>
                  <Typography variant="body2">
                    Email: {empleado?.email}
                  </Typography>
                  <Typography variant="body2">
                    Teléfono: {empleado?.telefono}
                  </Typography>
                  <Typography variant="body2">
                    Fecha de Nacimiento: {formatFechaNacimiento(empleado?.fechaNacimiento)}
                  </Typography>
                  <Typography variant="body2">
                    Rol: {empleado?.tipoEmpleado}
                  </Typography>
                  {empleado?.sucursal && (
                    <Typography variant="body2">
                      Sucursal: {empleado.sucursal.nombre}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary">
                        Editar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
