import React, { useEffect, useState } from "react";
import { getArticulosManufacturados } from "../../services/ArticuloManufacturadoService";
import Articulo from "./Articulo";
import SearchBar from "../SearchBar/SearchBar";
import { ArticuloManufacturado } from "../../types/ArticuloManufacturado";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { UnidadMedida } from "../../types/UnidadMedida";
import { TableContainer, Typography, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { getInsumos } from "../../services/ArticuloInsumoService";
import { getUnidadesMedida } from "../../services/UnidadMedidaService";
import { getCategorias } from "../../services/CategoriaService";
import { Categoria } from "../../types/Categoria";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../Shared/CustomButton";
import ManufacturadoFormulario from "./ManufacturadoFormulario";
import CategoriaFiltro from "../Categorias/CategoriaFiltro";

const ArticuloList: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filteredArticulos, setFilteredArticulos] = useState<ArticuloManufacturado[]>([]);
  const [query, setQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getArticulosManufacturados();
      setArticulos(data);
      setFilteredArticulos(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    let filtered = articulos.filter((articulo) =>
      articulo.denominacion.toLowerCase().includes(query.toLowerCase())
    );

    if (categoriaSeleccionada) {
      filtered = filtered.filter((articulo) =>
        articulo.categoria.denominacion.toLowerCase().includes(categoriaSeleccionada.toLowerCase())
      );
    }

    setFilteredArticulos(filtered);
  }, [query, articulos, categoriaSeleccionada]);

  useEffect(() => {
    const fetchInsumosYUnidades = async () => {
      const insumosData = await getInsumos();
      const unidadesData = await getUnidadesMedida();
      setArticulosInsumo(insumosData);
      setUnidadesMedida(unidadesData);
    };

    fetchInsumosYUnidades();
  }, []);

  const agregarArticuloManufacturado = (nuevoArticulo: ArticuloManufacturado) => {
    setArticulos([...articulos, nuevoArticulo]);
    setFilteredArticulos([...articulos, nuevoArticulo]);
  };

  const actualizarArticuloManufacturado = (articuloActualizado: ArticuloManufacturado) => {
    setArticulos(prevArticulos =>
      prevArticulos.map(articulo =>
        articulo.id === articuloActualizado.id ? articuloActualizado : articulo
      )
    );
    setFilteredArticulos(prevFilteredArticulos =>
      prevFilteredArticulos.map(articulo =>
        articulo.id === articuloActualizado.id ? articuloActualizado : articulo
      )
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manufacturados
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CustomButton onClick={() => setShowModal(true)} text="Agregar Manufacturado" icon={<AddIcon />} />
        <SearchBar onSearch={setQuery} />
        <CategoriaFiltro
          categorias={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
        />
      </Box>

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
            <TableRow sx={{ display: "flex", flexDirection: "row" }}>
              <TableCell align="center" className="col">Denominacion</TableCell>
              <TableCell align="center" className="col">Imagen</TableCell>
              <TableCell align="center" className="col">Descripción</TableCell>
              <TableCell align="center" className="col">Precio</TableCell>
              <TableCell align="center" className="col">Tiempo estimado</TableCell>
              <TableCell align="center" className="col">Operaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ display: 'block', overflowY: 'auto', maxHeight: '74vh' }}>
            {filteredArticulos.map((articulo) => (
                <Articulo 
                  key={articulo.id} 
                  articulo={articulo} 
                  onSave={actualizarArticuloManufacturado} 
                />   
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ManufacturadoFormulario
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={agregarArticuloManufacturado}
        articulosInsumo={articulosInsumo}
        unidadesMedida={unidadesMedida}
        imagenesArticulo={[]} // Pasa las imágenes del artículo si es necesario
        detalles={[]} // Pasa los detalles al modal
      />
    </Box>
  );
};

export default ArticuloList;
