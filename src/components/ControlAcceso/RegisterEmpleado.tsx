import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL + '/auth/register';

const RegisterEmpleado: React.FC = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mostrarClave, setMostrarClave] = useState(false);
    const [mostrarConfirmarClave, setMostrarConfirmarClave] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (clave !== confirmarClave) {
            setMensaje('Las contraseñas no coinciden');
            return;
        }
        try {
            const empleado = {
                nombre,
                apellido,
                telefono,
                email,
                clave,
                fechaNacimiento,
                tipoEmpleado: 'EMPLEADO_COMUN' // Se establece directamente el tipo de empleado
            };
            const response = await axios.post(API_URL, empleado);
    
            // Verificar el estado de la respuesta
            if (response.status === 201) { // 201 Created
                alert('Empleado registrado exitosamente');
                navigate('/loginEmpleado'); // Redirige a la página de login
            } else {
                setMensaje('Error inesperado al registrar el empleado');
            }
    
            // Acceder a los datos de la respuesta
            console.log('Datos de la respuesta:', response.data);
    
        } catch (error) {
            // Manejar errores específicos de Axios
            if (axios.isAxiosError(error)) {
                console.error('Error de Axios:', error.response?.data);
                setMensaje('Error de Axios al registrar el empleado');
            } else {
                console.error('Error desconocido:', error);
                setMensaje('Error al registrar el empleado');
            }
        }
    };
    

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Registro de Empleado
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="nombre"
                        label="Nombre"
                        name="nombre"
                        autoComplete="nombre"
                        autoFocus
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="apellido"
                        label="Apellido"
                        name="apellido"
                        autoComplete="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="telefono"
                        label="Teléfono"
                        name="telefono"
                        autoComplete="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="clave"
                        label="Clave"
                        type={mostrarClave ? 'text' : 'password'}
                        id="clave"
                        autoComplete="current-password"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setMostrarClave(!mostrarClave)}
                                        edge="end"
                                    >
                                        {mostrarClave ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmarClave"
                        label="Confirmar Clave"
                        type={mostrarConfirmarClave ? 'text' : 'password'}
                        id="confirmarClave"
                        value={confirmarClave}
                        onChange={(e) => setConfirmarClave(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => setMostrarConfirmarClave(!mostrarConfirmarClave)}
                                        edge="end"
                                    >
                                        {mostrarConfirmarClave ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fechaNacimiento"
                        label="Fecha de Nacimiento"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Registrar
                    </Button>
                    {mensaje && <Alert severity="error">{mensaje}</Alert>}
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterEmpleado;
