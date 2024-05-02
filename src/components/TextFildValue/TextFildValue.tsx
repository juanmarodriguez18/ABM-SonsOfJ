import { ErrorMessage, Field } from "formik";
import './textFildValue.css'
interface props {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}

const TextFieldValue = ({
  label,
  name,
  type,
  placeholder,
}: props) => {

  // componente para crear los input de un formulario con formik
  return (
    <div className="mt-2" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: ".3rem 0",
        }}
      >
        <label
          htmlFor={label}
          style={{
            color: "black",
            fontFamily: "sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {label}
        </label>
      </div>

      <Field
        className={`form-control  mb-3  input-formulario `}
        placeholder={placeholder}
        name={name}
        type={type}
        autoComplete="off"
      />
      <ErrorMessage component="div" name={name} className="error" />
    </div>
  );
};

export default TextFieldValue;
