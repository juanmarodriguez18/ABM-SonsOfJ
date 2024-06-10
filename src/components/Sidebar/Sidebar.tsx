import React from "react";
import { Box, Button, List, ListItem, Badge } from "@mui/material";
import {
  Fastfood as FastfoodIcon,
  MonetizationOn as MonetizationOnIcon,
  Store as StoreIcon,
  Group as GroupIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon
} from "@mui/icons-material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../Carrito/useCarrito"; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCarrito();

  const cantidadTotal = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <Box
      sx={{
        bgcolor: "#eee",
        margin: 0,
        width: 170,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      <List sx={{ width: "100%" }}>
        <SidebarItem icon={<DashboardIcon />} text="Dashboard" />
        <SidebarItem icon={<FastfoodIcon />} text="Productos">
          <ListItem>
            <Button
              disableRipple
              disableTouchRipple
              className="btn-list-sidebar"
              sx={{
                color: "#555",
                fontSize: 12,
                pl: 2,
                borderRadius: 8,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#eee",
                  color: "#3f51b5",
                },
              }}
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
              sx={{
                color: "#555",
                fontSize: 12,
                pl: 2,
                borderRadius: 8,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#eee",
                  color: "#3f51b5",
                },
              }}
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
              sx={{
                color: "#555",
                fontSize: 12,
                pl: 2,
                borderRadius: 8,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#eee",
                  color: "#3f51b5",
                },
              }}
              onClick={() => navigate("/unidades-medida")}
            >
              Unidades Medida
            </Button>
          </ListItem>
        </SidebarItem>
        <SidebarItem icon={<MonetizationOnIcon />} text="Promociones" />
        <SidebarItem icon={<StoreIcon />} text="Sucursales" />
        <SidebarItem icon={<GroupIcon />} text="Empleados" />
        <SidebarItem icon={<AssignmentIcon />} text="Pedidos">
          <ListItem>
            <Button
              disableRipple
              disableTouchRipple
              className="btn-list-sidebar"
              sx={{
                color: "#555",
                fontSize: 12,
                pl: 2,
                borderRadius: 8,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#eee",
                  color: "#3f51b5",
                },
              }}
              onClick={() => navigate("/pedidos")}
            >
              Listado pedidos
            </Button>
          </ListItem>
        <ListItem>
          <Button
            disableRipple
            disableTouchRipple
            className="btn-list-sidebar"
            sx={{
              color: "#555",
              fontSize: 12,
              pl: 2,
              borderRadius: 8,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#eee",
                color: "#3f51b5",
              },
            }}
            onClick={() => navigate("/grilla")}
          >
            Grilla
          </Button>
        </ListItem>
        <ListItem>
          <Button
            disableRipple
            disableTouchRipple
            className="btn-list-sidebar"
            sx={{
              color: "#555",
              fontSize: 12,
              pl: 2,
              borderRadius: 8,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#eee",
                color: "#3f51b5",
              },
            }}
            onClick={() => navigate("/carrito")}
          >
            Carrito
            <Badge badgeContent={cantidadTotal} color="primary">
              <ShoppingCartIcon sx={{ ml: 1 }} />
            </Badge>
          </Button>
        </ListItem>
        </SidebarItem>
      </List>
    </Box>
  );
};

export default Sidebar;
