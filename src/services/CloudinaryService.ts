import { ArticuloInsumo } from '../types/ArticuloInsumo';
import { ImagenArticulo } from '../types/ImagenArticulo';
import  React  from 'react';

const uploadImage = async (
    file: File,
    setArticuloInsumo: React.Dispatch<React.SetStateAction<ArticuloInsumo>>,
) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); // Reemplazar por tu upload preset de Cloudinary
        const response = await fetch('https://api.cloudinary.com/v1_1/dqb1586ud/image/upload', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        const newImage: ImagenArticulo = {
            id: Math.floor(Math.random() * 1000), // Generar un número aleatorio para el id
            url: data.secure_url, // URL de la imagen en Cloudinary
            eliminado: false,
        };
        setArticuloInsumo((prev: ArticuloInsumo) => {
            const newImages = new Set(prev.imagenesArticulo);
            newImages.add(newImage);
            return {
                ...prev,
                imagenesArticulo: newImages,
            };
        });
    } catch (error) {
        console.error('Error al cargar la imagen en Cloudinary:', error);
        alert('Hubo un error al cargar la imagen. Por favor, inténtalo de nuevo.');
    }
};

export default uploadImage;
