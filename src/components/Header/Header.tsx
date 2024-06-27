// Header.tsx
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LogoutButton from './LogoutButton';
import ProfileButton from './ProfileButton';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import { useAuth } from '../ControlAcceso/AuthContext';
import { useState } from 'react';
import { Empleado } from '../../types/Empleado';
import { Avatar } from '@mui/material';

const Header = () => {
  const { isLoggedIn, empleado } = useAuth();
  const [jsonEmpleado] = useState<any>(localStorage.getItem('empleado'));
  const empleadoLogueado:Empleado = JSON.parse(jsonEmpleado) as Empleado;

  if (empleadoLogueado){}

  return (
    <AppBar position="static" color="default">
        <Toolbar>
            {/* logo - start */}
            <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                El Buen Sabor
            </Typography>
            {/* logo - end */}
            {/* nav - start */}
            <Box sx={{ flexGrow: 1 }}></Box>
            {/* nav - end */}
            {/* welcome text and buttons - start */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {isLoggedIn ? (
                    <>
                        {empleado && empleado.imagenEmpleado && (
                            <Avatar alt={`${empleado.nombre} ${empleado.apellido}`} src={empleado.imagenEmpleado.url} />
                        )}
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                            Bienvenido {empleado?.nombre}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 2 }}>
                            Rol: {empleado?.tipoEmpleado}
                        </Typography>
                        <LogoutButton />
                        <ProfileButton />
                    </>
                ) : (
                    <>
                        <LoginButton />
                        <RegisterButton />
                    </>
                )}
            </Box>
            {/* welcome text and buttons - end */}
        </Toolbar>
    </AppBar>
);
};

export default Header;
