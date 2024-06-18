// src/components/Empresa/AgregarEmpresa.tsx
import React, { useState, useEffect } from 'react';
import { Button, TextField, DialogTitle, DialogContent, DialogActions, Dialog } from '@mui/material';
import { Empresa } from '../../types/Empresa';
import { ImagenEmpresa } from '../../types/ImagenEmpresa';
import { crearEmpresa, actualizarEmpresa } from '../../services/EmpresaService';

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
    const [errors, setErrors] = useState<{ nombre?: string, razonSocial?: string, cuil?: string, imagenesEmpresa?: string[] }>({});

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
        const newErrors: { nombre?: string, razonSocial?: string, cuil?: string, imagenesEmpresa?: string[] } = {};
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

    const handleAgregarImagen = () => {
        setImagenesEmpresa([...imagenesEmpresa, new ImagenEmpresa()]);
    };

    const handleImagenChange = (index: number, url: string) => {
        const nuevasImagenes = [...imagenesEmpresa];
        nuevasImagenes[index] = { ...nuevasImagenes[index], url };
        setImagenesEmpresa(nuevasImagenes);
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
                <Button variant="contained" color="primary" onClick={handleAgregarImagen}>
                    Agregar Imagen
                </Button>
                {imagenesEmpresa.map((imagen, index) => (
                    <TextField
                        key={index}
                        margin="dense"
                        label={`Imagen ${index + 1}`}
                        type="text"
                        fullWidth
                        value={imagen.url}
                        onChange={(e) => handleImagenChange(index, e.target.value)}
                        error={errors.imagenesEmpresa && errors.imagenesEmpresa[index] !== ''}
                        helperText={errors.imagenesEmpresa && errors.imagenesEmpresa[index]}
                    />
                ))}
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
