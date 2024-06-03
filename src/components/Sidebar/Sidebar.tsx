import React from "react";
import { Box, Button, List, ListItem } from "@mui/material";
import {
  Fastfood as FastfoodIcon,
  MonetizationOn as MonetizationOnIcon,
  Store as StoreIcon,
  Group as GroupIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

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
              Unidades de Medida
            </Button>
          </ListItem>
        </SidebarItem>
        <SidebarItem icon={<MonetizationOnIcon />} text="Promociones" />
        <SidebarItem icon={<StoreIcon />} text="Sucursales" />
        <SidebarItem icon={<GroupIcon />} text="Empleados" />
      </List>
    </Box>
  );
};

export default Sidebar;
