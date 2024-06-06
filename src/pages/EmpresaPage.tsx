import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import { Empresa } from '../types/Empresa';
import AgregarEmpresaModal from '../components/Empresa/AgregarEmpresa';
import { getEmpresas } from '../services/EmpresaService';

const EmpresaPage: React.FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | undefined>(undefined);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const empresasData = await getEmpresas();
                setEmpresas(empresasData);
            } catch (error) {
                console.error('Error al cargar las empresas:', error);
            }
        };

        fetchEmpresas();
    }, []);

    const handleOpenModal = () => {
        setEmpresaSeleccionada(undefined); // Limpiar la empresa seleccionada
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveEmpresa = (nuevaEmpresa: Empresa) => {
        if (empresaSeleccionada) {
            // Modificar empresa existente
            setEmpresas(empresas.map(empresa =>
                empresa.id === nuevaEmpresa.id ? nuevaEmpresa : empresa
            ));
        } else {
            // Agregar nueva empresa
            setEmpresas([...empresas, nuevaEmpresa]);
        }
        handleCloseModal();
    };

    const handleModificarEmpresa = (empresa: Empresa) => {
        setEmpresaSeleccionada(empresa);
        setShowModal(true); // Abre el modal con los datos de la empresa seleccionada
    };

    const handleEliminarEmpresa = (id: number) => {
        setEmpresas(empresas.filter(empresa => empresa.id !== id));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Gestión de Empresas
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {empresas.map(empresa => (
                    <Card key={empresa.id} style={{ maxWidth: '300px' }}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={empresa.imagenesEmpresa.length > 0 ? empresa.imagenesEmpresa[0].url : 'https://via.placeholder.com/150'}
                            alt={empresa.nombre}
                        />
                        <CardContent>
                            <Typography variant="h6" style={{ fontSize: '16px', lineHeight: '1.2' }}>{empresa.nombre}</Typography>
                            <Typography variant="subtitle1" style={{ fontSize: '14px' }}>{empresa.razonSocial}</Typography>
                            <Typography variant="subtitle2" style={{ fontSize: '14px' }}>CUIL: {empresa.cuil}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" onClick={() => handleModificarEmpresa(empresa)}>
                                Modificar
                            </Button>
                            <Button size="small" color="secondary" onClick={() => handleEliminarEmpresa(empresa.id)}>
                                Eliminar
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
            <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ marginTop: '16px' }}>
                Agregar Empresa
            </Button>
            <AgregarEmpresaModal
                show={showModal}
                handleClose={handleCloseModal}
                onSave={handleSaveEmpresa}
                isEdit={empresaSeleccionada !== undefined}
                empresaInicial={empresaSeleccionada}
            />
        </Container>
    );
    
};

export default EmpresaPage;
