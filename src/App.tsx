import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./components/NavBar/NavBar";
import { HomePage } from "./pages/HomePage";
import { Contacto } from "./components/Contacto/Contacto";
import ArticulosPage from "./components/ArticulosPage";
import ArticuloDetalle from "./components/ArticuloDetalle";


function App() {
  //Rutas de nuestra aplicacion 
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/contacto" Component={Contacto} />
        <Route path="/articulos" Component={ArticulosPage} />
        <Route path="/articulos/:id" element={<ArticuloDetalle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
