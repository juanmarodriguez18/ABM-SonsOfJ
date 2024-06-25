// servicios/authService.ts
import axios from 'axios';
import { Empleado } from '../types/Empleado';


const API_URL = 'http://localhost:8080/auth';

export async function login(email: string, clave: string): Promise<Empleado> {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, clave });
        const token = response.data.jwt;

        localStorage.setItem('token', token);

        const empleadoResponse = await axios.get(`${API_URL}/currentEmpleado`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        });

        const empleadoLogueado: Empleado = empleadoResponse.data;
        localStorage.setItem('empleado', JSON.stringify(empleadoLogueado));
        // Mostrar la respuesta del servidor en la consola
        console.log('Response from login API:', response.data);
        console.log('Empleado Logueado: ', empleadoLogueado);

        return empleadoLogueado;
    } catch (error) {
        console.error('Error en el servicio de login:', error);
        throw new Error('Email y/o Clave incorrectos, vuelva a intentar');
    }
}

export async function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('empleado');
    // Limpiar cualquier otro estado relacionado con la sesión aquí si es necesario
}
