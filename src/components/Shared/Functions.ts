import { eliminarEntidad, recuperarEntidad } from "../../services/GenericFetch";
import { Base } from "../../types/Base";

export const handleEliminarRecuperar = async <T extends Base> (
    entidad: T,
    setEntidad: React.Dispatch<React.SetStateAction<T[]>>,
    endpoint: string
) => {
    try {
        if (entidad.eliminado) {
            await recuperarEntidad(entidad.id, endpoint); // Lógica para recuperar la entidad
            setEntidad((prevData) => prevData.map((e) => (e.id === entidad.id ? { ...e, eliminado: false } : e)));
        } else {
            await eliminarEntidad(entidad.id, endpoint); // Lógica para eliminar lógicamente la entidad
            setEntidad((prevData) => prevData.map((e) => (e.id === entidad.id ? { ...e, eliminado: true } : e)));
        }
    } catch (error) {
        console.error('Error al actualizar el estado de la entidad:', error);
        // Manejo de errores
    }
};