import React, { useState } from 'react';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import '../styles/Articulo.css';
import { eliminarInsumo, recuperarInsumo } from '../services/ArticuloInsumoService'; // Asumiendo que tienes una función para recuperar el insumo
import InsumoFormulario from './InsumoFormulario';

const Insumo: React.FC<{ articulo: ArticuloInsumo }> = ({ articulo }) => {
    const [insumo, setInsumo] = useState<ArticuloInsumo>(articulo);
    const imagenesArray = Array.from(insumo.imagenesArticulo);
    const primeraImagen = imagenesArray[0]?.url;
    const [showForm, setShowForm] = useState(false);

    const handleEliminarRecuperar = async () => {
        try {
            if (insumo.eliminado) {
                await recuperarInsumo(insumo.id); // Lógica para recuperar el insumo
                setInsumo({ ...insumo, eliminado: false });
            } else {
                await eliminarInsumo(insumo.id); // Lógica para eliminar lógicamente el insumo
                setInsumo({ ...insumo, eliminado: true });
            }
        } catch (error) {
            console.error('Error al actualizar el estado del insumo:', error);
            // Manejo de errores
        }
    };

    const handleModificar = () => {
      setShowForm(true);
  };

    return (
        <li className={`row ${insumo.eliminado ? 'eliminado' : ''}`}>
            <div className="col">
                <p>{insumo.denominacion}</p>
            </div>
            <div className="col">
                {primeraImagen && <img className="img" src={primeraImagen} alt={insumo.denominacion} />}
            </div>
            <div className="col">
                <p>$ {insumo.precioCompra}</p>
            </div>
            <div className="col">
                <p>{insumo.stockActual}</p>
            </div>
            <div className="col">
                <p>{insumo.stockMaximo}</p>
            </div>
            <div className="col">
                <p>{insumo.esParaElaborar ? "Sí" : "No"}</p>
            </div>
            <div className="col">
                <button className={insumo.eliminado ? "recuperarBtn" : "eliminarBtn"} onClick={handleEliminarRecuperar}>
                    {insumo.eliminado ? 'Recuperar' : 'Eliminar'}
                </button>
                <button className="modificarBtn" onClick={handleModificar}>
                    Modificar
                </button>
            </div>

            {/* Formulario de Modificar */}
            <InsumoFormulario
                show={showForm}
                handleClose={() => setShowForm(false)}
                onSave={(insumo: ArticuloInsumo) => {
                    
                    console.log('Insumo guardado:', insumo);
                    
                }}
                isEdit={true}
                insumo={articulo}
            />
        </li>
    );
};

export default Insumo;
