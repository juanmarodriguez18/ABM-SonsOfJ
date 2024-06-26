import { Routes, Route } from "react-router-dom";
import ArticulosPage from "./pages/ArticulosPage";
import InsumoPage from "./pages/InsumoPage";
import UnidadesMedidaPage from "./pages/UnidadMedidaPage";
import Layout from "./components/Layout/Layout";
import EmpresaPage from "./pages/EmpresaPage";
import { Carrito } from "./components/Carrito/Carrito";
import GrillaManufacturados from "./components/ArticulosManufacturados/GrillaManufacturados";
import GrillaPromociones from "./components/Promocion/GrillaPromociones";
import PedidosPage from "./pages/PedidosPage";
import ArticuloDetalle from "./components/ArticuloManufacturadoDetalles/ArticuloDetalle";
import CajeroPedidos from "./pages/Cajero/CajeroPedidos";
import CocineroPedidos from "./pages/Cocinero/CocineroPedidos";
import DeliveryPedidos from "./pages/Delivery/DeliveryPedidos";
import CategoriaPage from "./pages/CategoriaPage";
import SucursalPage from "./pages/SucursalPage";
import  {RutaPrivada}  from "./components/ControlAcceso/RutaPrivada";
import RolEmpleado from "./components/ControlAcceso/RolEmpleado";
import { Rol } from './types/enums/Rol';
import LoginEmpleado from "./components/ControlAcceso/LoginEmpleado";
import RegisterEmpleado from "./components/ControlAcceso/RegisterEmpleado";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import PerfilEmpleado from "./pages/Empleado/PerfilEmpleado";
import GrillaEmpleados from "./pages/Empleado/GrillaEmpleados";

function App() {
  return (
    <Layout>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<RolEmpleado rol={[Rol.ADMIN, Rol.CAJERO, Rol.COCINERO, Rol.DELIVERY, Rol.EMPLEADO_COMUN]} />}>
          <Route path="/perfilEmpleado" element={<PerfilEmpleado />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/empresas" element={<EmpresaPage />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/grillaEmpleados" element={<GrillaEmpleados />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/sucursales" element={<SucursalPage />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN, Rol.COCINERO]} />}>
          <Route path="/articulos" element={<ArticulosPage />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN, Rol.COCINERO]} />}>
          <Route path="/articulos/:id" element={<ArticuloDetalle />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/insumos" element={<InsumoPage />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/unidades-medida" element={<UnidadesMedidaPage />} />
        </Route>
        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/categorias" element={<CategoriaPage />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/carrito" element={<Carrito />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/grilla-manufacturados" element={<GrillaManufacturados />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/grilla-promociones" element={<GrillaPromociones />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN, Rol.CAJERO]} />}>
          <Route path="/cajeroPedidos" element={<CajeroPedidos />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN, Rol.COCINERO]} />}>
          <Route path="/cocineroPedidos" element={<CocineroPedidos />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN, Rol.DELIVERY]} />}>
          <Route path="/deliveryPedidos" element={<DeliveryPedidos />} />
        </Route>

        <Route element={<RolEmpleado rol={[Rol.ADMIN]} />}>
          <Route path="/pedidos" element={<RutaPrivada><PedidosPage /></RutaPrivada>} />
        </Route>

        <Route path="/loginEmpleado" element={<LoginEmpleado />} />
        <Route path="/registerEmpleado" element={<RegisterEmpleado />} />

      </Routes>
    </Layout>
  );
}

export default App;

