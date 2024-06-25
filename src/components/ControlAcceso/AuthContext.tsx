import React, { createContext, useContext, useState, useEffect } from 'react';
import { Empleado } from '../../types/Empleado';
import { login, logout } from '../../services/AuthService';


interface AuthContextType {
    isLoggedIn: boolean;
    empleado: Empleado | null;
    login: (email: string, clave: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [empleado, setEmpleado] = useState<Empleado | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const empleadoLocalStorage = localStorage.getItem('empleado');
            if (empleadoLocalStorage) {
                setEmpleado(JSON.parse(empleadoLocalStorage));
            }
        }
    }, []);

    const handleLogin = async (email: string, clave: string) => {
        try {
            const empleadoLogueado = await login(email, clave);
            setIsLoggedIn(true);
            setEmpleado(empleadoLogueado);
            localStorage.setItem('empleado', JSON.stringify(empleadoLogueado));
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw new Error('Email y/o Clave incorrectos, vuelva a intentar');
        }
    };

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setEmpleado(null);
        localStorage.removeItem('empleado');
    };

    const contextValue = {
        isLoggedIn,
        empleado,
        login: handleLogin,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
