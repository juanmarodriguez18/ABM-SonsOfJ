import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import '../styles/Articulo.css';
import Insumo from './ArticuloInsumo';
import { getInsumos } from '../services/ArticuloInsumoService';

const InsumoList: React.FC = () => {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [filteredInsumos, setFilteredInsumos] = useState<ArticuloInsumo[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInsumos();
      setInsumos(data);
      setFilteredInsumos(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredInsumos(
      insumos.filter(insumo =>
        insumo.denominacion.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, insumos]);

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
          <b>Precio Compra:</b>
        </div>
        <div className="col">
          <b>Stock Actual:</b>
        </div>
        <div className="col">
          <b>Stock Maximo:</b>
        </div>
        <div className="col">
          <b>Es para elaborar:</b>
        </div>
      </li>
      <ul>
        {filteredInsumos.map(insumo => (
          <Insumo key={insumo.id} articulo={insumo} />
        ))}
      </ul>
    </div>
  );
};

export default InsumoList;