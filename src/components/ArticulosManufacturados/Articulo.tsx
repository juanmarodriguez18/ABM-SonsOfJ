import React, { useState } from 'react';
import { ArticuloManufacturado } from '../../types/ArticuloManufacturado';
import { Link } from 'react-router-dom';
import '../../styles/Articulo.css';
import { recuperarManufacturado } from '../../services/ArticuloManufacturadoService';
import { eliminarArticuloManufacturado } from '../../services/ArticuloManufacturadoService';
import AgregarArticuloManufacturadoModal from './AgregarArticuloManufacturadoModal';


const Articulo: React.FC<{ articulo: ArticuloManufacturado }> = ({ articulo }) => {
    const[manufacturado, setManufacturado] = useState<ArticuloManufacturado>(articulo);
    const imagenesArray = Array.from(articulo.imagenesArticulo);
    const primeraImagen = imagenesArray[0]?.url;
    const [showForm, setShowForm] = useState(false);

    const handleEliminarRecuperar = async () => {
      try {
          if (manufacturado.eliminado) {
              await recuperarManufacturado(manufacturado.id); // Lógica para recuperar el manufacturado
              setManufacturado({ ...manufacturado, eliminado: false });
          } else {
              await eliminarArticuloManufacturado(manufacturado.id); // Lógica para eliminar lógicamente el insumo
              setManufacturado({ ...manufacturado, eliminado: true });
          }
      } catch (error) {
          console.error('Error al actualizar el estado del manufacturado:', error);
          // Manejo de errores
      }
  };

  const handleModificar = () => {
    setShowForm(true);
};
  
    return (
      <li className={`row ${manufacturado.eliminado ? 'eliminado' : ''}`}>
        <div className="col">
          <p>{articulo.denominacion}</p>
        </div>
        <div className="col">
          {primeraImagen && <img className="img" src={primeraImagen} alt={articulo.denominacion} />}
        </div>
        <div className="col">
          <p>{articulo.descripcion}</p>
        </div>
        <div className="col">
          <p>${articulo.precioVenta}</p>
        </div>
        <div className="col">
          <p>{articulo.tiempoEstimadoMinutos} minutos</p>
        </div>
        <div className="col">
          <Link to={`/articulos/${articulo.id}`}>
              <button className='btn-Guardar'>Detalles</button>
          </Link>
        </div>
        <div className="col">
                <button className={manufacturado.eliminado ? "recuperarBtn" : "eliminarBtn"} onClick={handleEliminarRecuperar}>
                    {manufacturado.eliminado ? 'Recuperar' : 'Eliminar'}
                </button>
                <button className="modificarBtn" onClick={handleModificar}>
                    Modificar
                </button>
            </div>
            {/* Formulario de Modificar */}
            <AgregarArticuloManufacturadoModal
                show={showForm}
                handleClose={() => setShowForm(false)}
                onSave={(manufacturado: ArticuloManufacturado) => {
                    console.log('Artículo manufacturado guardado:', manufacturado);
                    // Aquí podrías realizar cualquier acción necesaria después de guardar el artículo
                    setShowForm(false); // Cerrar el modal después de guardar
                    // Actualizar el artículo en la lista o realizar otra acción necesaria
                    setManufacturado(manufacturado);
                }}
                isEdit={true}
                articuloManufacturadoInicial={manufacturado}
                articulosInsumo={[]} // Aquí debes pasar los insumos necesarios
                unidadesMedida={[]} // Aquí debes pasar las unidades de medida necesarias
                imagenesArticulo={[]} // Aquí debes pasar las imágenes del artículo manufacturado
            />
      </li>
    );
  };
  
  export default Articulo;
