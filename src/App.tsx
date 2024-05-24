import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./components/NavBar/NavBar";
import ArticulosPage from "./pages/ArticulosPage";
import ArticuloDetalle from "./components/ArticulosManufacturados/ArticuloDetalle";
import InsumoPage from "./pages/InsumoPage";
import UnidadesMedida from "./components/UnidadesMedida/UnidadMedida";



function App() {
  //Rutas de nuestra aplicacion 
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" Component={ArticulosPage} />
        <Route path="/articulos" Component={ArticulosPage} />
        <Route path="/articulos/:id" element={<ArticuloDetalle />} />
        <Route path="/insumos" Component={InsumoPage} />
        <Route path="/unidades-medida" element={<UnidadesMedida/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
