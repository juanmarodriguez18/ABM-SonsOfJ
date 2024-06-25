import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../ControlAcceso/AuthContext';
import { Rol } from '../../types/enums/Rol';

interface Props {
    rol: Rol[];
}

const RolEmpleado: React.FC<Props> = ({ rol }) => {
    const { empleado, isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate replace to="/" />;
    }

    if (!empleado || !rol.includes(empleado.tipoEmpleado as Rol)) {
        console.log("Acceso denegado. Redirigiendo a /home");
        return <Navigate replace to="/" />;
    }

    return <Outlet />;
};

export default RolEmpleado;
