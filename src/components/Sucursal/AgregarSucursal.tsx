import React, { useState, useEffect } from 'react';
import { Button, TextField, DialogTitle, DialogContent, DialogActions, Dialog, MenuItem } from '@mui/material';
import { Sucursal } from '../../types/Sucursal';
import { ImagenSucursal } from '../../types/ImagenSucursal';
import { Domicilio } from '../../types/Domicilio';
import { Localidad } from '../../types/Localidad';
import { Provincia } from '../../types/Provincia';
import { Pais } from '../../types/Pais';
import { Empresa } from '../../types/Empresa';
import { crearSucursal, actualizarSucursal } from '../../services/SucursalService';
import { getEmpresas } from '../../services/EmpresaService'; // Servicio para obtener empresas

interface NuevaSucursal {
    id: number;
    nombre: string;
    horarioApertura: Date;
    horarioCierre: Date;
    empresa: Empresa;
    domicilio: Domicilio;
    imagenesSucursal: ImagenSucursal[];
    eliminado: boolean;
}

interface AgregarSucursalModalProps {
    show: boolean;
    handleClose: () => void;
    onSave: (sucursal: Sucursal) => void;
    isEdit?: boolean;
    sucursalInicial?: Sucursal;
}

const AgregarSucursalModal: React.FC<AgregarSucursalModalProps> = ({
    show,
    handleClose,
    onSave,
    isEdit = false,
    sucursalInicial,
}) => {
    const [nombre, setNombre] = useState<string>('');
    const [horarioApertura, setHorarioApertura] = useState<string>('');
    const [horarioCierre, setHorarioCierre] = useState<string>('');
    const [calle, setCalle] = useState<string>('');
    const [numero, setNumero] = useState<number>(0);
    const [cp, setCp] = useState<number>(0);
    const [piso, setPiso] = useState<number>(0);
    const [nroDpto, setNroDpto] = useState<number>(0);
    const [localidad, setLocalidad] = useState<Localidad>(new Localidad(0, false, '', new Provincia(0, false, '', new Pais(0, false, ''))));
    const [imagenesSucursal, setImagenesSucursal] = useState<ImagenSucursal[]>([]);
    const [empresa, setEmpresa] = useState<Empresa | null>(null); // Empresa seleccionada
    const [empresasDisponibles, setEmpresasDisponibles] = useState<Empresa[]>([]); // Lista de empresas disponibles
    const [errors, setErrors] = useState<{
        nombre?: string,
        horarioApertura?: string,
        horarioCierre?: string,
        calle?: string,
        numero?: string,
        cp?: string,
        piso?: string,
        nroDpto?: string,
        localidad?: string,
        imagenesSucursal?: string[],
        empresa?: string
    }>({});

    useEffect(() => {
        const cargarEmpresas = async () => {
            try {
                const empresas = await getEmpresas();
                setEmpresasDisponibles(empresas);
            } catch (error) {
                console.error('Error al cargar las empresas:', error);
            }
        };

        cargarEmpresas();
    }, []);

    useEffect(() => {
        if (isEdit && sucursalInicial) {
            setNombre(sucursalInicial.nombre);
            setHorarioApertura(sucursalInicial.horarioApertura.toISOString().slice(0, 16));
            setHorarioCierre(sucursalInicial.horarioCierre.toISOString().slice(0, 16));
            setCalle(sucursalInicial.domicilio.calle);
            setNumero(sucursalInicial.domicilio.numero);
            setCp(sucursalInicial.domicilio.cp);
            setPiso(sucursalInicial.domicilio.piso);
            setNroDpto(sucursalInicial.domicilio.nroDpto);
            setLocalidad(sucursalInicial.domicilio.localidad);
            setEmpresa(sucursalInicial.empresa);
            setImagenesSucursal(sucursalInicial.imagenesSucursal.map(img => new ImagenSucursal(img.id, img.eliminado, img.url)));
        } else {
            setNombre('');
            setHorarioApertura('');
            setHorarioCierre('');
            setCalle('');
            setNumero(0);
            setCp(0);
            setPiso(0);
            setNroDpto(0);
            setLocalidad(new Localidad(0, false, '', new Provincia(0, false, '', new Pais(0, false, ''))));
            setEmpresa(null);
            setImagenesSucursal([]);
        }
    }, [show, isEdit, sucursalInicial]);

    const validateFields = () => {
        const newErrors: {
            nombre?: string,
            horarioApertura?: string,
            horarioCierre?: string,
            calle?: string,
            numero?: string,
            cp?: string,
            piso?: string,
            nroDpto?: string,
            localidad?: string,
            imagenesSucursal?: string[],
            empresa?: string
        } = {};
        if (!nombre) newErrors.nombre = 'El nombre es obligatorio';
        if (!horarioApertura) newErrors.horarioApertura = 'El horario de apertura es obligatorio';
        if (!horarioCierre) newErrors.horarioCierre = 'El horario de cierre es obligatorio';
        if (!calle) newErrors.calle = 'La calle es obligatoria';
        if (!numero) newErrors.numero = 'El número es obligatorio';
        if (!cp) newErrors.cp = 'El código postal es obligatorio';
        if (!piso) newErrors.piso = 'El piso es obligatorio';
        if (!nroDpto) newErrors.nroDpto = 'El número de departamento es obligatorio';
        if (!localidad.nombre) newErrors.localidad = 'La localidad es obligatoria';
        if (!empresa) newErrors.empresa = 'La empresa es obligatoria';

        const imagenErrors = imagenesSucursal.map((imagen, index) => (!imagen.url ? `La URL de la imagen ${index + 1} es obligatoria` : ''));
        if (imagenErrors.some(error => error !== '')) newErrors.imagenesSucursal = imagenErrors;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGuardar = async () => {
        if (!validateFields()) return;

        const nuevoDomicilio: Domicilio = {
            id: isEdit && sucursalInicial ? sucursalInicial.domicilio.id : 0,
            eliminado: false,
            calle,
            numero,
            cp,
            piso,
            nroDpto,
            localidad,
            clientes: []
        };

        const nuevaSucursal: NuevaSucursal = {
            id: isEdit && sucursalInicial ? sucursalInicial.id : 0,
            nombre,
            horarioApertura: new Date(horarioApertura),
            horarioCierre: new Date(horarioCierre),
            empresa: empresa!, // Asigna la empresa seleccionada
            domicilio: nuevoDomicilio,
            imagenesSucursal,
            eliminado: false,
        };

        console.log('Sucursal a guardar:', JSON.stringify(nuevaSucursal, null, 2));

        try {
            if (isEdit && sucursalInicial) {
                await actualizarSucursal(nuevaSucursal.id, nuevaSucursal as Sucursal);
                alert('La Sucursal se actualizó correctamente');
                onSave(nuevaSucursal as Sucursal);
            } else {
                const sucursalCreada = await crearSucursal(nuevaSucursal as Sucursal);
                alert('La Sucursal se guardó correctamente');
                onSave(sucursalCreada);
            }

            handleClose();
        } catch (error) {
            console.error('Error al guardar la sucursal:', error);
        }
    };

    const handleAgregarImagen = () => {
        setImagenesSucursal([...imagenesSucursal, new ImagenSucursal()]);
    };

    const handleImagenChange = (index: number, url: string) => {
        const nuevasImagenes = [...imagenesSucursal];
        nuevasImagenes[index] = { ...nuevasImagenes[index], url };
        setImagenesSucursal(nuevasImagenes);
    };

    return (
        <Dialog open={show} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
            <DialogTitle id="form-dialog-title">{isEdit ? 'Modificar Sucursal' : 'Agregar Sucursal'}</DialogTitle>
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
                    InputLabelProps={{ shrink: true }}
                    margin="dense"
                    id="horarioApertura"
                    label="Horario de Apertura"
                    type="datetime-local"
                    fullWidth
                    value={horarioApertura}
                    onChange={(e) => setHorarioApertura(e.target.value)}
                    error={!!errors.horarioApertura}
                    helperText={errors.horarioApertura}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    margin="dense"
                    id="horarioCierre"
                    label="Horario de Cierre"
                    type="datetime-local"
                    fullWidth
                    value={horarioCierre}
                    onChange={(e) => setHorarioCierre(e.target.value)}
                    error={!!errors.horarioCierre}
                    helperText={errors.horarioCierre}
                />
                <TextField
                    margin="dense"
                    id="calle"
                    label="Calle"
                    type="text"
                    fullWidth
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    error={!!errors.calle}
                    helperText={errors.calle}
                />
                <TextField
                    margin="dense"
                    id="numero"
                    label="Número"
                    type="number"
                    fullWidth
                    value={numero}
                    onChange={(e) => setNumero(Number(e.target.value))}
                    error={!!errors.numero}
                    helperText={errors.numero}
                />
                <TextField
                    margin="dense"
                    id="cp"
                    label="Código Postal"
                    type="number"
                    fullWidth
                    value={cp}
                    onChange={(e) => setCp(Number(e.target.value))}
                    error={!!errors.cp}
                    helperText={errors.cp}
                />
                <TextField
                    margin="dense"
                    id="piso"
                    label="Piso"
                    type="number"
                    fullWidth
                    value={piso}
                    onChange={(e) => setPiso(Number(e.target.value))}
                    error={!!errors.piso}
                    helperText={errors.piso}
                />
                <TextField
                    margin="dense"
                    id="nroDpto"
                    label="Número de Departamento"
                    type="number"
                    fullWidth
                    value={nroDpto}
                    onChange={(e) => setNroDpto(Number(e.target.value))}
                    error={!!errors.nroDpto}
                    helperText={errors.nroDpto}
                />
                <TextField
                    margin="dense"
                    id="localidad"
                    label="Localidad"
                    type="text"
                    fullWidth
                    value={localidad.nombre}
                    onChange={(e) => setLocalidad({ ...localidad, nombre: e.target.value })}
                    error={!!errors.localidad}
                    helperText={errors.localidad}
                />
                <TextField
                    select
                    margin="dense"
                    id="empresa"
                    label="Empresa"
                    fullWidth
                    value={empresa ? empresa.id : ''}
                    onChange={(e) => {
                        const selectedEmpresa = empresasDisponibles.find(emp => emp.id === Number(e.target.value));
                        setEmpresa(selectedEmpresa || null);
                    }}
                    error={!!errors.empresa}
                    helperText={errors.empresa}
                >
                    {empresasDisponibles.map(emp => (
                        <MenuItem key={emp.id} value={emp.id}>
                            {emp.nombre}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" color="primary" onClick={handleAgregarImagen}>
                    Agregar Imagen
                </Button>
                {imagenesSucursal.map((imagen, index) => (
                    <TextField
                        key={index}
                        margin="dense"
                        label={`Imagen Sucursal ${index + 1}`}
                        type="text"
                        fullWidth
                        value={imagen.url}
                        onChange={(e) => handleImagenChange(index, e.target.value)}
                        error={errors.imagenesSucursal && errors.imagenesSucursal[index] !== ''}
                        helperText={errors.imagenesSucursal && errors.imagenesSucursal[index]}
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

export default AgregarSucursalModal;
