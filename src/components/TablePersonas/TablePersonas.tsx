// Importación de las dependencias necesarias
import withReactContent from 'sweetalert2-react-content';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { persona } from "../../types/persona";
import { deleteData, getData } from "../../services/GenericFetch";
import { ModalFormulario } from "../ModalFormulario/ModalFormulario";
import swal from 'sweetalert2'

// Definición de las propiedades que recibe el componente
interface props {
  setShowModal: any;
  ShowModal: boolean;
}

export const TablePersonas = (
  { setShowModal, ShowModal }: props
) => {
  // URL de la API obtenida desde las variables de entorno
  const urlapi = import.meta.env.VITE_API_URL;

  // Estado para controlar la carga de datos
  const [Loading, setLoading] = useState(false);

  // Estado para almacenar la lista de personas
  const [personas, setPersonas] = useState<persona[]>([]);

  // Estado para la edición de una persona
  const [personaEdit, setPersonaEdit] = useState<persona>();

  // Estado para controlar si se está editando
  const [editing, setEditing] = useState(false);

  // Función para cerrar el modal de edición/agregación
  function handleClose() {
    setShowModal(false);
    setEditing(false);
    setPersonaEdit(undefined);
  }

  // Función para obtener los datos de personas desde la API
  async function getDataPersonas() {
    setLoading(true);
    await getData<persona[]>(urlapi + 'api/personas')
      .then((personaData) => {
        setPersonas(personaData);
        setLoading(false);
      });
  }

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    getDataPersonas();
  }, []);

  // Configuración de SweetAlert2 con React
  const MySwal = withReactContent(swal);

  // Manejo de eliminación de persona
  const handleDelete = (id: number) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta operación es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteData(urlapi + 'api/personas/' + id);
        getDataPersonas();
      }
    });
  }

  // Opciones de formato de fecha
  const dateFormatOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  // Función para formatear fechas
  const dateFormater = (dateJava: string) => {
    const date = new Date(dateJava);
    const formatedDate = date.toLocaleDateString('es-AR', dateFormatOptions);
    return formatedDate;
  }

  // Renderizado del componente TablePersonas
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Apellido</TableCell>
              <TableCell align="center">Correo electrónico</TableCell>
              <TableCell align="center">Número de teléfono</TableCell>
              <TableCell align="center">Fecha de nacimiento</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!Loading ? (
              <>
                {personas.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row.firstName}</TableCell>
                    <TableCell align="center">{row.lastName} </TableCell>
                    <TableCell align="center">{row.email} </TableCell>
                    <TableCell align="center">{row.phoneNumber} </TableCell>
                    <TableCell align="center">{dateFormater(row.birthdate)} </TableCell>
                    <TableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="fa-solid fa-trash"
                          style={{ cursor: "pointer", color: '#ff2040' }}
                          onClick={() => {
                            if (row.id)
                              handleDelete(row.id);
                          }}
                        ></i>
                        <i
                          className="fa-solid fa-pen"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setPersonaEdit(row);
                            setEditing(true);
                            setShowModal(true);
                          }}
                        ></i>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <td colSpan={8} style={{ height: "5rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Spinner animation="grow" />
                </div>
              </td>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalFormulario
        getPersonas={getDataPersonas}
        handleClose={handleClose}
        showModal={ShowModal}
        editing={editing}
        persona={personaEdit}
      />


    </div>
  )
}
