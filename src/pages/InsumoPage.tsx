import React from 'react';
import InsumoList from '../components/Insumos/InsumoList';
import { Typography } from '@mui/material';

const InsumoPage: React.FC = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom p={3}>
        Insumos
      </Typography>
      <InsumoList />
    </>
  );
};

export default InsumoPage;