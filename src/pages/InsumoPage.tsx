import React from 'react';
import InsumoList from '../components/Insumos/InsumoList';

const InsumoPage: React.FC = () => {
  return (
    <div className="insumo-page">
      <h1>Insumos</h1>
      <InsumoList />
    </div>
  );
};

export default InsumoPage;