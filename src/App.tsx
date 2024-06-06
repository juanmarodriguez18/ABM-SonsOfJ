import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticulosPage from "./pages/ArticulosPage";
import ArticuloDetalle from "./components/ArticulosManufacturados/ArticuloDetalle";
import InsumoPage from "./pages/InsumoPage";
import UnidadesMedidaPage from "./pages/UnidadMedidaPage";
import Home from "./pages/Home";
import Layout from "./components/Layout/Layout";
import { PedidosPage } from "./pages/PedidosPage";
import { Carrito } from "./components/Carrito/Carrito";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articulos" element={<ArticulosPage />} />
          <Route path="/articulos/:id" element={<ArticuloDetalle />} />
          <Route path="/insumos" element={<InsumoPage />} />
          <Route path="/unidades-medida" element={<UnidadesMedidaPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
