import React, { useState } from "react";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RestoreIcon from '@mui/icons-material/Restore';
import InsumoFormulario from "./InsumoFormulario";

interface InsumoTableProps {
    data: ArticuloInsumo[];
    onDelete: (articuloInsumo: ArticuloInsumo) => void;
}

const InsumoTable: React.FC<InsumoTableProps> = ({ data, onDelete }) => {
    const [showForm, setShowForm] = useState(false);
    const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | null>(null);

    const handleModificar = (insumo: ArticuloInsumo) => {
        setSelectedInsumo(insumo);
        setShowForm(true);
    };

    const columns = [
        { label: 'Denominación', dataKey: 'denominacion', width: 150 },
        { label: 'Imagen', dataKey: 'imagenesArticulo', width: 150 }, 
        { label: 'Precio Compra', dataKey: 'precioCompra', width: 150 },
        { label: 'Stock Actual', dataKey: 'stockActual', width: 150 },
        { label: 'Stock Mínimo', dataKey: 'stockMinimo', width: 150 },
        { label: 'Es para elaborar', dataKey: 'esParaElaborar', width: 150 },
        { label: 'Operaciones', dataKey: 'actions', width: 150 },
    ];

    const fixedHeaderContent = () => (
        <TableRow>
            {columns.map((column, index) => (
                <TableCell key={index} variant="head" style={{ width: column.width }}>
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );

    const rowContent = (articuloInsumo: ArticuloInsumo) => {
        const primeraImagen = Array.from(articuloInsumo.imagenesArticulo)[0]?.url;

        return (
            <TableRow key={articuloInsumo.id} style={{ backgroundColor: articuloInsumo.eliminado ? '#ffebee' : 'inherit' }}>
                <TableCell>{articuloInsumo.denominacion}</TableCell>
                <TableCell>
                    {primeraImagen && (
                        <img
                            className="img"
                            src={primeraImagen}
                            alt={articuloInsumo.denominacion}
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                    )}
                </TableCell>
                <TableCell>{articuloInsumo.precioCompra}</TableCell>
                <TableCell>{articuloInsumo.stockActual}</TableCell>
                <TableCell>{articuloInsumo.stockMinimo}</TableCell>
                <TableCell>{articuloInsumo.esParaElaborar ? "Sí" : "No"}</TableCell>
                <TableCell>
                    {articuloInsumo.eliminado ? (
                        <IconButton aria-label="restore" onClick={() => onDelete(articuloInsumo)} title="Recuperar">
                            <RestoreIcon />
                        </IconButton>
                    ) : (
                        <>
                            <IconButton aria-label="edit" onClick={() => handleModificar(articuloInsumo)} title="Editar">
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => onDelete(articuloInsumo)} title="Eliminar">
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}
                </TableCell>
            </TableRow>
        );
    };

    return (
        <>
            <Paper style={{ width: '100%', marginBottom: '20px' }}>
                <TableContainer style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                    <Table stickyHeader aria-label="insumo table">
                        <TableHead>
                            {fixedHeaderContent()}
                        </TableHead>
                        <TableBody>
                            {data.map((articuloInsumo) => (
                                rowContent(articuloInsumo)
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Formulario de Modificar */}
            {selectedInsumo && (
                <InsumoFormulario
                    show={showForm}
                    handleClose={() => {
                        setShowForm(false);
                        setSelectedInsumo(null);
                    }}
                    onSave={(insumo: ArticuloInsumo) => {
                        console.log('Insumo guardado:', insumo);
                        setShowForm(false);
                        setSelectedInsumo(null);
                    }}
                    isEdit={true}
                    insumo={selectedInsumo}
                />
            )}
        </>
    );
};

export default InsumoTable;
