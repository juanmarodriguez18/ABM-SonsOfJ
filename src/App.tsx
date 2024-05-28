import { BrowserRouter, Routes, Route } from "react-router-dom";
import ArticulosPage from "./pages/ArticulosPage";
import ArticuloDetalle from "./components/ArticulosManufacturados/ArticuloDetalle";
import InsumoPage from "./pages/InsumoPage";
import UnidadesMedida from "./components/UnidadesMedida/UnidadMedida";
import Home from "./pages/Home";

function App() {
  //Rutas de nuestra aplicacion
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articulos" Component={ArticulosPage} />
        <Route path="/articulos/:id" element={<ArticuloDetalle />} />
        <Route path="/insumos" Component={InsumoPage} />
        <Route path="/unidades-medida" element={<UnidadesMedida />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
