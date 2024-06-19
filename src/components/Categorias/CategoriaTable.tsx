import * as React from "react";
import { Categoria } from "../../types/Categoria";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";

interface CategoriaTableProps {
    data: Categoria[];
    onEdit: (categoria: Categoria) => void;
    onDelete: (categoria: Categoria) => void;
}

const CategoriaTable: React.FC<CategoriaTableProps> = ({ data, onEdit, onDelete }) => {
    const columns = [
        { label: "Denominacion", dataKey: "denominacion", width: "100%" },
        { label: "Operaciones", dataKey: "actions", width: "100%" },
    ];

    const rowContent = (categoria: Categoria) => (
        <TableRow
            sx={{ display: 'table', width: '100%' }}
            key={categoria.id}
            style={{ backgroundColor: categoria.eliminado ? "#ffebee" : "inherit" }}
        >
            <TableCell align="center" width="50%">{categoria.denominacion}</TableCell>
            <TableCell align="center" width="50%">
                {categoria.eliminado ? (
                    <IconButton
                        aria-label="restore"
                        onClick={() => onDelete(categoria)}
                        title="Recuperar"
                    >
                        <RestoreIcon
                            sx={{
                                bgcolor: "#ef6c00",
                                color: "#fff",
                                borderRadius: "50%",
                                width: 30,
                                height: 30,
                                p: 0.5,
                                marginRight: 1,
                                "&:hover": {
                                    bgcolor: "#e65100",
                                    cursor: "pointer",
                                },
                            }}
                        />
                    </IconButton>
                ) : (
                    <>
                        <IconButton
                            aria-label="delete"
                            onClick={() => onDelete(categoria)}
                            title="Eliminar"
                        >
                            <DeleteIcon
                                sx={{
                                    bgcolor: "#e53935",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: 30,
                                    height: 30,
                                    p: 0.5,
                                    marginRight: 1,
                                    "&:hover": {
                                        bgcolor: "#b71c1c",
                                        cursor: "pointer",
                                    },
                                }}
                            />
                        </IconButton>
                        <IconButton
                            aria-label="edit"
                            onClick={() => onEdit(categoria)}
                            title="Editar"
                        >
                            <EditIcon
                                sx={{
                                    bgcolor: "#3f51b5",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: 30,
                                    height: 30,
                                    p: 0.5,
                                }}
                            />
                        </IconButton>
                    </>
                )}
            </TableCell>
        </TableRow>
    );

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 8,
                width: "100%",
                marginTop: 2,
                bgcolor: "#eee",
                boxShadow: 2,
            }}
        >
            <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: "#aaa" }}>
                    <TableRow sx={{ display: 'flex', flexDirection: 'row' }}>
                        {columns.map((column, index) => (
                            <TableCell
                                key={index}
                                variant="head"
                                style={{ width: column.width, textAlign: "center" }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody sx={{ display: 'block', overflowY: 'auto', maxHeight: '74vh' }}>
                    {data.map((categoria) => rowContent(categoria))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CategoriaTable;