import React, { useEffect, useState } from "react";
import { getArticulosManufacturados } from "../../services/ArticuloManufacturadoService";
import Articulo from "./Articulo";
import SearchBar from "../SearchBar/SearchBar";
import AgregarArticuloManufacturadoModal from "./AgregarArticuloManufacturadoModal";
import { ArticuloManufacturado } from "../../types/ArticuloManufacturado";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { UnidadMedida } from "../../types/UnidadMedida";
import {
  FormControl,
  MenuItem,
  TableContainer,
  Typography,
  Box,
  Select,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getInsumos } from "../../services/ArticuloInsumoService";
import { getUnidadesMedida } from "../../services/UnidadMedidaService";
import { getCategorias } from "../../services/CategoriaService";
import { Categoria } from "../../types/Categoria";
import AddIcon from "@mui/icons-material/Add";
import { ArticuloManufacturadoDetalle } from "../../types/ArticuloManufacturadoDetalle";
import CustomButton from "../Shared/CustomButton";

const ArticuloList: React.FC = () => {
  const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([]);
  const [filteredArticulos, setFilteredArticulos] = useState<
    ArticuloManufacturado[]
  >([]);
  const [query, setQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Array de objetos Categoria
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");
  const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);

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
        articulo.categoria.denominacion
          .toLowerCase()
          .includes(categoriaSeleccionada.toLowerCase())
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

  const agregarArticuloManufacturado = (
    nuevoArticulo: ArticuloManufacturado
  ) => {
    setArticulos([...articulos, nuevoArticulo]);
    setFilteredArticulos([...articulos, nuevoArticulo]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", pl: 2 }}>
      <Box>
        <SearchBar onSearch={setQuery} />
        <CustomButton
          onClick={() => setShowModal(true)}
          text="Agregar Manufacturado"
          icon={<AddIcon />}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Typography variant="subtitle2">Filtrar por categoría:</Typography>
        <FormControl
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#3f51b5",
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
              width: 200,
              height: 25,
              ml: 1,
              bgcolor: "#ccc",
            }}
          >
            <MenuItem value="">Seleccionar categoría...</MenuItem>
            {categorias.map((categoria, index) => (
              <MenuItem
                className="form-select-option"
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
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 8,
          width: "99%",
          marginTop: 2,
          bgcolor: "#eee",
          boxShadow: 2,
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: "#aaa" }}>
            <TableRow sx={{ display: "flex", flexDirection: "row" }}>
              <TableCell align="center" className="col">
                Denominacion
              </TableCell>
              <TableCell align="center" className="col">
                Imagen
              </TableCell>
              <TableCell align="center" className="col">
                Descripción
              </TableCell>
              <TableCell align="center" className="col">
                Precio
              </TableCell>
              <TableCell align="center" className="col">
                Tiempo estimado
              </TableCell>
              <TableCell align="center" className="col">
                Operaciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticulos.map((articulo) => (
              <TableRow>
                <Articulo key={articulo.id} articulo={articulo} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AgregarArticuloManufacturadoModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={agregarArticuloManufacturado}
        articulosInsumo={articulosInsumo}
        unidadesMedida={unidadesMedida}
        imagenesArticulo={[]} // Pasa las imágenes del artículo si es necesario
        detalles={[]}      />
    </Box>
  );
};

export default ArticuloList;
