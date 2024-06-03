import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { UnidadMedida } from '../../types/UnidadMedida';

interface UnidadesMedidaProps {
  unidadMedida: UnidadMedida;
  onEditar: () => void;
}

const UnidadesMedida: React.FC<UnidadesMedidaProps> = ({ unidadMedida, onEditar }) => {
  const [uMedida] = useState<UnidadMedida>(unidadMedida);

  const handleClick = async () => {
    //await handleEliminarRecuperar(uMedida, (entidad: UnidadMedida) => setUMedida(entidad), endpoint);
  };

  return (
    <Container>
      <div className="mt-3">
        <div>
          <p>{unidadMedida.denominacion}</p>
        </div>
        <div>
          <Button className={uMedida.eliminado ? "recuperarBtn" : "eliminarBtn"} onClick={handleClick}>
            {uMedida.eliminado ? 'Recuperar' : 'Eliminar'}
          </Button>
          <Button className="modificarBtn" onClick={onEditar}>
            Modificar
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default UnidadesMedida; 
