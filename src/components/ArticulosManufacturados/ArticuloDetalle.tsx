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
} from "@mui/material";
import { AttachMoney, AccessTime } from "@mui/icons-material";
import { getArticuloManufacturadoById } from "../../services/ArticuloManufacturadoService";
import { ArticuloManufacturado } from "../../types/ArticuloManufacturado";
import { ArticuloManufacturadoDetalle } from "../../types/ArticuloManufacturadoDetalle";

const ArticuloDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [articulo, setArticulo] = useState<ArticuloManufacturado | null>(null);

  useEffect(() => {
    const fetchArticulo = async () => {
      if (id) {
        const data: ArticuloManufacturado =
          await getArticuloManufacturadoById(parseInt(id, 10));
        setArticulo(data);
      }
    };

    fetchArticulo();
  }, [id]);

  if (!id) {
    return <div>ID no proporcionado</div>;
  }

  if (!articulo) {
    return <CircularProgress />;
  }

  const imagenesArticuloArray = Array.from(articulo.imagenesArticulo);
  const detallesArray: ArticuloManufacturadoDetalle[] = Array.from(
    articulo.articuloManufacturadoDetalles
  );

  return (
    <Container
    sx={{
      borderRadius: 8,
      width: "100%",
      marginTop: 2,
      bgcolor: "#eee",
      boxShadow: 2,
      overflowY: "auto", maxHeight: "95vh" 
    }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2">{articulo.denominacion}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {imagenesArticuloArray.length > 0 && (
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={imagenesArticuloArray[0].url}
                alt={articulo.denominacion}
              />
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{width: 400, height: 400}}>
              <Typography sx={{height: 100}} variant="h6">Descripción: {articulo.descripcion}</Typography>
              <Typography sx={{height: 50}} variant="h6">Precio: ${articulo.precioVenta}</Typography>
              <Typography sx={{height: 50}} variant="h6">
                <AccessTime /> Demora: {articulo.tiempoEstimadoMinutos} minutos
              </Typography>
              <Typography variant="h6">Preparación: {articulo.preparacion}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h3">Insumos:</Typography>
          {detallesArray.map((detalle) => (
            <Card key={detalle.id} style={{ marginBottom: 20 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h4" sx={{height: 100, textAlign: "right" }}>{detalle.articuloInsumo.denominacion}</Typography>
                    <Typography variant="h5" sx={{height: 100, textAlign: "right" }}>
                      <AttachMoney /> Cantidad: {detalle.cantidad}{" "}{detalle.articuloInsumo.unidadMedida.denominacion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {Array.from(detalle.articuloInsumo.imagenesArticulo).length > 0 && (
                      <Card>
                        <CardMedia
                          component="img"
                          height="300"
                          image={Array.from(detalle.articuloInsumo.imagenesArticulo)[0].url}
                          alt={detalle.articuloInsumo.denominacion}
                        />
                      </Card>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArticuloDetalle;
