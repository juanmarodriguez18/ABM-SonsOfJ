import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import Insumo from './ArticuloInsumo';
import InsumoFormulario from './InsumoFormulario';
import { getInsumos } from '../../services/ArticuloInsumoService';
import { getCategorias } from '../../services/CategoriaService';
import { Categoria } from '../../types/Categoria';
import { Typography, Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomButton from '../Shared/CustomButton';
import CategoriaFiltro from '../Categorias/CategoriaFiltro';

const InsumoList: React.FC = () => {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [filteredInsumos, setFilteredInsumos] = useState<ArticuloInsumo[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Insumos
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CustomButton onClick={() => setShowForm(true)} text="Agregar Insumo" icon={<AddIcon />} />
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
          width: '100%',
          marginTop: 2,
          bgcolor: '#eee',
          boxShadow: 2,
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#aaa' }}>
            <TableRow sx={{ display: 'flex', flexDirection: 'row' }}>
              <TableCell align="center" className="col">Denominación</TableCell>
              <TableCell align="center" className="col">Imagen</TableCell>
              <TableCell align="center" className="col">Precio Compra</TableCell>
              <TableCell align="center" className="col">Stock Actual</TableCell>
              <TableCell align="center" className="col">Stock Mínimo</TableCell>
              <TableCell align="center" className="col">Es para elaborar</TableCell>
              <TableCell align="center" className="col">Operaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ display: 'block', overflowY: 'auto', maxHeight: '74vh' }}>
            {filteredInsumos.map((insumo) => (
                <Insumo
                  key={insumo.id}
                  articulo={insumo}
                />
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
