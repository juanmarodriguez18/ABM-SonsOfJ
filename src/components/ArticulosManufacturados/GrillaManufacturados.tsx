import React, { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, Box, IconButton } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { useCarrito } from '../Carrito/useCarrito';
import { getArticulosManufacturados } from '../../services/ArticuloManufacturadoService';
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

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
        Productos Manufacturados
      </Typography>
      <Box sx={{ overflowY: 'auto', maxHeight: '80vh', width: '100%' }}>
        <Box width={1500} display="flex" alignItems="center" mb={2}>
          <Grid container spacing={4}>
            {articulos.map((articulo) => (
              <Grid item key={articulo.id} xs={12} sm={6} md={4} sx={{ maxWidth: '300px' }}>
                <Card sx={{ width: '100%' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={Array.from(articulo.imagenesArticulo.values())[0]?.url || ''}
                    alt={articulo.denominacion}
                  />
                  <CardContent >
                    <Typography gutterBottom variant="h5" component="div">
                      
                    {articulo.denominacion}
                    </Typography>
                    
                    <Typography height={60} variant="body2" color="textSecondary" component="p">
                      {articulo.descripcion}
                    </Typography>
                    <Typography variant="h6" color="textPrimary">
                      ${articulo.precioVenta}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'left', marginLeft: 2, marginBottom:4}}>
                    <Link to={`/articulos/${articulo.id}`}>
                      <InfoIcon
                        sx={{
                          bgcolor: "#FB9553",
                          color: "#FFEDC2",
                          borderRadius: "50%",
                          width: 40,
                          marginRight:2,
                          height: 40,
                          p: 0.1,
                          "&:hover": {
                            bgcolor: "#FB5353",
                          },
                        }}
                      />
                    </Link>
                    {cart.find(item => item.articulo.id === articulo.id)?.cantidad ? (
                      <div className="cantidad-carrito" style={{ marginLeft: 190, display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          sx={{
                            marginRight: 4,
                            color: "#FFFFFF",
                            bgcolor: "#FFA5A5",
                            "&:hover": {
                              bgcolor: "#E82222",
                            },
                          }}
                          size="medium"
                          onClick={() => handleDecrementarCantidad(articulo)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="h5">{" "}{cart.find(item => item.articulo.id === articulo.id)?.cantidad}{" "}</Typography>
                        <IconButton
                          sx={{
                            marginLeft: 4,
                            color: "#FFFFFF",
                            bgcolor: "#93EE9C",
                            "&:hover": {
                              bgcolor: "#3FB94A",
                            },
                          }}
                          size="medium"
                          onClick={() => handleIncrementarCantidad(articulo)}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <Button style={{ marginLeft: 170}} sx={{marginBottom: 0.5}} variant="contained" color="primary" onClick={() => addCarrito(articulo)}>
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
    </Box>
  );
};

export default GrillaManufacturados;
