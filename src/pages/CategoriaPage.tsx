import { useEffect, useState } from "react";
import { Categoria } from "../types/Categoria";
import { actualizarCategoria, crearCategoria, eliminarCategoria, getCategorias, recuperarCategoria } from "../services/CategoriaService";
import { Box, Typography } from "@mui/material";
import CustomButton from "../components/Shared/CustomButton";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoriaTable from "../components/Categorias/CategoriaTable";
import CategoriaForm from "../components/Categorias/CategoriaForm";

const CategoriaPage: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [query, setQuery] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | undefined>(undefined);

    const fetchCategorias = async () => {
        try {
            const response = await getCategorias();
            setCategorias(response);
        } catch (error) {
            console.error("Error fetching categorias: ", error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const filteredCategorias = categorias.filter((categoria: Categoria) => 
        categoria.denominacion.toLowerCase().includes(query.toLowerCase())
    );

    const handleGuardarCategoria = async (categoria: Categoria) => {
        try {
            if (categoria.id) {
                const updatedCategoria = await actualizarCategoria(categoria.id, categoria);
                setCategorias((prevData) => 
                    prevData.map((item) => item.id === updatedCategoria.id ? updatedCategoria : item)
                );
            } else {
                const nuevaCategoria = await crearCategoria(categoria);
                setCategorias([...categorias, nuevaCategoria]);
            }
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la categoria:", error);
        }
    };

    const handleEliminarRecuperarCategoria = async (categoria: Categoria) => {
        try {
            if (categoria.eliminado) {
                await recuperarCategoria(categoria.id);
                setCategorias((prevData) =>
                    prevData.map((item) =>
                        item.id === categoria.id ? { ...item, eliminado: false } : item
                    )
                );
            } else {
                await eliminarCategoria(categoria.id);
                setCategorias((prevData) =>
                    prevData.map((item) =>
                        item.id === categoria.id ? { ...item, eliminado: true } : item
                    )
                );
            }
        } catch (error) {
            console.error("Error al actualizar el estado de la categoria:", error);
        }
    };

    const handleNuevaCategoria = () => {
        setSelectedCategoria(undefined);
        setShowForm(true);
    };

    const handleEditarCategoria = (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        setShowForm(true);
    };

    const handleSearch = (value: string) => {
        setQuery(value);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Categorias
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CustomButton onClick={handleNuevaCategoria} text="Agregar Categoria" />
                <SearchBar onSearch={handleSearch} />
            </Box>
            <CategoriaTable
                data={filteredCategorias}
                onEdit={handleEditarCategoria}
                onDelete={handleEliminarRecuperarCategoria}
            />
            <CategoriaForm
                show={showForm}
                onHide={() => setShowForm(false)}
                onSave={handleGuardarCategoria}
                initialData={selectedCategoria}
            />
        </Box>
    );
};

export default CategoriaPage;
