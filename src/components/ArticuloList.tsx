import React, { useEffect, useState } from 'react';
import { getArticulosManufacturados } from '../services/ArticuloManufacturadoService';
import Articulo from './Articulo';
import SearchBar from './SearchBar';
import AgregarArticuloManufacturadoModal from './AgregarArticuloManufacturadoModal';
import { ArticuloManufacturado } from '../types/ArticuloManufacturado';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import { UnidadMedida } from '../types/UnidadMedida';
import '../styles/Articulo.css';
import { Button } from 'react-bootstrap';
import { getInsumos } from '../services/ArticuloInsumoService';
import { getUnidadesMedida } from '../services/UnidadMedidaService';

const ArticuloList: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filteredArticulos, setFilteredArticulos] = useState<ArticuloManufacturado[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

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
    setFilteredArticulos(
      articulos.filter(articulo =>
        articulo.denominacion.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, articulos]);

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
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Agregar Artículo
      </Button>
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

      <AgregarArticuloManufacturadoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        agregarArticuloManufacturado={agregarArticuloManufacturado}
        articulosInsumo={articulosInsumo}
        unidadesMedida={unidadesMedida}
        imagenesArticulo={[]} // Pasa las imágenes del artículo si es necesario
      />
    </div>
  );
};

export default ArticuloList;
