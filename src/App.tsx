import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticulosPage from "./pages/ArticulosPage";
import ArticuloDetalle from "./components/ArticulosManufacturados/ArticuloDetalle";
import InsumoPage from "./pages/InsumoPage";
import UnidadesMedidaPage from "./pages/UnidadMedidaPage";
import Home from "./pages/Home";

function App() {
  //Rutas de nuestra aplicación
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articulos" Component={ArticulosPage} />
        <Route path="/articulos/:id" element={<ArticuloDetalle />} />
        <Route path="/insumos" Component={InsumoPage} />
        <Route path="/unidades-medida" Component={UnidadesMedidaPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

