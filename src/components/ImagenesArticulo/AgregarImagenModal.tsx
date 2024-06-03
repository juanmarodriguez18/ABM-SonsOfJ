import React, { useState } from 'react';
import { crearImagenArticulo } from '../../services/ImagenArticuloService';
import { ImagenArticulo } from '../../types/ImagenArticulo';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Avatar, Typography, Fab
} from '@mui/material';
import { Close as CloseIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import '../../styles/AgregarImagenModal.css';

interface AgregarImagenModalProps {
    imagenes: ImagenArticulo[];
    setImagenes: (imagenes: ImagenArticulo[]) => void;
    toggleModal: () => void;
    show: boolean;
    onSave: (imagen: ImagenArticulo) => void; // Agregamos onSave como prop
}

const AgregarImagenModal: React.FC<AgregarImagenModalProps> = ({ imagenes, setImagenes, toggleModal, show, onSave }) => {
    const [nuevaImagen, setNuevaImagen] = useState<any>({
        url: '',
        eliminado: false
    });
    const [archivo, setArchivo] = useState<File | null>(null);
    const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
    const [txtValidacion, setTxtValidacion] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setArchivo(e.target.files[0]);
            setNuevaImagen({ ...nuevaImagen, eliminado: false });

            const reader = new FileReader();
            reader.onloadend = () => {
                setVistaPrevia(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
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
        <Dialog open={show} onClose={toggleModal} maxWidth="sm" fullWidth>
            <DialogTitle>
                Agregar Nueva Imagen
                <IconButton
                    aria-label="close"
                    onClick={toggleModal}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <input
                    accept="image/*"
                    id="fileInput"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <label htmlFor="fileInput" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Fab color="primary" aria-label="add" component="span">
                        <PhotoCameraIcon />
                    </Fab>
                    <Typography variant="caption" display="block" gutterBottom>
                        Seleccionar Imagen
                    </Typography>
                </label>
                {vistaPrevia && (
                    <Avatar
                        src={vistaPrevia}
                        alt="Vista previa"
                        sx={{ width: 100, height: 100, margin: '10px auto' }}
                    />
                )}
                <Typography style={{ color: 'red', marginTop: 10 }}>{txtValidacion}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={toggleModal}>
                    Cancelar
                </Button>
                <Button className="btn-Guardar" variant="contained" color="primary" onClick={guardarImagen}>
                    Guardar Imagen
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgregarImagenModal;
