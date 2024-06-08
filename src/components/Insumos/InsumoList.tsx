import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import Insumo from './ArticuloInsumo';
import InsumoFormulario from './InsumoFormulario';
import { getInsumos } from '../../services/ArticuloInsumoService';
import { getCategorias } from '../../services/CategoriaService';
import { Categoria } from '../../types/Categoria';
import { Button, FormControl, MenuItem, Select, Typography, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const InsumoList: React.FC = () => {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [filteredInsumos, setFilteredInsumos] = useState<ArticuloInsumo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]); // Array de objetos Categoria
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ArticuloInsumo[] = await getInsumos();
        setInsumos(data);
        setFilteredInsumos(data);
      } catch (error) {
        console.error('Error fetching insumos:', error);
      }
    };

    fetchData();
  }, []);

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

  const handleSaveInsumo = (newInsumo: ArticuloInsumo) => {
    setInsumos([...insumos, newInsumo]);
    setFilteredInsumos([...insumos, newInsumo]);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', pl: 2 }}>
      <Box sx={{ display: 'flex' }}>
        <SearchBar onSearch={setQuery} />
        <Button
          className="btn-Guardar"
          onClick={() => setShowForm(true)}
          sx={{
            bgcolor: '#43a047',
            color: '#fff',
            borderRadius: 8,
            textTransform: 'none',
            ml: 2,
            '&:hover': {
              bgcolor: '#1b5e20',
            },
          }}
        >
          <AddIcon />
          Agregar Insumo
        </Button>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="subtitle2">Filtrar por categoría:</Typography>
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
              width: 200,
              height: 25,
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
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 8,
          width: '99%',
          marginTop: 2,
          bgcolor: '#eee',
          boxShadow: 2,
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#aaa' }}>
            <TableRow sx={{ display: 'flex', flexDirection: 'row' }}>
              <TableCell align="center" className="col">
                Denominación
              </TableCell>
              <TableCell align="center" className="col">
                Imagen
              </TableCell>
              <TableCell align="center" className="col">
                Precio Compra
              </TableCell>
              <TableCell align="center" className="col">
                Stock Actual
              </TableCell>
              <TableCell align="center" className="col">
                Stock Mínimo
              </TableCell>
              <TableCell align="center" className="col">
                Es para elaborar
              </TableCell>
              <TableCell align="center" className="col">
                Operaciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInsumos.map((insumo) => (
              <TableRow key={insumo.id}>
                <Insumo articulo={insumo} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showForm && (
        <InsumoFormulario
          show={showForm}
          handleClose={handleCancel}
          onSave={handleSaveInsumo}
        />
      )}
    </Box>
  );
};

export default InsumoList;
