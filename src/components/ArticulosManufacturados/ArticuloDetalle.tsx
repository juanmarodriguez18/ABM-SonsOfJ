// src/pages/ArticuloDetalle.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticulosManufacturados } from '../../services/ArticuloManufacturadoService';
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { ArticuloManufacturadoDetalle } from '../../types/ArticuloManufacturadoDetalle';
import '../../styles/ArticuloDetalle.css';

const ArticuloDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [articulo, setArticulo] = useState<ArticuloManufacturado | null>(null);

  useEffect(() => {
    const fetchArticulo = async () => {
      if (id) {
        const data: ArticuloManufacturado[] = await getArticulosManufacturados();
        const foundArticulo = data.find((art: ArticuloManufacturado) => art.id === parseInt(id, 10));
        setArticulo(foundArticulo || null);
      }
    };

    fetchArticulo();
  }, [id]);

  if (!id) {
    return <div>ID no proporcionado</div>;
  }

  if (!articulo) {
    return <div>Cargando...</div>;
  }

  const imagenesArticuloArray = Array.from(articulo.imagenesArticulo);
  const detallesArray: ArticuloManufacturadoDetalle[] = Array.from(articulo.articuloManufacturadoDetalles);

  return (
    <div>
      <li className="row">
        <div className="col">
          <h2>{articulo.denominacion}</h2>
        </div>
        <div className="col">
          {imagenesArticuloArray.length > 0 && (
        	<img className="img" src={imagenesArticuloArray[0].url} alt={articulo.denominacion} />
      	)}
        </div>
        <div className="col">
          <p>Descripción: {articulo.descripcion}</p>
        </div>
        <div className="col">
          <p>Precio: ${articulo.precioVenta}</p>
        </div>
        <div className="col">
          <p>Demora: {articulo.tiempoEstimadoMinutos} minutos</p>
        </div>
        <div className="col">
          <p>Preparación: {articulo.preparacion}</p>
        </div>
      </li>
      <h3>Insumos</h3>
      <ul>
        {detallesArray.map(detalle => (
          <li className="row"key={detalle.id}>
            <div className="col">
              <p>{detalle.articuloInsumo.denominacion}</p>
            </div>
            <div className="col">
            {Array.from(detalle.articuloInsumo.imagenesArticulo).length > 0 && (
              <img className='img'
                src={Array.from(detalle.articuloInsumo.imagenesArticulo)[0].url}
                alt={detalle.articuloInsumo.denominacion}
              />
              )}
            </div>
            <div className="col">
              <p>Cantidad: {detalle.cantidad} {detalle.articuloInsumo.unidadMedida.denominacion}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticuloDetalle;


