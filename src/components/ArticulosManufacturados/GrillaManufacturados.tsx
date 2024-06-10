import React, { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, Box, IconButton } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { useCarrito } from '../Carrito/useCarrito';
import { getArticulosManufacturados } from '../../services/ArticuloManufacturadoService';

export const GrillaManufacturados: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const { addCarrito, updateCarrito, cart } = useCarrito();

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const data = await getArticulosManufacturados();
        setArticulos(data);
      } catch (error) {
        console.error('Error fetching artículos manufacturados:', error);
      }
    };

    fetchArticulos();
  }, []);

  const handleIncrementarCantidad = (articulo: ArticuloManufacturado) => {
    const currentCantidad = cart.find(item => item.articulo.id === articulo.id)?.cantidad || 0;
    updateCarrito(articulo, currentCantidad + 1);
  };

  const handleDecrementarCantidad = (articulo: ArticuloManufacturado) => {
    const currentCantidad = cart.find(item => item.articulo.id === articulo.id)?.cantidad || 0;
    if (currentCantidad > 0) {
      updateCarrito(articulo, currentCantidad - 1);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tienda Online
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Grid container spacing={4}>
          {articulos.map((articulo) => (
            <Grid item key={articulo.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={Array.from(articulo.imagenesArticulo.values())[0]?.url || ''}
                  alt={articulo.denominacion}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {articulo.denominacion}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {articulo.descripcion}
                  </Typography>
                  <Typography variant="h6" color="textPrimary">
                    ${articulo.precioVenta}
                  </Typography>
                </CardContent>
                <CardActions>
                  {cart.find(item => item.articulo.id === articulo.id)?.cantidad ? (
                    <div className="cantidad-carrito" style={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton size="small" onClick={() => handleDecrementarCantidad(articulo)}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography>{cart.find(item => item.articulo.id === articulo.id)?.cantidad}</Typography>
                      <IconButton size="small" onClick={() => handleIncrementarCantidad(articulo)}>
                        <AddIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => addCarrito(articulo)}>
                      Agregar al Carrito
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default GrillaManufacturados;
