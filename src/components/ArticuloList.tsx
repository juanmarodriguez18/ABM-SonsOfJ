import React, { useEffect, useState } from 'react';
import { getArticulosManufacturados } from '../services/ArticuloManufacturadoService';
import Articulo from './Articulo';
import SearchBar from './SearchBar';
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';
import '../styles/Articulo.css';

const ArticuloList: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filteredArticulos, setFilteredArticulos] = useState<ArticuloManufacturado[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getArticulosManufacturados();
      setArticulos(data);
      setFilteredArticulos(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredArticulos(
      articulos.filter(articulo =>
        articulo.denominacion.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, articulos]);

  return (
    <div>
      <SearchBar onSearch={setQuery} />
      <li className="row">
        <div className="col">
          <b>Denominacion:</b>
        </div>
        <div className="col">
          <b>Imagen:</b>
        </div>
        <div className="col">
          <b>Descripción:</b>
        </div>
        <div className="col">
          <b>Precio:</b>
        </div>
        <div className="col">
          <b>Tiempo estimado:</b>
        </div>
        <div className="col">
          <b>Mas:</b>
        </div>
      </li>
      <ul>
        {filteredArticulos.map(articulo => (
          <Articulo key={articulo.id} articulo={articulo} />
        ))}
      </ul>
    </div>
  );
};

export default ArticuloList;
