import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL + '/auth/register'

const RegisterEmpleado: React.FC = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
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
            alert('Empleado registrado exitosamente');
            navigate('/loginEmpleado'); // Redirige a la página de login
        } catch (error) {
            setMensaje('Error al registrar el empleado');
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
                        type="password"
                        id="clave"
                        autoComplete="current-password"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
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
