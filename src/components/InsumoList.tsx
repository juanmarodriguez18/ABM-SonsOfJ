import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import Insumo from './ArticuloInsumo';
import { getInsumos } from '../services/ArticuloInsumoService';
import InsumoFormulario from './Modals/InsumoFormulario';
import { getCategorias } from '../services/CategoriaService';
import '../styles/AgregarImagenModal.css';
import { Categoria } from '../types/Categoria';

const InsumoList: React.FC = () => {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [filteredInsumos, setFilteredInsumos] = useState<ArticuloInsumo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Array de objetos Categoria
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const data: ArticuloInsumo[] = await getInsumos();
      setInsumos(data);
      setFilteredInsumos(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    let filtered = insumos.filter((insumo) =>
      insumo.denominacion.toLowerCase().includes(query.toLowerCase())
    );

    if (categoriaSeleccionada) {
      filtered = filtered.filter((insumo) =>
        insumo.categoria.denominacion.toLowerCase().includes(categoriaSeleccionada.toLowerCase())
      );
    }

    setFilteredInsumos(filtered);
  }, [query, insumos, categoriaSeleccionada]);

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
      <button className="btn-Guardar" onClick={() => setShowForm(true)}>
        Agregar Insumo
      </button>
      {showForm && (
        <InsumoFormulario show={showForm} handleClose={handleCancel} onSave={handleSaveInsumo} />
      )}
      {/* Formulario para filtrar por categoría */}
      <div>
        <label htmlFor="categorias">Filtrar por categoría:</label>
        <select
          id="categorias"
          className='form-select'
          onChange={(e) => {
            const categoria = e.target.value;
            setCategoriaSeleccionada(categoria);
          }}
          value={categoriaSeleccionada}
        >
          <option value="">Seleccionar categoría...</option>
          {categorias.map((categoria, index) => (
            <option className="form-select-option" key={index} value={categoria.denominacion}>
              {categoria.denominacion}
            </option>
          ))}
        </select>
      </div>
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
        {filteredInsumos.map((insumo) => (
          <Insumo key={insumo.id} articulo={insumo} />
        ))}
      </ul>
    </div>
  );
};

export default InsumoList;

