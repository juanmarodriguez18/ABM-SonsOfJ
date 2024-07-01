import React, { useState, useEffect } from 'react';
import { Button, TextField, DialogTitle, DialogContent, DialogActions, Dialog, MenuItem } from '@mui/material';
import { Sucursal } from '../../types/Sucursal';
import { ImagenSucursal } from '../../types/ImagenSucursal';
//import { Domicilio } from '../../types/Domicilio';
import { Localidad } from '../../types/Localidad';
import { Empresa } from '../../types/Empresa';
import { crearSucursal, actualizarSucursal } from '../../services/SucursalService';
import { getEmpresas } from '../../services/EmpresaService'; // Servicio para obtener empresas
import { getLocalidades } from '../../services/LocalidadService';

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
    const [horarioApertura, setHorarioApertura] = useState<string | null>(null);
    const [horarioCierre, setHorarioCierre] = useState<string | null>(null);
    const [calle, setCalle] = useState<string>('');
    const [numero, setNumero] = useState<number>(0);
    const [cp, setCp] = useState<number>(0);
    const [piso, setPiso] = useState<number>(0);
    const [nroDpto, setNroDpto] = useState<number>(0);
    const [imagenesSucursal, setImagenesSucursal] = useState<ImagenSucursal[]>([]);
    const [localidad, setLocalidad] = useState<Localidad | null>(null);
    const [localidadesDisponibles, setLocalidadesDisponibles] = useState<Localidad[]>([]); // Lista de empresas disponibles
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
        empresa?: string
        imagenesSucursal?: string[],
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
        const cargarLocalidad = async () => {
            try {
                const localidades = await getLocalidades();
                setLocalidadesDisponibles(localidades);
            } catch (error) {
                console.error('Error al cargar las localidades:', error);
            }
        };

        cargarLocalidad();
    }, []);

    useEffect(() => {
        if (isEdit && sucursalInicial) {
            setNombre(sucursalInicial.nombre);
            setHorarioApertura(sucursalInicial.horarioApertura);
            setHorarioCierre(sucursalInicial.horarioCierre);
            if (sucursalInicial.domicilio) {
                setCalle(sucursalInicial.domicilio.calle);
                setNumero(sucursalInicial.domicilio.numero);
                setCp(sucursalInicial.domicilio.cp);
                setPiso(sucursalInicial.domicilio.piso);
                setNroDpto(sucursalInicial.domicilio.nroDpto);
                setLocalidad(sucursalInicial.domicilio.localidad);
            }
            if (sucursalInicial.empresa) {
                setEmpresa(sucursalInicial.empresa);
            }
            if (sucursalInicial.imagenesSucursal) {
                setImagenesSucursal(sucursalInicial.imagenesSucursal.map(img => new ImagenSucursal(img.id, img.eliminado, img.url)));
            }
        } else {
            setNombre('');
            setHorarioApertura(null);
            setHorarioCierre(null);
            setCalle('');
            setNumero(0);
            setCp(0);
            setPiso(0);
            setNroDpto(0);
            setLocalidad(null);
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
            empresa?: string
            imagenesSucursal?: string[],
        } = {};
        if (!nombre) newErrors.nombre = 'El nombre es obligatorio';
        if (!horarioApertura) newErrors.horarioApertura = 'El horario de apertura es obligatorio';
        if (!horarioCierre) newErrors.horarioCierre = 'El horario de cierre es obligatorio';
        if (!calle) newErrors.calle = 'La calle es obligatoria';
        if (!numero) newErrors.numero = 'El número es obligatorio';
        if (!cp) newErrors.cp = 'El código postal es obligatorio';
        if (!piso) newErrors.piso = 'El piso es obligatorio';
        if (!nroDpto) newErrors.nroDpto = 'El número de departamento es obligatorio';
        if (!localidad) newErrors.localidad = 'La localidad es obligatoria';
        if (!empresa) newErrors.empresa = 'La empresa es obligatoria';

        const imagenErrors = imagenesSucursal.map((imagen, index) => (!imagen.url ? `La URL de la imagen ${index + 1} es obligatoria` : ''));
        if (imagenErrors.some(error => error !== '')) newErrors.imagenesSucursal = imagenErrors;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGuardar = async () => {
        if (!validateFields()) return;
        
        const nuevaSucursal: Sucursal = {
            id: isEdit && sucursalInicial ? sucursalInicial.id : 0,
            nombre,
            horarioApertura: horarioApertura!, // Asegúrate de que horarioApertura sea Date | null
            horarioCierre: horarioCierre!, // Asegúrate de que horarioCierre sea Date | null
            empresa: empresa!,
            domicilio:
                {
                    id: 0,
                    eliminado: false,
                    calle,
                    numero,
                    cp,
                    piso,
                    nroDpto,
                    localidad: localidad!,
                    clientes: []   
                },
            imagenesSucursal,
            eliminado: false,
        };
        
        console.log('Sucursal a guardar:', JSON.stringify(nuevaSucursal, null, 2));

        try {
            if (isEdit && sucursalInicial) {
                await actualizarSucursal(nuevaSucursal.id, nuevaSucursal);
                alert('La Sucursal se actualizó correctamente');
                onSave(nuevaSucursal);
            } else {
                const sucursalCreada = await crearSucursal(nuevaSucursal);
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
                <div style={{ display: 'flex', gap: '20px' }}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        margin="dense"
                        id="horarioApertura"
                        label="Horario de Apertura"
                        type="time"
                        fullWidth
                        value={horarioApertura ? horarioApertura : ''}
                        onChange={(e) => {
                            const selectedTime = e.target.value;
                            if (selectedTime) {
                                setHorarioApertura(selectedTime);
                            } else {
                                setHorarioApertura(null);
                            }
                        }}
                        error={!!errors.horarioApertura}
                        helperText={errors.horarioApertura}
                        inputProps={{
                            step: 300, // intervalo de 5 minutos
                        }}
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        margin="dense"
                        id="horarioCierre"
                        label="Horario de Cierre"
                        type="time"
                        fullWidth
                        value={horarioCierre ? horarioCierre : ''}
                        onChange={(e) => {
                            const selectedTime = e.target.value;
                            if (selectedTime) {
                                setHorarioCierre(selectedTime);
                            } else {
                                setHorarioCierre(null);
                            }
                        }}
                        error={!!errors.horarioCierre}
                        helperText={errors.horarioCierre}
                        inputProps={{
                            step: 300, // intervalo de 5 minutos
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <TextField
                        margin="dense"
                        id="calle"
                        label="Calle"
                        type="text"
                        style={{ width: '300%' }}
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
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
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
                        id="cp"
                        label="Código Postal"
                        type="number"
                        style={{ width: '200%' }}
                        value={cp}
                        onChange={(e) => setCp(Number(e.target.value))}
                        error={!!errors.cp}
                        helperText={errors.cp}
                    />
                </div>
                <TextField
                    select
                    margin="dense"
                    id="localidad"
                    label="Localidad"
                    fullWidth
                    value={localidad ? localidad.id : ''}
                    onChange={(e) => {
                        const selectedLocalidad = localidadesDisponibles.find(loc => loc.id === Number(e.target.value));
                        console.log('Localidad seleccionada:', selectedLocalidad);
                        setLocalidad(selectedLocalidad || null); // Asigna selectedLocalidad o null si no se encuentra
                        console.log('Estado de localidad:', localidad);
                    }}
                    error={!!errors.localidad}
                    helperText={errors.localidad}
                >
                    {localidadesDisponibles.map(loc => (
                        <MenuItem key={loc.id} value={loc.id}>
                            {loc.nombre}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    margin="dense"
                    id="empresa"
                    label="Empresa"
                    fullWidth
                    value={empresa ? empresa.id : ''}
                    onChange={(e) => {
                        const selectedEmpresa = empresasDisponibles.find(emp => emp.id === Number(e.target.value));
                        console.log('Empresa seleccionada:', selectedEmpresa);
                        setEmpresa(selectedEmpresa || null);
                        console.log('Estado de empresa:', empresa);
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

