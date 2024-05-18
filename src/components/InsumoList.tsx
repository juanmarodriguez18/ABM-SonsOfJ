import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import Insumo from './ArticuloInsumo';
import { getInsumos } from '../services/ArticuloInsumoService';
import InsumoFormulario from './InsumoFormulario';
import '../styles/AgregarImagenModal.css';

const InsumoList: React.FC = () => {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [filteredInsumos, setFilteredInsumos] = useState<ArticuloInsumo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

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

  const handleSaveInsumo = (newInsumo: ArticuloInsumo) => {
    setInsumos([...insumos, newInsumo]);
    setFilteredInsumos([...insumos, newInsumo]);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <SearchBar onSearch={setQuery} />
      <button className="boton-agregarInsumo" onClick={() => setShowForm(true)}>Agregar Insumo</button>
      {showForm && (
        <InsumoFormulario
          show={showForm}
          handleClose={handleCancel}
          onSave={handleSaveInsumo}
        />
      )}
      <li key="lista1" className="row">
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
        <div className="col">
          <b>Eliminar/Modificar:</b>
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
