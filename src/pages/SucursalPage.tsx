// src/pages/SucursalPage.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Sucursal } from "../types/Sucursal";
import AgregarSucursalModal from "../components/Sucursal/AgregarSucursal";
import {
  eliminarSucursal,
  getSucursales,
  recuperarSucursal,
} from "../services/SucursalService";

const SucursalPage: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | undefined>(undefined);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        setLoading(true);
        const sucursalesData = await getSucursales();
        setSucursales(sucursalesData);
      } catch (error) {
        console.error("Error al cargar las sucursales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSucursales();
  }, []);

  const handleOpenModal = () => {
    setSucursalSeleccionada(undefined); // Limpiar la sucursal seleccionada
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveSucursal = (nuevaSucursal: Sucursal) => {
    if (sucursalSeleccionada) {
      // Modificar sucursal existente
      setSucursales(
        sucursales.map((sucursal) =>
          sucursal.id === nuevaSucursal.id ? nuevaSucursal : sucursal
        )
      );
    } else {
      // Agregar nueva sucursal
      setSucursales([...sucursales, nuevaSucursal]);
    }
    handleCloseModal();
  };

  const handleModificarSucursal = (sucursal: Sucursal) => {
    setSucursalSeleccionada(sucursal);
    setShowModal(true); // Abre el modal con los datos de la sucursal seleccionada
  };

  const handleEliminarRecuperarSucursal = async (sucursal: Sucursal) => {
    try {
      if (sucursal.eliminado) {
        await recuperarSucursal(sucursal.id); // Recuperar sucursal
        setSucursales((prevData) =>
          prevData.map((suc) =>
            suc.id === sucursal.id ? { ...suc, eliminado: false } : suc
          )
        );
      } else {
        await eliminarSucursal(sucursal.id); // Eliminar sucursal
        setSucursales((prevData) =>
          prevData.map((suc) =>
            suc.id === sucursal.id ? { ...suc, eliminado: true } : suc
          )
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la sucursal:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Gestión de Sucursales
      </Typography>
      <Box sx={{ overflowY: "auto", maxHeight: "80vh", width: "100%" }}>
        <Box width={1200} display="flex" alignItems="center" mb={2}>
          <Grid container spacing={4}>
            {loading ? (
              <Typography variant="body1">Cargando...</Typography>
            ) : (
              sucursales.map((sucursal) => (
                <Grid item key={sucursal.id} xs={12} sm={6} md={4} sx={{ maxWidth: "300px" }}>
                  <Card
                    sx={{ width: '100%' }}
                    key={sucursal.id}
                    style={{
                      backgroundColor: sucursal.eliminado
                        ? "#FFB9B9"
                        : "#E7F4FA",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="400"
                      image={
                        sucursal.imagenesSucursal.length > 0
                          ? sucursal.imagenesSucursal[0].url
                          : "https://via.placeholder.com/150"
                      }
                      alt={sucursal.nombre}
                      style={{ opacity: sucursal.eliminado ? 0.2 : 1 }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        style={{ fontSize: "28px", lineHeight: "1.2" }}
                      >
                        {sucursal.nombre}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        style={{ fontSize: "18px", lineHeight: "2" }}
                      >
                        {`${sucursal.domicilio.calle} ${sucursal.domicilio.numero}, Piso ${sucursal.domicilio.piso}, Dpto ${sucursal.domicilio.nroDpto}`}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ fontSize: "14px" }}
                      >
                        Código Postal: {sucursal.domicilio.cp}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ fontSize: "14px" }}
                      >
                        Localidad: {sucursal.domicilio.localidad.nombre}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {sucursal.eliminado ? (
                        <IconButton
                          aria-label="restore"
                          onClick={() =>
                            handleEliminarRecuperarSucursal(sucursal)
                          }
                          title="Recuperar"
                        >
                          <RestoreIcon />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleModificarSucursal(sucursal)}
                            title="Editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() =>
                              handleEliminarRecuperarSucursal(sucursal)
                            }
                            title="Eliminar"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          style={{ marginTop: "16px" }}
        >
          Agregar Sucursal
        </Button>
        <AgregarSucursalModal
          show={showModal}
          handleClose={handleCloseModal}
          onSave={handleSaveSucursal}
          isEdit={sucursalSeleccionada !== undefined}
          sucursalInicial={sucursalSeleccionada}
        />
      </Box>
    </Box>
  );
};

export default SucursalPage;
