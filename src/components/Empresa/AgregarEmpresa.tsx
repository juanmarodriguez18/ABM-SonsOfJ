import React, { useState, useEffect } from 'react';
import { Button, TextField, DialogTitle, DialogContent, DialogActions, Dialog, FormControl, FormHelperText } from '@mui/material';
import { Empresa } from '../../types/Empresa';
import { ImagenEmpresa } from '../../types/ImagenEmpresa';
import { crearEmpresa, actualizarEmpresa } from '../../services/EmpresaService';
import uploadImage from '../../services/CloudinaryService';

interface AgregarEmpresaModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: (empresa: Empresa) => void;
    isEdit?: boolean;
    empresaInicial?: Empresa;
}

const AgregarEmpresaModal: React.FC<AgregarEmpresaModalProps> = ({
    show,
    handleClose,
    onSave,
    isEdit = false,
    empresaInicial,
}) => {
    const [nombre, setNombre] = useState<string>('');
    const [razonSocial, setRazonSocial] = useState<string>('');
    const [cuil, setCuil] = useState<number>(0);
    const [imagenesEmpresa, setImagenesEmpresa] = useState<ImagenEmpresa[]>([]);
    const [sucursales, setSucursales] = useState<any[]>([]);
    const [errors, setErrors] = useState<{ 
        nombre?: string,
        razonSocial?: string,
        cuil?: string,
        imagenesEmpresa?: string[]
    }>({});

    useEffect(() => {
        if (isEdit && empresaInicial) {
            setNombre(empresaInicial.nombre);
            setRazonSocial(empresaInicial.razonSocial);
            setCuil(empresaInicial.cuil);
            setImagenesEmpresa(empresaInicial.imagenesEmpresa.map(img => new ImagenEmpresa(img.id, img.eliminado, img.url)));
            setSucursales([...empresaInicial.sucursales]);
        } else {
            setNombre('');
            setRazonSocial('');
            setCuil(0);
            setImagenesEmpresa([]);
            setSucursales([]);
        }
    }, [show, isEdit, empresaInicial]);

    const validateFields = () => {
        const newErrors: {
            nombre?: string,
            razonSocial?: string,
            cuil?: string,
            imagenesEmpresa?: string[]
        } = {};
        if (!nombre) newErrors.nombre = 'El nombre es obligatorio';
        if (!razonSocial) newErrors.razonSocial = 'La razón social es obligatoria';
        if (!cuil) newErrors.cuil = 'El CUIL es obligatorio';
        const imagenErrors = imagenesEmpresa.map((imagen, index) => (!imagen.url ? `La URL de la imagen ${index + 1} es obligatoria` : ''));
        if (imagenErrors.some(error => error !== '')) newErrors.imagenesEmpresa = imagenErrors;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGuardar = async () => {
        if (!validateFields()) return;

        const nuevaEmpresa: Empresa = {
            id: isEdit && empresaInicial ? empresaInicial.id : 0,
            nombre,
            razonSocial,
            cuil,
            imagenesEmpresa,
            sucursales,
            eliminado: false,
        };

        try {
            if (isEdit && empresaInicial) {
                await actualizarEmpresa(nuevaEmpresa.id, nuevaEmpresa);
                alert('La Empresa se actualizó correctamente');
                onSave(nuevaEmpresa); // Aquí estás devolviendo la empresa modificada
            } else {
                const empresaCreada = await crearEmpresa(nuevaEmpresa);
                alert('La Empresa se guardó correctamente');
                onSave(empresaCreada);
            }

            handleClose();
        } catch (error) {
            console.error('Error al guardar la empresa:', error);
        }
    };

    const handleAgregarImagen = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', 'image/*');
            fileInput.click();

            fileInput.onchange = async () => {
                const file = fileInput.files?.[0];
                if (file) {
                    const imageUrl = await uploadImage(file);
                    setImagenesEmpresa([...imagenesEmpresa, new ImagenEmpresa(0, false, imageUrl)]);
                }
            };
        } catch (error) {
            console.error('Error al agregar imagen:', error);
        }
    };

    const handleRemoveImagen = (index: number) => {
        const newImages = [...imagenesEmpresa];
        newImages.splice(index, 1);
        setImagenesEmpresa(newImages);
    };

    return (
        <Dialog open={show} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
            <DialogTitle id="form-dialog-title">{isEdit ? 'Modificar Empresa' : 'Agregar Empresa'}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="nombre"
                    label="Nombre"
                    type="text"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                />
                <TextField
                    margin="dense"
                    id="razonSocial"
                    label="Razón Social"
                    type="text"
                    fullWidth
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    error={!!errors.razonSocial}
                    helperText={errors.razonSocial}
                />
                <TextField
                    margin="dense"
                    id="cuil"
                    label="CUIL"
                    type="number"
                    fullWidth
                    value={cuil}
                    onChange={(e) => setCuil(Number(e.target.value))}
                    error={!!errors.cuil}
                    helperText={errors.cuil}
                />
                <FormControl fullWidth margin="dense">
                    <Button variant="contained" color="primary" onClick={handleAgregarImagen}>
                        Agregar Imagen
                    </Button>
                    <div style={{ marginTop: 10 }}>
                        {imagenesEmpresa.map((imagen, index) => (
                            <div key={index} style={{ display: 'inline-block', marginRight: 10 }}>
                                <img
                                    src={imagen.url}
                                    alt={`Imagen Empresa ${index + 1}`}
                                    style={{ width: 100, height: 'auto', marginRight: 10 }}
                                />
                                <Button variant="outlined" color="secondary" onClick={() => handleRemoveImagen(index)}>
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                    </div>
                    {errors.imagenesEmpresa && errors.imagenesEmpresa.length > 0 && (
                        <FormHelperText style={{ color: 'red', marginTop: 10 }}>
                            {errors.imagenesEmpresa.map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </FormHelperText>
                    )}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleGuardar}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgregarEmpresaModal;
