import React, { useEffect, useState } from 'react';
import { getArticulosManufacturados } from '../services/api';
import Articulo from './Articulo';
import SearchBar from './SearchBar';
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';

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
      <ul>
        {filteredArticulos.map(articulo => (
          <Articulo key={articulo.id} articulo={articulo} />
        ))}
      </ul>
    </div>
  );
};

export default ArticuloList;
