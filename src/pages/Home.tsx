import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const Home = () => {
  return (
    <>
      {/* Contenido principal */}
      <Container sx={{ mt: 4, height: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Bienvenidos a El Buen Sabor
        </Typography>
        <Typography variant="body1" paragraph>
          "Gestionando la excelencia en cada plato, cada día."
        </Typography>

        {/* Sección de actividades */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Lo que puedes hacer:
        </Typography>
        <Grid container spacing={2}>
          {/* Administrar pedidos */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image="https://i.postimg.cc/W18j32Y7/administrarpedidos.jpg"
                alt="Administrar pedidos"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Administrar pedidos
                </Typography>
                <Typography variant="body2">
                  Gestiona y visualiza los pedidos realizados.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Gestionar Articulos */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image="https://i.postimg.cc/k5hmQTm6/ingredientes.jpg"
                alt="Gestionar artículos"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Gestionar artículos
                </Typography>
                <Typography variant="body2">
                  Administra y gestiona los artículos y los ingredientes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Manejar Sucursales */}
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="240"
                image="https://i.postimg.cc/k55CRkkP/sucursales.jpg"
                alt="Manejar sucursales"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Manejar sucursales
                </Typography>
                <Typography variant="body2">
                  Gestiona y administra las empresas y sus sucursales.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Botón de ver más */}
        <Box sx={{ mt: 4, textAlign: "center" }}></Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 4,
          py: 3,
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} El Buen Sabor. Todos los derechos
          reservados.
        </Typography>
      </Box>
    </>
  );
};

export default Home;
