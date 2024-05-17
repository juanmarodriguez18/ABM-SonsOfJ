import React, { useState } from 'react';
import { crearImagenArticulo } from '../services/ImagenArticuloService';
import { ImagenArticulo } from '../types/ImagenArticulo';
import '../styles/AgregarImagenModal.css';

interface AgregarImagenModalProps {
    imagenes: ImagenArticulo[];
    setImagenes: (imagenes: ImagenArticulo[]) => void;
    toggleModal: () => void;
}

const AgregarImagenModal: React.FC<AgregarImagenModalProps> = ({ imagenes, setImagenes, toggleModal }) => {
    const [nuevaImagen, setNuevaImagen] = useState<any>({
        url: '',
        descripcion: '',
        eliminado: false
    });
    const [txtValidacion, setTxtValidacion] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNuevaImagen({
            ...nuevaImagen,
            [e.target.name]: e.target.value
        });
    };

    const guardarImagen = async () => {
        try {
            if (!nuevaImagen.url || nuevaImagen.url.trim() === '') {
                setTxtValidacion('Ingrese la URL de la imagen');
                return;
            }

            const imagenCreada = await crearImagenArticulo(nuevaImagen);
            setImagenes([...imagenes, imagenCreada]);
            toggleModal(); // Cerrar el modal después de guardar la imagen
        } catch (error) {
            console.error('Error al crear la imagen:', error);
            setTxtValidacion('Error al crear la imagen. Por favor, inténtelo de nuevo más tarde.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={toggleModal}>&times;</span>
                <h2>Agregar Nueva Imagen</h2>
                <div className="mb-3">
                    <label htmlFor="txtUrl" className="form-label">URL</label>
                    <input type="text" id="txtUrl" name="url" className="form-control" placeholder="Ingrese la URL de la imagen" value={nuevaImagen.url} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtDescripcion" className="form-label">Descripción</label>
                    <input type="text" id="txtDescripcion" name="descripcion" className="form-control" placeholder="Ingrese la descripción de la imagen" value={nuevaImagen.descripcion} onChange={handleInputChange} />
                </div>
                <div>
                    <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
                </div>
                <button className="btn btn-primary" onClick={guardarImagen}>Guardar Imagen</button>
            </div>
        </div>
    );
};

export default AgregarImagenModal;
