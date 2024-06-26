import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Empleado } from '../../types/Empleado';
import { Sucursal } from '../../types/Sucursal';
import { Rol } from '../../types/enums/Rol';
import { getSucursales } from '../../services/SucursalService';
import { getEmpleados, updateEmpleado } from '../../services/EmpleadoService';


const GrillaEmpleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empleadosFromServer = await getEmpleados();
        const sucursalesFromServer = await getSucursales();
        setEmpleados(empleadosFromServer);
        setSucursales(sucursalesFromServer);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        // Manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    };

    fetchData();
  }, []);

  const handleChangeRol = async (empleado: Empleado, nuevoRol: Rol) => {
    try {
      const empleadoActualizado = { ...empleado, tipoEmpleado: nuevoRol };
      await updateEmpleado(empleado.id, empleadoActualizado);
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((e) => (e.id === empleado.id ? empleadoActualizado : e))
      );
    } catch (error) {
      console.error('Error al actualizar el rol del empleado:', error);
      // Manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const handleChangeSucursal = async (empleado: Empleado, nuevaSucursalId: number) => {
    try {
      const sucursalSeleccionada = sucursales.find((s) => s.id === nuevaSucursalId);
      if (!sucursalSeleccionada) throw new Error("Sucursal no encontrada");

      const empleadoActualizado: Empleado = {
        ...empleado,
        sucursal: sucursalSeleccionada,
      };

      await updateEmpleado(empleado.id, empleadoActualizado);
      setEmpleados((prevEmpleados) =>
        prevEmpleados.map((e) => (e.id === empleado.id ? empleadoActualizado : e))
      );
    } catch (error) {
      console.error('Error al actualizar la sucursal del empleado:', error);
      // Manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Empleados
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 8, marginTop: 2 }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Código</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Apellido</TableCell>
              <TableCell align="center">Teléfono</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Fecha de Nacimiento</TableCell>
              <TableCell align="center">Rol</TableCell>
              <TableCell align="center">Sucursal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {empleados.map((empleado) => (
              <React.Fragment key={empleado.id}>
                <TableRow>
                  <TableCell align="center">{empleado.id}</TableCell>
                  <TableCell align="center">{empleado.nombre}</TableCell>
                  <TableCell align="center">{empleado.apellido}</TableCell>
                  <TableCell align="center">{empleado.telefono}</TableCell>
                  <TableCell align="center">{empleado.email}</TableCell>
                  <TableCell align="center">{new Date(empleado.fechaNacimiento).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <FormControl fullWidth>
                      <InputLabel>Rol</InputLabel>
                      <Select
                        label="Rol"
                        value={empleado.tipoEmpleado}
                        onChange={(e) => handleChangeRol(empleado, e.target.value as Rol)}
                      >
                        {Object.values(Rol).map((rol) => (
                          <MenuItem key={rol} value={rol}>
                            {rol}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl fullWidth>
                      <InputLabel>Sucursal</InputLabel>
                      <Select
                        label="Sucursal"
                        value={empleado.sucursal?.id || ''}
                        onChange={(e) => handleChangeSucursal(empleado, Number(e.target.value))}
                      >
                        {sucursales.map((sucursal) => (
                          <MenuItem key={sucursal.id} value={sucursal.id}>
                            {sucursal.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GrillaEmpleados;
