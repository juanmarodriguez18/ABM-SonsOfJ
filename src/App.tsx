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
import Header from "./components/Header/Header";
import { AuthenticationGuard } from "./components/Auth0/AuthenticationGuard";
import AdminPage from "./pages/ViewsAuth0/AdminPage";
import ClientPage from "./pages/ViewsAuth0/ClientPage";
import ClientProfilePage from "./pages/ViewsAuth0/ClientProfilePage";
import CallbackPage from "./components/Auth0/CallbackPage";
import ErrorPage from "./pages/ViewsAuth0/ErrorPage";
import Home from "./pages/Home";
import SucursalPage from "./pages/SucursalPage";


function App() {
  return (
    <Layout>
      <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={<AuthenticationGuard component={AdminPage} />}
        />
        <Route
          path="/cliente"
          element={<AuthenticationGuard component={ClientPage} />}
        />
        <Route
          path="/cliente/perfil"
          element={<AuthenticationGuard component={ClientProfilePage} />}
        />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="*" element={<ErrorPage />} />

          <Route path="/empresas" element={<EmpresaPage />} />
          <Route path="/sucursales" element={<SucursalPage />} />
          <Route path="/articulos" element={<ArticulosPage />} />
          <Route path="/articulos/:id" element={<ArticuloDetalle />} />
          <Route path="/insumos" element={<InsumoPage />} />
          <Route path="/unidades-medida" element={<UnidadesMedidaPage />} />
          <Route path="/categorias" element={<CategoriaPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/grilla-manufacturados" element={<GrillaManufacturados />} />
          <Route path="/grilla-promociones" element={<GrillaPromociones />} />
          <Route path="/cajeroPedidos" element={<CajeroPedidos />} />
          <Route path="/cocineroPedidos" element={<CocineroPedidos />} />
          <Route path="/deliveryPedidos" element={<DeliveryPedidos />} />
        </Routes>
    </Layout>
  );
}

export default App;

