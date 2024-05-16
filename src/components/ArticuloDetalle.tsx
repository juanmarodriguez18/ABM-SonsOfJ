// src/pages/ArticuloDetalle.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticulosManufacturados } from '../services/api';
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';
import { ArticuloManufacturadoDetalle } from '../types/ArticuloManufacturadoDetalle';
import '../styles/ArticuloDetalle.css';

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
      <h2>{articulo.denominacion}</h2>
      <p>Precio de Venta: ${articulo.precioVenta}</p>
      <p>Descripción: {articulo.descripcion}</p>
      <p>Tiempo Estimado: {articulo.tiempoEstimadoMinutos} minutos</p>
      <p>Preparación: {articulo.preparacion}</p>
      {imagenesArticuloArray.length > 0 && (
        <img src={imagenesArticuloArray[0].url} alt={articulo.denominacion} />
      )}
      <h3>Detalles del Artículo</h3>
      <ul>
        {detallesArray.map(detalle => (
          <li key={detalle.id}>
            <p>Insumo: {detalle.articuloInsumo.denominacion}</p>
            <p>Cantidad: {detalle.cantidad} {detalle.articuloInsumo.unidadMedida.denominacion}</p>
            {Array.from(detalle.articuloInsumo.imagenesArticulo).length > 0 && (
              <img
                src={Array.from(detalle.articuloInsumo.imagenesArticulo)[0].url}
                alt={detalle.articuloInsumo.denominacion}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticuloDetalle;


