import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<EmpresaPage />} />
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
    </BrowserRouter>
  );
}

export default App;

