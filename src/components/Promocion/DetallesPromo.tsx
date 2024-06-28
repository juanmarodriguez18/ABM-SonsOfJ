import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { getPromocionById } from "../../services/PromocionService";
import { Promocion } from "../../types/Promocion";
import { PromocionDetalle } from "../../types/PromocionDetalle";

const DetallesPromo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  
  useEffect(() => {
    const fetchPromocion = async () => {
      if (id) {
        const data: Promocion = await getPromocionById(parseInt(id, 10));
        
        console.log("Formato horaDesde:", data.horaDesde);
        console.log("Formato horaHasta:", data.horaHasta);
        // Convertir cadenas de fecha en objetos Date
        data.fechaDesde = new Date(data.fechaDesde);
        data.fechaHasta = new Date(data.fechaHasta);

        setPromocion(data);
      }
    };

    fetchPromocion();
  }, [id]);

  if (!id) {
    return <div>ID no proporcionado</div>;
  }

  if (!promocion) {
    return <CircularProgress />;
  }

  // Convertir arrays
  const imagenesPromocionArray = promocion.imagenesPromocion;
  const detallesArray: PromocionDetalle[] = promocion.promocionDetalles;

  // Función para formatear horas
  const formatHora = (hora: string | number[]): string => {
    if (typeof hora === "string") {
      if (hora.length === 4) {
        return `${hora.slice(0, 2)}:${hora.slice(2, 4)}`;
      }
      return hora;
    } else if (Array.isArray(hora) && hora.length === 2) {
      const hour = hora[0].toString().padStart(2, "0");
      const minute = hora[1].toString().padStart(2, "0");
      return `${hour}:${minute}`;
    }
    return hora.toString(); // Si no es un formato esperado, se devuelve como está
  };


  return (
    <Container
      sx={{
        borderRadius: 8,
        width: "100%",
        marginTop: 2,
        bgcolor: "#eee",
        boxShadow: 2,
        overflowY: "auto",
        maxHeight: "95vh",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">Promo: {promocion.denominacion}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {imagenesPromocionArray.length > 0 && (
            <Card>
              <CardMedia
                component="img"
                height="100%"
                image={imagenesPromocionArray[0].url}
                alt={promocion.denominacion}
              />
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ width: "100%", height: "100%" }}>
              <Typography sx={{ height: 160 }} variant="h6">
                Descripción: {promocion.descripcionDescuento}
              </Typography>
              <Typography sx={{ height: 50 }} variant="h6">
                Desde: {promocion.fechaDesde.toLocaleDateString()} - {formatHora(promocion.horaDesde)}
              </Typography>
              <Typography sx={{ height: 130 }} variant="h6">
                Hasta: {promocion.fechaHasta.toLocaleDateString()} - {formatHora(promocion.horaHasta)}
              </Typography>
              <Typography variant="h6">
                Precio Promocional: ${promocion.precioPromocional}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4">Detalles de la Promoción:</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {detallesArray.map((detalle) => (
                  <TableRow key={detalle.id}>
                    <TableCell>
                      <Typography variant="h5">
                        {detalle.articulo.denominacion}
                      </Typography>
                      <Typography variant="h6">
                        <span>Cantidad: {detalle.cantidad} </span>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {Array.from(detalle.articulo.imagenesArticulo).length > 0 && (
                        <CardMedia
                          component="img"
                          image={Array.from(detalle.articulo.imagenesArticulo)[0].url}
                          alt={detalle.articulo.denominacion}
                          sx={{ maxWidth: 150, maxHeight: 150 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetallesPromo;
