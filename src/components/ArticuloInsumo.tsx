import React from 'react';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import '../styles/Articulo.css';


const Insumo: React.FC<{ articulo: ArticuloInsumo }> = ({ articulo }) => {
    const imagenesArray = Array.from(articulo.imagenesArticulo);
    const primeraImagen = imagenesArray[0]?.url;
  
    return (
      <li className="row">
        <div className="col">
          <p>{articulo.denominacion}</p>
        </div>
        <div className="col">
          {primeraImagen && <img className="img" src={primeraImagen} alt={articulo.denominacion} />}
        </div>
        <div className="col">
          <p>$ {articulo.precioCompra}</p>
        </div>
        <div className="col">
          <p>{articulo.stockActual}</p>
        </div>
        <div className="col">
          <p>{articulo.stockMaximo}</p>
        </div>
        <div className="col">
        <p>{articulo.esParaElaborar ? "Sí" : "No"}</p>
        </div>
      </li>
    );
  };
  
  export default Insumo;