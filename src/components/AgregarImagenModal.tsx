import React, { useState } from 'react';
import { crearImagenArticulo } from '../services/ImagenArticuloService';
import { ImagenArticulo } from '../types/ImagenArticulo';
import '../styles/AgregarImagenModal.css';

interface AgregarImagenModalProps {
    imagenes: ImagenArticulo[];
    setImagenes: (imagenes: ImagenArticulo[]) => void;
    toggleModal: () => void;
    show: boolean;
    onSave: (imagen: ImagenArticulo) => void; // Agregamos onSave como prop
}

const AgregarImagenModal: React.FC<AgregarImagenModalProps> = ({ imagenes, setImagenes, toggleModal, onSave }) => {
    const [nuevaImagen, setNuevaImagen] = useState<any>({
        url: '',
        eliminado: false
    });
    const [archivo, setArchivo] = useState<File | null>(null);
    const [txtValidacion, setTxtValidacion] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setArchivo(e.target.files[0]);
            setNuevaImagen({ ...nuevaImagen, eliminado: false }); // Reiniciar el estado de nuevaImagen
        }
    };

    const convertirArchivoABase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const guardarImagen = async () => {
        if (!archivo) {
            setTxtValidacion('Seleccione un archivo de imagen');
            return;
        }

        try {
            const imagenBase64 = await convertirArchivoABase64(archivo);
            const imagenCreada = await crearImagenArticulo({ ...nuevaImagen, url: imagenBase64 });
            setImagenes([...imagenes, imagenCreada]);
            onSave(imagenCreada); // Llamar a onSave con la imagen creada
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
                <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">Seleccionar imagen</label>
                    <input type="file" id="fileInput" className="form-control" onChange={handleFileChange} />
                </div>
                <div>
                    <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
                </div>
                <button className="btn-Guardar" onClick={guardarImagen}>Guardar Imagen</button>
            </div>
        </div>
    );
};

export default AgregarImagenModal;
