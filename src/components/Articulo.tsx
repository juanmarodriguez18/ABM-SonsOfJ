import React from 'react';
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';
import { Link } from 'react-router-dom';


const Articulo: React.FC<{ articulo: ArticuloManufacturado }> = ({ articulo }) => {
    const imagenesArray = Array.from(articulo.imagenesArticulo);
    const primeraImagen = imagenesArray[0]?.url;
  
    return (
      <li>
        <h3>{articulo.denominacion}</h3>
        {primeraImagen && <img src={primeraImagen} alt={articulo.denominacion} />}
        <p>{articulo.descripcion}</p>
        <p>Precio: ${articulo.precioVenta}</p>
        <p>Tiempo estimado: {articulo.tiempoEstimadoMinutos} minutos</p>
        <Link to={`/articulos/${articulo.id}`}>
            <button>Detalles</button>
        </Link>
      </li>
    );
  };
  
  export default Articulo;
