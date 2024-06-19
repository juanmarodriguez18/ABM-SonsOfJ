import React, { useState } from "react";
import { Box, Button, List, ListItem, Badge } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Fastfood as FastfoodIcon,
  MonetizationOn as MonetizationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Assignment as AssignmentIcon,
  Grading as GradingIcon,
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  Apartment as ApartmentIcon,
  Store as StoreIcon,
  AddBusiness as AddBusinessIcon,
  Group as GroupIcon,
  Egg as EggIcon,
  LunchDining as LunchDiningIcon,
  EggAlt as EggAltIcon,
  Straighten as StraightenIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../Carrito/useCarrito"; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import "../../styles/InsumoFormulario.css";
import { usePedidos } from "../Pedido/PedidosContext";
import { Estado } from "../../types/enums/Estado";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCarrito();
  const { pedidos } = usePedidos();

  // Función para contar la cantidad de pedidos en cada estado
  const contarPedidosPorEstado = (estado: Estado): number => {
    return pedidos.filter((pedido) => pedido.estado === estado).length;
  };

  // Calcula la cantidad de pedidos en cada estado
  const cantidadPendientes = contarPedidosPorEstado(Estado.PENDIENTE);
  const cantidadEnPreparacion = contarPedidosPorEstado(Estado.PREPARACION);
  const cantidadEnDelivery = contarPedidosPorEstado(Estado.EN_DELIVERY);
  const cantidadParaEntregar = contarPedidosPorEstado(Estado.LISTO_PARA_ENTREGA);
  const cantidadCajero = cantidadPendientes + cantidadParaEntregar;

  const cantidadTotal = cart.reduce((total, item) => total + item.cantidad, 0);

  const [maxHeight, setMaxHeight] = useState("97vh");

  const buttonStyles = {
    color: "#555",
    fontSize: 12,
    pl: 2,
    borderRadius: 8,
    textTransform: "none",
    "&:hover": {
      bgcolor: "#eee",
      color: "#3f51b5",
    },
  };

  return (
    <>
      <Box
        className="smooth-scrollbar"
        sx={{
          bgcolor: "#eee",
          margin: 0,
          width: 270,
          height: "100vh",
          maxHeight: maxHeight,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          overflowY: "scroll",
          alignItems: "center",
          transition: "max-height 0.5s ease", // Transición suave para max-height
          //justifyContent: "center",
        }}
        onMouseEnter={() => setMaxHeight("97vh")}
        onMouseLeave={() => setMaxHeight("calc(97vh - 50px)")} // Ajusta la altura al salir
      >
        <Box
          component="img"
          src="/img/Logo_BuenSabor.png" // Asegúrate de que la imagen esté en public/img
          alt="Logo Buen Sabor"
          sx={{
            width: "80%",
            height: "auto",
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 2, // Espacio debajo de la imagen
          }}
        />
        <List sx={{ width: "100%" }}>
          <SidebarItem icon={<DashboardIcon />} text="Dashboard" />
          <SidebarItem icon={<RestaurantMenuIcon />} text="Menú">
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<FastfoodIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/grilla")}
              >
                Lista Menú
              </Button>
            </ListItem>
          </SidebarItem>
          <SidebarItem icon={<MonetizationOnIcon />} text="Promociones">
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<AttachMoneyIcon />}
                sx={buttonStyles}
                onClick={() => navigate("")}
              >
                Listado de Promociones
              </Button>
            </ListItem>
          </SidebarItem>
          <SidebarItem icon={<AssignmentIcon />} text="Pedidos">
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<GradingIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/pedidos")}
              >
                Listado de pedidos
              </Button>
            </ListItem>
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={
                  <Badge badgeContent={cantidadCajero} color="primary">
                    <GradingIcon sx={{ fontSize: 20 }} />
                  </Badge>}
                sx={buttonStyles}
                onClick={() => navigate("/cajeroPedidos")}
              >
                Cajero Pedidos
              </Button>
            </ListItem>
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={
                  <Badge badgeContent={cantidadEnPreparacion} color="primary">
                    <GradingIcon sx={{ fontSize: 20 }} />
                  </Badge>}
                sx={buttonStyles}
                onClick={() => navigate("/cocineroPedidos")}
              >
                Cocinero Pedidos
              </Button>
            </ListItem>
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={
                  <Badge badgeContent={cantidadEnDelivery} color="primary">
                    <GradingIcon  sx={{ fontSize: 20 }} />
                  </Badge>}
                sx={buttonStyles}
                onClick={() => navigate("/deliveryPedidos")}
              >
                Delivery Pedidos
              </Button>
            </ListItem>
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={
                  <Badge badgeContent={cantidadTotal} color="primary">
                    <ShoppingCartIcon sx={{ fontSize: 20 }} />
                  </Badge>
                }
                sx={buttonStyles}
                onClick={() => navigate("/carrito")}
              >
                Carrito
              </Button>
            </ListItem>
          </SidebarItem>
          <SidebarItem icon={<BusinessIcon />} text="Empresas">
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<ApartmentIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/empresas")}
              >
                Lista de Empresas
              </Button>
            </ListItem>
          </SidebarItem>
          <SidebarItem icon={<StoreIcon />} text="Sucursales">
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<AddBusinessIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/empresas")}
              >
                Lista de Sucursales
              </Button>
            </ListItem>
          </SidebarItem>
          <SidebarItem icon={<GroupIcon />} text="Empleados" />
          <SidebarItem icon={<EggIcon />} text="Articulos">
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<LunchDiningIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/articulos")}
              >
                Manufacturados
              </Button>
            </ListItem>
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<EggAltIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/insumos")}
              >
                Insumos
              </Button>
            </ListItem>
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<StraightenIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/unidades-medida")}
              >
                Unidades Medida
              </Button>
            </ListItem>
            <ListItem>
              <Button
                disableRipple
                disableTouchRipple
                className="btn-list-sidebar"
                startIcon={<CategoryIcon />}
                sx={buttonStyles}
                onClick={() => navigate("/categorias")}
              >
                Categorias
              </Button>
            </ListItem>
          </SidebarItem>
        </List>
        <List sx={{ height: 150 }} />
      </Box>
    </>
  );
};

export default Sidebar;
