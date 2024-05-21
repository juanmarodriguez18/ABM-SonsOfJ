import React, { useEffect, useState } from 'react';
import { getArticulosManufacturados } from '../services/ArticuloManufacturadoService';
import Articulo from './Articulo';
import SearchBar from './SearchBar';
import AgregarArticuloManufacturadoModal from './Modals/AgregarArticuloManufacturadoModal';
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import { UnidadMedida } from '../types/UnidadMedida';
import '../styles/Articulo.css';
import { Button } from 'react-bootstrap';
import { getInsumos } from '../services/ArticuloInsumoService';
import { getUnidadesMedida } from '../services/UnidadMedidaService';
import { getCategorias } from '../services/CategoriaService';
import { Categoria } from '../types/Categoria';

const ArticuloList: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filteredArticulos, setFilteredArticulos] = useState<ArticuloManufacturado[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Array de objetos Categoria
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getArticulosManufacturados();
      setArticulos(data);
      setFilteredArticulos(data);
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
    let filtered = articulos.filter((articulo) =>
      articulo.denominacion.toLowerCase().includes(query.toLowerCase())
    );

    if (categoriaSeleccionada) {
      filtered = filtered.filter((articulo) =>
        articulo.categoria.denominacion.toLowerCase().includes(categoriaSeleccionada.toLowerCase())
      );
    }

    setFilteredArticulos(filtered);
  }, [query, articulos, categoriaSeleccionada]);

  useEffect(() => {
    const fetchInsumosYUnidades = async () => {
      const insumosData = await getInsumos();
      const unidadesData = await getUnidadesMedida();
      setArticulosInsumo(insumosData);
      setUnidadesMedida(unidadesData);
    };
  
    fetchInsumosYUnidades();
  }, []);

  const agregarArticuloManufacturado = (nuevoArticulo: ArticuloManufacturado) => {
    setArticulos([...articulos, nuevoArticulo]);
    setFilteredArticulos([...articulos, nuevoArticulo]);
  };

  return (
    <div>
      <SearchBar onSearch={setQuery} />
      <Button className='btn-Guardar' variant="primary" onClick={() => setShowModal(true)}>
        Agregar Artículo
      </Button>
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
        <div className="col">
          <b>Eliminar/Modificar:</b>
        </div>
      </li>
      <ul>
        {filteredArticulos.map(articulo => (
          <Articulo key={articulo.id} articulo={articulo} />
        ))}
      </ul>

      <AgregarArticuloManufacturadoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={agregarArticuloManufacturado}
        articulosInsumo={articulosInsumo}
        unidadesMedida={unidadesMedida}
        imagenesArticulo={[]} // Pasa las imágenes del artículo si es necesario
      />
    </div>
  );
};

export default ArticuloList;
