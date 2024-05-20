import React from 'react';
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';
import { Link } from 'react-router-dom';
import '../styles/Articulo.css';


const Articulo: React.FC<{ articulo: ArticuloManufacturado }> = ({ articulo }) => {
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
          <p>{articulo.descripcion}</p>
        </div>
        <div className="col">
          <p>${articulo.precioVenta}</p>
        </div>
        <div className="col">
          <p>{articulo.tiempoEstimadoMinutos} minutos</p>
        </div>
        <div className="col">
          <Link to={`/articulos/${articulo.id}`}>
              <button className='btn-Guardar'>Detalles</button>
          </Link>
        </div>
      </li>
    );
  };
  
  export default Articulo;
