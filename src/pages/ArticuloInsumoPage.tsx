import React, { useEffect, useState } from "react";
import { ArticuloInsumo } from "../types/ArticuloInsumo";
import { getInsumos, actualizarInsumo, crearInsumo, eliminarInsumo, recuperarInsumo } from "../services/ArticuloInsumoService";
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import CustomButton from "../components/Shared/CustomButton";
import SearchBar from "../components/SearchBar/SearchBar";
import InsumoTable from "../components/Insumos/InsumoTable";
import { Categoria } from "../types/Categoria";
import { getCategorias } from "../services/CategoriaService";
import InsumoForm from "../components/Insumos/InsumoForm";

const ArticuloInsumoPage: React.FC = () => {
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [query, setQuery] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedInsumo, setSelectedInsumo] = useState<ArticuloInsumo | undefined>(undefined);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
    const [filteredInsumos, setFilteredInsumos] = useState<ArticuloInsumo[]>([]);

    // Funcion para cargar los insumos
    const fetchInsumos = async () => {
        try {
            const response = await getInsumos();
            setInsumos(response);
            setFilteredInsumos(response); // Inicialmente mostrar todos los insumos
        } catch (error) {
            console.error("Error fetching insumos: ", error);
        }
    };

    useEffect(() => {
        const fetchCategorias = async () => {
          try {
            const categoriasData = await getCategorias();
            setCategorias(categoriasData);
          } catch (error) {
            console.error('Error fetching categorias:', error);
          }
        };
    
        fetchCategorias();
      }, []);

    // Cargar insumos al cargar la página
    useEffect(() => {
        fetchInsumos();
    },[]);

    // Función para guardar o actualizar un insumo
    const handleGuardarInsumo = async (articuloInsumo: ArticuloInsumo) => {
        try {
            if (articuloInsumo.id) {
                // Actualizar insumo existente
                const updatedInsumo = await actualizarInsumo(articuloInsumo.id, articuloInsumo);
                setInsumos((prevInsumos) => prevInsumos.map((ai) => ai.id === updatedInsumo.id ? updatedInsumo : ai));
            } else {
                // Crear nuevo insumo
                const nuevoInsumo = await crearInsumo(articuloInsumo);
                setInsumos([...insumos, nuevoInsumo]);
            }
            setShowForm(false); // Ocultar el formulario después de guardar
        } catch (error) {
            console.error("Error al guardar el insumo:", error);
        }
    };

    // Función para manejar la eliminación o recuperación de un insumo
    const handleEliminarRecuperarInsumo = async (articuloInsumo: ArticuloInsumo) => {
        try {
            if (articuloInsumo.eliminado) {
                await recuperarInsumo(articuloInsumo.id); // Recuperar insumo
                setInsumos((prevInsumos) => prevInsumos.map((ai) => ai.id === articuloInsumo.id ? { ...ai, eliminado: false } : ai));
            } else {
                await eliminarInsumo(articuloInsumo.id); // Eliminar insumo
                setInsumos((prevInsumos) => prevInsumos.map((ai) => ai.id === articuloInsumo.id ? { ...ai, eliminado: true } : ai ));
            }
        } catch (error) {
            console.error("Error al actualizar el estado del insumo:", error);
        }
    };

    // Función para mostrar el formulario del nuevo insumo
    const handleNuevoInsumo = () => {
        setSelectedInsumo(undefined);
        setShowForm(true);
    }

    // Función para editar un insumo
    const handleEditarInsumo = (articuloInsumo: ArticuloInsumo) => {
        setSelectedInsumo(articuloInsumo);
        setShowForm(true);
    };

    // Función para manejar la búsqueda en la barra de búsqueda
    const handleSearch = (value: string) => {
        setQuery(value);
    };

    // Función para filtrar insumos
    useEffect(() => {
        let filtered = insumos.filter((insumo) =>
          insumo.denominacion.toLowerCase().includes(query.toLowerCase())
        );
    
        if (categoriaSeleccionada) {
          filtered = filtered.filter((insumo) =>
            insumo.categoria.denominacion.toLowerCase().includes(categoriaSeleccionada.toLowerCase())
          );
        }
    
        setFilteredInsumos(filtered);
      }, [query, insumos, categoriaSeleccionada]);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Insumos
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CustomButton onClick={handleNuevoInsumo} text="Agregar Insumo" />
                <SearchBar onSearch={handleSearch} />
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>Filtrar por categoría:</Typography>
                    <FormControl
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3f51b5',
                            },
                        }}
                    >
                        <Select
                            size="small"
                            id="categorias"
                            className="form-select"
                            onChange={(e) => {
                                const categoria = e.target.value;
                                setCategoriaSeleccionada(categoria);
                            }}
                            value={categoriaSeleccionada}
                            sx={{
                                width: 200, // Ajusta el ancho aquí
                                ml: 1,
                                bgcolor: '#ccc',
                            }}
                        >
                            <MenuItem value="">Seleccionar categoría...</MenuItem>
                            {categorias.map((categoria, index) => (
                                <MenuItem
                                    key={index}
                                    value={categoria.denominacion}
                                >
                                    <Typography variant="subtitle2">
                                        {categoria.denominacion}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

                <InsumoForm
                show={showForm}
                onHide={() => setShowForm(false)}
                onSave={handleGuardarInsumo}
                initialData={selectedInsumo}
            />
            {/* Tabla de Insumos */}
            <InsumoTable
                data={filteredInsumos}
                onEdit={handleEditarInsumo}
                onDelete={handleEliminarRecuperarInsumo}
            />
        </Box>
    );
};

export default ArticuloInsumoPage;
