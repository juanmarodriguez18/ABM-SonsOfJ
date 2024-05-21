import React, { useState } from "react";
import GenericFormModal from "./GenericFormModal";
import * as Yup from "yup";
import { ArticuloInsumo } from "../../types/ArticuloInsumo";
import { UnidadMedida } from "../../types/UnidadMedida";
import { Categoria } from "../../types/Categoria";
import { ImagenArticulo } from "../../types/ImagenArticulo";
import AgregarImagenModal from "../Modals/AgregarImagenModal";

interface InsumoFormProps {
  showModal: boolean;
  handleClose: () => void;
  editing?: boolean;
  insumo?: ArticuloInsumo;
  getInsumos: () => void;
}

const InsumoForm: React.FC<InsumoFormProps> = ({
  showModal,
  handleClose,
  editing,
  insumo,
  getInsumos,
}) => {
  const [showAgregarImagenModal, setShowAgregarImagenModal] = useState(false);
  const [imagenes, setImagenes] = useState<ImagenArticulo[]>([]);

  const initialValues: ArticuloInsumo = {
    id: insumo?.id || 0,
    eliminado: insumo?.eliminado || false,
    denominacion: insumo?.denominacion || "",
    precioVenta: insumo?.precioVenta || 0,
    imagenesArticulo: insumo?.imagenesArticulo || new Set(),
    unidadMedida: insumo?.unidadMedida || new UnidadMedida(),
    categoria: insumo?.categoria || new Categoria(""),
    precioCompra: insumo?.precioCompra || 0,
    stockActual: insumo?.stockActual || 0,
    stockMaximo: insumo?.stockMaximo || 0,
    esParaElaborar: insumo?.esParaElaborar || false,
  };

  const fields = [
    {
      name: "denominacion",
      type: "text",
      placeholder: "Denominación",
      label: "Denominación:",
      validation: Yup.string().required("Campo requerido"),
    },
    {
      name: "precioVenta",
      type: "number",
      placeholder: "Precio de Venta",
      label: "Precio de Venta:",
      validation: Yup.number().required("Campo requerido"),
    },
    {
      name: "precioCompra",
      type: "number",
      placeholder: "Precio de Compra",
      label: "Precio de Compra:",
      validation: Yup.number().required("Campo requerido"),
    },
    {
      name: "stockActual",
      type: "number",
      placeholder: "Stock Actual",
      label: "Stock Actual:",
      validation: Yup.number().required("Campo requerido"),
    },
    {
      name: "stockMaximo",
      type: "number",
      placeholder: "Stock Máximo",
      label: "Stock Máximo:",
      validation: Yup.number().required("Campo requerido"),
    },
    {
      name: "esParaElaborar",
      type: "checkbox",
      placeholder: "Es para elaborar",
      label: "Es para elaborar:",
      validation: Yup.boolean(),
    },
  ];

  const url = "http://localhost:8080/insumos";

  const handleAgregarImagen = () => {
    setShowAgregarImagenModal(true);
  };

  return (
    <>
      <GenericFormModal
        showModal={showModal}
        handleClose={handleClose}
        editing={editing}
        initialValues={initialValues}
        fields={fields}
        url={url}
        getItems={getInsumos}
      />

      {/* Botón para abrir el modal de agregar imagen */}
      <button
        className="btn btn-primary"
        onClick={handleAgregarImagen}
        style={{ marginLeft: "10px" }}
      >
        Agregar Imagen
      </button>

      {/* Agregar el modal de agregar imagen */}
      {showAgregarImagenModal && (
        <AgregarImagenModal
          imagenes={imagenes}
          setImagenes={setImagenes}
          toggleModal={() => setShowAgregarImagenModal(false)}
          show={showAgregarImagenModal}
          onSave={(imagen: ImagenArticulo) => {
            setImagenes([...imagenes, imagen]);  // Agregar la imagen al estado de imágenes del insumo
            setShowAgregarImagenModal(false);     // Cerrar el modal de agregar imagen
          }}
        />
      )}
    </>
  );
};

export default InsumoForm;
