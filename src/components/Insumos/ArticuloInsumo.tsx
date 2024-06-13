import React, { useState } from 'react';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import '../../styles/Articulo.css';
import { eliminarInsumo, recuperarInsumo } from '../../services/ArticuloInsumoService';
import InsumoFormulario from './InsumoFormulario';
import { ListItem, Box, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import EditIcon from '@mui/icons-material/Edit';

const Insumo: React.FC<{ articulo: ArticuloInsumo }> = ({ articulo }) => {
    const [insumo, setInsumo] = useState<ArticuloInsumo>(articulo);
    const imagenesArray = Array.from(insumo.imagenesArticulo);
    const primeraImagen = imagenesArray[0]?.url;
    const [showForm, setShowForm] = useState(false);

    const handleEliminarRecuperar = async () => {
        try {
            if (insumo.eliminado) {
                await recuperarInsumo(insumo.id);
                setInsumo({ ...insumo, eliminado: false });
            } else {
                await eliminarInsumo(insumo.id);
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
            <TableCell className="col" align="center">
                <p>{insumo.denominacion}</p>
            </TableCell>
            <TableCell className="col" align="center">
                {primeraImagen && (
                    <img
                        className="img"
                        src={primeraImagen}
                        alt={insumo.denominacion}
                    />
                )}
            </TableCell>
            <TableCell className="col" align="center">
                <p>{insumo.precioCompra}</p>
            </TableCell>
            <TableCell className="col" align="center">
                <p>{insumo.stockActual}</p>
            </TableCell>
            <TableCell className="col" align="center">
                <p>{insumo.stockMinimo}</p>
            </TableCell>
            <TableCell className="col" align="center">
            <p>{insumo.esParaElaborar ? "Sí" : "No"}</p>
            </TableCell>
            <TableCell className="col" sx={{ display: "flex" }} align="center">
                <Box onClick={handleEliminarRecuperar}>
                    {insumo.eliminado ? (
                        <RestoreIcon
                            sx={{
                                bgcolor: "#ef6c00",
                                color: "#fff",
                                width: 30,
                                height: 30,
                                p: 0.5,
                                borderRadius: "50%",
                                "&:hover": {
                                    bgcolor: "#e65100",
                                    cursor: "pointer",
                                },
                            }}
                        ></RestoreIcon>
                    ) : (
                        <DeleteIcon
                            sx={{
                                bgcolor: "#e53935",
                                color: "#fff",
                                width: 30,
                                height: 30,
                                p: 0.5,
                                borderRadius: "50%",
                                "&:hover": {
                                    bgcolor: "#b71c1c",
                                    cursor: "pointer",
                                },
                            }}
                        ></DeleteIcon>
                    )}
                </Box>
                <Box onClick={insumo.eliminado ? undefined : handleModificar}>
                    <EditIcon
                        sx={{
                            bgcolor: "#3f51b5",
                            color: "#fff",
                            borderRadius: "50%",
                            width: 30,
                            height: 30,
                            p: 0.5,
                            "&:hover": {
                                bgcolor: "#1a237e",
                                cursor: insumo.eliminado ? "not-allowed" : "pointer",
                            },
                        }}
                    />
                </Box>
            </TableCell>

            {/* Formulario de Modificar */}
            <InsumoFormulario
                show={showForm}
                handleClose={() => setShowForm(false)}
                onSave={(insumo: ArticuloInsumo) => {
                    console.log('Insumo guardado:', insumo);
                    setShowForm(false);
                    setInsumo(insumo);
                }}
                isEdit={true}
                insumo={articulo}
            />
        </li>
    );
};

export default Insumo;
