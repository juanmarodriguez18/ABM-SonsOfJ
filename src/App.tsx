import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticulosPage from "./pages/ArticulosPage";
import ArticuloDetalle from "./components/ArticulosManufacturados/ArticuloDetalle";
import InsumoPage from "./pages/InsumoPage";
import UnidadesMedidaPage from "./pages/UnidadMedidaPage";
import Home from "./pages/Home";
import Layout from "./components/Layout/Layout";
import EmpresaPage from "./pages/EmpresaPage";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<EmpresaPage />} />
          <Route path="/articulos" element={<ArticulosPage />} />
          <Route path="/articulos/:id" element={<ArticuloDetalle />} />
          <Route path="/insumos" element={<InsumoPage />} />
          <Route path="/unidades-medida" element={<UnidadesMedidaPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
