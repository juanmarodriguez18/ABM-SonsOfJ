
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postData, putData } from "../../services/GenericFetch";

// Tipos de Props y Campo
interface FieldConfig {
  name: string;
  type: string;
  placeholder: string;
  label: string;
  validation: Yup.AnySchema;
}

interface GenericFormProps {
  showModal: boolean;
  handleClose: () => void;
  editing?: boolean;
  initialValues: any;
  fields: FieldConfig[];
  url: string;
  getItems: Function;
}

// Componente de Formulario Genérico
const GenericFormModal = ({
  showModal,
  handleClose,
  editing,
  initialValues,
  fields,
  url,
  getItems,
}: GenericFormProps) => {
  // Crear un esquema de validación dinámicamente basado en los campos
  const validationSchema = Yup.object(
    fields.reduce((schema, field) => {
      schema[field.name] = field.validation;
      return schema;
    }, {} as { [key: string]: Yup.AnySchema })
  );

  // Renderizado del componente
  return (
    <Modal show={showModal} onHide={handleClose} size="lg" backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{editing ? "Editar Item" : "Añadir Item"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values) => {
            if (editing) {
              await putData(`${url}/${values.id}`, values);
            } else {
              await postData(url, values);
            }
            getItems();
            handleClose();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {fields.map((field) => (
                <div key={field.name} className="mb-3">
                  <label htmlFor={field.name}>{field.label}</label>
                  <Field
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    className={`form-control ${errors[field.name] && touched[field.name] ? "is-invalid" : ""}`}
                  />
                  <ErrorMessage name={field.name}>
                    {(msg: string) => <div className="invalid-feedback">{msg}</div>}
                  </ErrorMessage>
                </div>
              ))}
              <div className="d-flex justify-content-end">
                <Button variant="success" type="submit">
                  Enviar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default GenericFormModal;
