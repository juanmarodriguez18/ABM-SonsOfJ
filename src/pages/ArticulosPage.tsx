import React from 'react';
import ArticuloList from '../components/ArticulosManufacturados/ArticuloList';

const ArticulosPage: React.FC = () => {
  return (
    <div className="articulos-page">
      <h1>Artículos Manufacturados</h1>
      <ArticuloList />
    </div>
  );
};

export default ArticulosPage;
