import React, { useEffect, useState } from "react";
import { ArticuloManufacturado } from "../../types/ArticuloManufacturado";
import { Link } from "react-router-dom";
import { recuperarManufacturado} from "../../services/ArticuloManufacturadoService";
import { eliminarArticuloManufacturado } from "../../services/ArticuloManufacturadoService";
import { Box, TableCell, TableRow } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from '@mui/icons-material/Restore'
import InfoIcon from "@mui/icons-material/Info";
import ManufacturadoFormulario from "./ManufacturadoFormulario";
import { getArticuloManufacturadoDetalleById } from "../../services/ArticuloManufacturadoDetalleService";
import { ArticuloManufacturadoDetalle } from "../../types/ArticuloManufacturadoDetalle";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { UnidadMedida } from "../../types/UnidadMedida";
import { getInsumos } from "../../services/ArticuloInsumoService";
import { getUnidadesMedida } from "../../services/UnidadMedidaService";

const Articulo: React.FC<{ articulo: ArticuloManufacturado, onSave: (articulo: ArticuloManufacturado) => void}> = ({ articulo, onSave }) => {
  const [manufacturado, setManufacturado] = useState<ArticuloManufacturado>(articulo);
  const imagenesArray = Array.from(articulo.imagenesArticulo);
  const primeraImagen = imagenesArray[0]?.url;
  const [showForm, setShowForm] = useState(false);
  const [detallesEditar, setDetallesEditar] = useState<ArticuloManufacturadoDetalle[]>([]);
  const [articulosInsumo, setArticulosInsumo] = useState<ArticuloInsumo[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

  const handleEliminarRecuperar = async () => {
    try {
      if (manufacturado.eliminado) {
        await recuperarManufacturado(manufacturado.id); // Lógica para recuperar el manufacturado
        setManufacturado({ ...manufacturado, eliminado: false });
      } else {
        await eliminarArticuloManufacturado(manufacturado.id); // Lógica para eliminar lógicamente el insumo
        setManufacturado({ ...manufacturado, eliminado: true });
      }
    } catch (error) {
      console.error("Error al actualizar el estado del manufacturado:", error);
      // Manejo de errores
    }
  };

  const handleSave = (updatedArticulo: ArticuloManufacturado) => {
    setManufacturado(updatedArticulo);
    onSave(updatedArticulo); // Actualiza el artículo en la lista de artículos en el componente padre
  };

  const handleModificar = async () => {
    const detalles = await getArticuloManufacturadoDetalleById(manufacturado.id);
    setDetallesEditar(detalles);
    setShowForm(true);
  };

  useEffect(() => {
    const fetchInsumosYUnidades = async () => {
      const insumosData = await getInsumos();
      const unidadesData = await getUnidadesMedida();
      setArticulosInsumo(insumosData);
      setUnidadesMedida(unidadesData);
    };

    fetchInsumosYUnidades();
  }, []);

  return (
    <TableRow
      className={`row ${manufacturado.eliminado ? "eliminado" : ""}`}
      sx={{ display: "flex", flexDirection: "row" }}
    >
      <TableCell className="col" align="center">{articulo.denominacion}</TableCell>
      <TableCell className="col" align="center">
        {primeraImagen && (
          <img className="img" src={primeraImagen} alt={articulo.denominacion} />
        )}
      </TableCell>
      <TableCell className="col" align="center">{articulo.descripcion}</TableCell>
      <TableCell className="col" align="center">${articulo.precioVenta}</TableCell>
      <TableCell className="col" align="center">{articulo.tiempoEstimadoMinutos} minutos</TableCell>
      <TableCell className="col" sx={{ display: "flex" }} align="center">
        <Box onClick={handleEliminarRecuperar}>
          {manufacturado.eliminado ? (
            <RestoreIcon
              sx={{
                bgcolor: "#ef6c00",
                color: "#fff",
                borderRadius: "50%",
                width: 30,
                height: 30,
                p: 0.5,
                marginRight: 1,
                "&:hover": {
                  bgcolor: "#e65100",
                  cursor: "pointer",
                },
              }}
            />
          ) : (
            <DeleteIcon
              sx={{
                bgcolor: "#e53935",
                color: "#fff",
                borderRadius: "50%",
                width: 30,
                height: 30,
                p: 0.5,
                marginRight: 1,
                "&:hover": {
                  bgcolor: "#b71c1c",
                  cursor: "pointer",
                },
              }}
            />
          )}
        </Box>
        <Box onClick={manufacturado.eliminado ? undefined : handleModificar}>
          <ModeEditIcon
            sx={{
              bgcolor: "#3f51b5",
              color: "#fff",
              borderRadius: "50%",
              width: 30,
              height: 30,
              p: 0.5,
              marginRight: 1,
              "&:hover": {
                bgcolor: "#1a237e",
                cursor: manufacturado.eliminado ? "not-allowed" : "pointer",
              },
            }}
          />
        </Box>
        <Box>
          <Link to={`/articulos/${articulo.id}`}>
            <InfoIcon
              sx={{
                bgcolor: "#ff5722",
                color: "#fff",
                borderRadius: "50%",
                width: 30,
                height: 30,
                p: 0.5,
                "&:hover": {
                  bgcolor: "#d84315",
                },
              }}
            />
          </Link>
        </Box>
      </TableCell>
      {/* Formulario de Modificar */}
      <ManufacturadoFormulario
        show={showForm}
        handleClose={() => setShowForm(false)}
        onSave={handleSave}
        isEdit={true}
        articuloManufacturadoInicial={manufacturado}
        articulosInsumo={articulosInsumo}
        unidadesMedida={unidadesMedida}
        imagenesArticulo={[]}
        detalles={detallesEditar} // Pasa los detalles al modal
      />
    </TableRow>
  );
};

export default Articulo;
