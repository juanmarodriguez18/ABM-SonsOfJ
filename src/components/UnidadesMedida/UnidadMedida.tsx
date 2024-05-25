import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { UnidadMedida } from '../../types/UnidadMedida';
import { handleEliminarRecuperar } from '../Shared/Functions';

interface UnidadesMedidaProps {
  unidadMedida: UnidadMedida;
  onEditar: () => void;
}

const UnidadesMedida: React.FC<UnidadesMedidaProps> = ({ unidadMedida, onEditar }) => {
  const [uMedida, setUMedida] = useState<UnidadMedida>(unidadMedida);
  const endpoint = "http://localhost:8080/unidad-medida";

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
