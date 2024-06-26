import React, { useState, useEffect } from "react";
import { Box, Button, List, ListItem, Badge } from "@mui/material";
import {
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
  Badge as BadgeIcon,
} from "@mui/icons-material";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../Carrito/useCarrito"; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import "../../styles/InsumoFormulario.css";
import { usePedidos } from "../Pedido/PedidosContext";
import { Estado } from "../../types/enums/Estado";
import { useAuth } from "../ControlAcceso/AuthContext";
import { Rol } from "../../types/enums/Rol";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCarrito();
  const { pedidosBySucursal } = usePedidos();
  const { empleado } = useAuth();
  const [maxHeight, setMaxHeight] = useState("97vh");
  const [cantidadPendientes, setCantidadPendientes] = useState(0);
  const [cantidadEnPreparacion, setCantidadEnPreparacion] = useState(0);
  const [cantidadEnDelivery, setCantidadEnDelivery] = useState(0);
  const [cantidadParaEntregar, setCantidadParaEntregar] = useState(0);
  const [cantidadEntregado, setCantidadEntregado] = useState(0);
  const [cantidadCajero, setCantidadCajero] = useState(0);

  // Función para contar la cantidad de pedidos en cada estado por sucursal
  const contarPedidosPorEstadoYSucursal = async (estado: Estado) => {
    if (!empleado?.sucursal) return;

    try {
      const pedidos = await pedidosBySucursal(empleado.sucursal.id);
      const cantidad = pedidos.filter((pedido) => pedido.estado === estado).length;

      switch (estado) {
        case Estado.PENDIENTE:
          setCantidadPendientes(cantidad);
          break;
        case Estado.PREPARACION:
          setCantidadEnPreparacion(cantidad);
          break;
        case Estado.EN_DELIVERY:
          setCantidadEnDelivery(cantidad);
          break;
        case Estado.LISTO_PARA_ENTREGA:
          setCantidadParaEntregar(cantidad);
          break;
        case Estado.ENTREGADO:
          setCantidadEntregado(cantidad);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error al obtener pedidos por sucursal para estado ${estado}:`, error);
    }
  };

  // Cargar cantidades al montar el componente o al cambiar la sucursal del empleado
  useEffect(() => {
    const estados = [
      Estado.PENDIENTE,
      Estado.PREPARACION,
      Estado.EN_DELIVERY,
      Estado.LISTO_PARA_ENTREGA,
      Estado.ENTREGADO,
    ];

    const intervalId = setInterval(() => {
      estados.forEach(contarPedidosPorEstadoYSucursal);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [empleado?.sucursal]); // Volver a cargar si cambia la sucursal del empleado

  // Calcular cantidad total para Cajero Pedidos
  useEffect(() => {
    setCantidadCajero(cantidadPendientes + cantidadParaEntregar + cantidadEntregado);
  }, [cantidadPendientes, cantidadParaEntregar, cantidadEntregado]);

  const cantidadTotal = cart.reduce((total, item) => total + item.cantidad, 0);

  useEffect(() => {
    if (empleado && empleado.tipoEmpleado === Rol.EMPLEADO_COMUN) {
      setMaxHeight("calc(97vh - 50px)");
    } else {
      setMaxHeight("97vh");
    }
  }, [empleado]);

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
          {empleado && empleado.tipoEmpleado === Rol.ADMIN && (
            <>
              <SidebarItem icon={<RestaurantMenuIcon />} text="Menú">
                <ListItem>
                  <Button
                    disableRipple
                    disableTouchRipple
                    className="btn-list-sidebar"
                    startIcon={<FastfoodIcon />}
                    sx={buttonStyles}
                    onClick={() => navigate("/grilla-manufacturados")}
                  >
                    Lista Menú
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
            </>
          )}
          {empleado && empleado.tipoEmpleado === Rol.ADMIN && (
            <>
              <SidebarItem icon={<MonetizationOnIcon />} text="Promociones">
                <ListItem>
                  <Button
                    disableRipple
                    disableTouchRipple
                    className="btn-list-sidebar"
                    startIcon={<AttachMoneyIcon />}
                    sx={buttonStyles}
                    onClick={() => navigate("/grilla-promociones")}
                  >
                    Listado de Promociones
                  </Button>
                </ListItem>
              </SidebarItem>
            </>
          )}
          {empleado && empleado.tipoEmpleado !== Rol.EMPLEADO_COMUN && (
            <>
              <SidebarItem icon={<AssignmentIcon />} text="Pedidos">
              {empleado && empleado.tipoEmpleado === Rol.ADMIN && (
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
              )}
              {/* Cajero Pedidos */}
              {(empleado.tipoEmpleado === Rol.ADMIN || empleado.tipoEmpleado === Rol.CAJERO) && (
                <ListItem>
                  <Button
                    disableRipple
                    disableTouchRipple
                    className="btn-list-sidebar"
                    startIcon={
                      <Badge badgeContent={cantidadCajero} color="primary">
                        <GradingIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    }
                    sx={buttonStyles}
                    onClick={() => navigate("/cajeroPedidos")}
                  >
                    Cajero Pedidos
                  </Button>
                </ListItem>
              )}
              {/* Cocinero Pedidos */}
              {(empleado.tipoEmpleado === Rol.ADMIN || empleado.tipoEmpleado === Rol.COCINERO) && ( 
                <ListItem>
                  <Button
                    disableRipple
                    disableTouchRipple
                    className="btn-list-sidebar"
                    startIcon={
                      <Badge badgeContent={cantidadEnPreparacion} color="primary">
                        <GradingIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    }
                    sx={buttonStyles}
                    onClick={() => navigate("/cocineroPedidos")}
                  >
                    Cocinero Pedidos
                  </Button>
                </ListItem>
              )}
              {/* Delivery Pedidos */}
              {(empleado.tipoEmpleado === Rol.ADMIN || empleado.tipoEmpleado === Rol.DELIVERY) && (
                <ListItem>
                  <Button
                    disableRipple
                    disableTouchRipple
                    className="btn-list-sidebar"
                    startIcon={
                      <Badge badgeContent={cantidadEnDelivery} color="primary">
                        <GradingIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    }
                    sx={buttonStyles}
                    onClick={() => navigate("/deliveryPedidos")}
                  >
                    Delivery Pedidos
                  </Button>
                </ListItem>
              )}
              </SidebarItem>
            </>
          )}
          {empleado && empleado.tipoEmpleado === Rol.ADMIN && (
          <>
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
          </>
          )}
          {empleado && empleado.tipoEmpleado === Rol.ADMIN && (
          <>
            <SidebarItem icon={<StoreIcon />} text="Sucursales">
              <ListItem>
                <Button
                  disableRipple
                  disableTouchRipple
                  className="btn-list-sidebar"
                  startIcon={<AddBusinessIcon />}
                  sx={buttonStyles}
                  onClick={() => navigate("/sucursales")}
                >
                  Lista de Sucursales
                </Button>
              </ListItem>
            </SidebarItem>
          </>
          )}
          {empleado && empleado.tipoEmpleado === Rol.ADMIN && (
            <SidebarItem icon={<GroupIcon />} text="Empleados">
              <ListItem>
                <Button
                  disableRipple
                  disableTouchRipple
                  className="btn-list-sidebar"
                  startIcon={<BadgeIcon />}
                  sx={buttonStyles}
                  onClick={() => navigate("/grillaEmpleados")}
                >
                  Gestión Empleados
                </Button>
              </ListItem>
            </SidebarItem>
          )}
          {empleado && (empleado.tipoEmpleado === Rol.ADMIN || empleado.tipoEmpleado === Rol.COCINERO) && (
          <>
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
              {empleado.tipoEmpleado === Rol.ADMIN && (
              <>
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
              </>
              )}
            </SidebarItem>
          </>
          )}
          {empleado && empleado.tipoEmpleado === Rol.ADMIN && (
            <SidebarItem icon={<AssignmentIcon />} text="Reportes">
              <ListItem>
                <Button
                  disableRipple
                  disableTouchRipple
                  className="btn-list-sidebar"
                  startIcon={<AssignmentIcon />}
                  sx={buttonStyles}
                  onClick={() => navigate("/reportes")}
                >
                  Reporte
                  Estadistica
                </Button>
              </ListItem>
            </SidebarItem>
          )}
        </List>
        <List sx={{ height: 150 }} />
      </Box>
    </>
  );
};

export default Sidebar;
