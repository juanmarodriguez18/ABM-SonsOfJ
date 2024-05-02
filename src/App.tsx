import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./components/NavBar/NavBar";
import { HomePage } from "./pages/HomePage";
import { Contacto } from "./components/Contacto/Contacto";


function App() {
  //Rutas de nuestra aplicacion 
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/contacto" Component={Contacto} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
