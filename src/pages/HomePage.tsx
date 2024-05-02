import { useState } from 'react'
import { TablePersonas } from '../components/TablePersonas/TablePersonas';
import './HomePage.css'
export const HomePage = () => {


  const [ShowModal, setShowModal] = useState(false);

  return (
    <div className='ContainerPrincipal'>
      <div className='ContainerButton'>
        <button className='buttonAdd' onClick={() => setShowModal(true)}>
          Agregar Persona
        </button>
      </div>
      <TablePersonas
        ShowModal={ShowModal}
        setShowModal={setShowModal}
      />
    </div>
  )
}
