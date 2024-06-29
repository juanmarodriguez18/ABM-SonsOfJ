import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { TextField, Button, Typography, Container, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [mostrarClave, setMostrarClave] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, clave);
            setError('');
            navigate('/');
            window.location.reload();
        } catch (error) {
            setError('Email y/o Clave incorrectos, vuelva a intentar');
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
                    Login
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography variant="body2" align="center">
                        ¿No tienes una cuenta? <Link to="/registerEmpleado">Regístrate aquí</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
