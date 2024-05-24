import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ArticuloInsumo } from '../../types/ArticuloInsumo';
import { ImagenArticulo } from '../../types/ImagenArticulo';
import { UnidadMedida } from '../../types/UnidadMedida';
import { getImagenesArticulo } from '../../services/ImagenArticuloService';
import { crearUnidadMedida, getUnidadesMedida } from '../../services/UnidadMedidaService';
import { actualizarInsumo, crearInsumo} from '../../services/ArticuloInsumoService';
import AgregarImagenModal from '../ImagenesArticulo/AgregarImagenModal';
import AgregarUnidadMedidaModal from '../UnidadesMedida/AgregarUnidadMedidaModal';
import '../../styles/InsumoFormulario.css'
import { Categoria } from '../../types/Categoria';
import AgregarCategoriaModal from '../Categorias/AgregarCategoriaModal';
import { actualizarCategoria, getCategorias } from '../../services/CategoriaService';

interface InsumoFormularioProps {
    show: boolean;
    handleClose: () => void;
    onSave: (insumo: ArticuloInsumo) => void;
    isEdit?: boolean; // Indicador de edición
    insumo?: ArticuloInsumo;
}

const InsumoFormulario: React.FC<InsumoFormularioProps> = ({ show, handleClose, onSave, isEdit = false, insumo: insumoInicial }) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [insumo, setInsumo] = useState<ArticuloInsumo>(new ArticuloInsumo(0, false, '', 0, new Set<ImagenArticulo>(), new UnidadMedida(), categorias[0], 0, 0, 0, false));
    const [imagenes, setImagenes] = useState<ImagenArticulo[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const [showAgregarImagenModal, setShowAgregarImagenModal] = useState<boolean>(false);
    const [showNuevaUnidadModal, setShowNuevaUnidadModal] = useState<boolean>(false);
    const [showAgregarCategoriaModal, setAgregarCategoriaModal] = useState<boolean>(false);
    

    useEffect(() => {
        if (isEdit && insumoInicial) {
            setInsumo(insumoInicial); // Cargar los datos del insumo a editar
        } else {
            setInsumo(new ArticuloInsumo(0, false, '', 0, new Set<ImagenArticulo>(), new UnidadMedida(), categorias[0], 0, 0, 0, false)); // Limpiar el formulario si no estamos editando
        }
    }, [show, isEdit, insumoInicial]);

    useEffect(() => {
        async function cargarDatosIniciales() {
            try {
                const imagenes = await getImagenesArticulo();
                setImagenes(imagenes);
    
                const unidadesMedida = await getUnidadesMedida();
                setUnidadesMedida(unidadesMedida);

                const categorias = await getCategorias();
                setCategorias(categorias);
    
                // Si estamos editando y hay un insumo inicial, configurar las imágenes del insumo
                if (isEdit && insumoInicial) {
                    // Convertir el Set de imagenesArticulo a un array de ImagenArticulo
                    const imagenesInsumo = Array.from(insumoInicial.imagenesArticulo).map(imagen => new ImagenArticulo(imagen.id, imagen.eliminado, imagen.url));
                    setInsumo({ ...insumoInicial, imagenesArticulo: new Set(imagenesInsumo) });
                }
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                setTxtValidacion("Error al cargar datos iniciales. Por favor, inténtelo de nuevo más tarde.");
            }
        }
        cargarDatosIniciales();
    }, [show, isEdit, insumoInicial]);

    const guardarInsumo = async () => {
        // Validación de campos
        if (!insumo.denominacion || insumo.denominacion.trim() === "") {
            setTxtValidacion("Ingrese la denominación del Insumo");
            return;
        }
        if (!insumo.precioVenta || insumo.precioVenta <= 0) {
            setTxtValidacion("Ingrese un precio válido");
            return;
        }
        if (insumo.imagenesArticulo.size === 0) {
            setTxtValidacion("Ingrese al menos una imagen para el insumo");
            return;
        }
        if (!insumo.unidadMedida || !insumo.unidadMedida.id) {
            setTxtValidacion("Seleccione una unidad de medida");
            return;
        }
        if (!insumo.precioCompra || insumo.precioCompra <= 0) {
            setTxtValidacion("Ingrese un precio válido");
            return;
        }
        if (!insumo.stockActual || insumo.stockActual < 0) {
            setTxtValidacion("Ingrese un stock válido");
            return;
        }
        if (!insumo.stockMaximo || insumo.stockMaximo < 0) {
            setTxtValidacion("Ingrese una cantidad vendida válida");
            return;
        }
        if (insumo.esParaElaborar === undefined) {
            setTxtValidacion("Indique si es para elaborar");
            return;
        }
        if (!insumo.categoria || !insumo.categoria.id) {
            setTxtValidacion("Seleccione una categoría");
            return;
        }

        try {
            const imagenesArticuloArray = Array.from(insumo.imagenesArticulo);
            const insumoParaGuardar = {
                ...insumo,
                imagenesArticulo: imagenesArticuloArray
            };
    
            if (isEdit && insumo.id) {
                await actualizarInsumo(insumo.id, insumoParaGuardar); // Actualizar el insumo existente
                alert('El insumo se modificó correctamente');
                window.location.reload();
                
            } else {
                const nuevoInsumo = await crearInsumo(insumoParaGuardar); // Crear un nuevo insumo
                alert(`El insumo se guardó correctamente.`);
                onSave(nuevoInsumo);
            }

            handleClose();
        } catch (error) {
            console.error("Error al guardar el insumo:", error);
            setTxtValidacion("Error al guardar el insumo. Por favor, inténtelo de nuevo más tarde.");
        }
    };

    const handleImagenSeleccionada = (imagen: ImagenArticulo) => {
        setInsumo({ ...insumo, imagenesArticulo: new Set([imagen]) });
    };

    const handleNuevaUnidadMedida = async (denominacion: string) => {
        try {
            const nuevaUnidadMedida = await crearUnidadMedida({ denominacion });
            setUnidadesMedida([...unidadesMedida, nuevaUnidadMedida]);
            setInsumo({ ...insumo, unidadMedida: nuevaUnidadMedida });
            setShowNuevaUnidadModal(false);
        } catch (error) {
            console.error("Error al crear una nueva unidad de medida:", error);
        }
    };

    const handleActualizarCategoria = async (id: number, datosActualizados: any) => {
        try {
            await actualizarCategoria(id, datosActualizados);
            const nuevasCategorias = await getCategorias();
            setCategorias(nuevasCategorias);  // Actualiza las categorías directamente
        } catch (error) {
            console.error(`Error al actualizar la categoría con ID ${id}:`, error);
            // Aquí puedes manejar el error según tus necesidades
        }
    };

    const toggleAgregarImagenModal = () => {
        setShowAgregarImagenModal(!showAgregarImagenModal);
    };

    const toggleNuevaUnidadModal = () => {
        setShowNuevaUnidadModal(!showNuevaUnidadModal);
    };

    const toggleAgregarCategoria = () => {
        setAgregarCategoriaModal(!showAgregarCategoriaModal);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Editar Insumo" : "Agregar Insumo"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="txtDenominacion" className="form-label">Denominación</label>
                    <input type="text" id="txtDenominacion" className="form-control" placeholder="Ingrese la denominación" value={insumo.denominacion || ''} onChange={e => setInsumo({ ...insumo, denominacion: e.target.value })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtPrecioVenta" className="form-label">Precio de Venta</label>
                    <input type="number" id="txtPrecioVenta" className="form-control" placeholder="Ingrese el precio de venta" value={insumo.precioVenta || ''} onChange={e => setInsumo({ ...insumo, precioVenta: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cmbImagenes" className="form-label">Imagen</label>
                    {insumo.imagenesArticulo.size > 0 ? (
                        <div className="selected-image">
                            <img className = "img" src={Array.from(insumo.imagenesArticulo)[0].url} alt="Imagen seleccionada" />
                        </div>
                    ) : (
                        <div>No hay imagen seleccionada</div>
                    )}
                    <button className="btn-Guardar" onClick={toggleAgregarImagenModal}>Nueva Imagen</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="cmbUnidadMedida" className="form-label">Unidad de Medida</label>
                    <select
                        id="cmbUnidadMedida"
                        className="form-select"
                        value={insumo.unidadMedida.id || ''}
                        onChange={e => setInsumo({ ...insumo, unidadMedida: { id: parseInt(e.target.value), denominacion: "", eliminado: false } })}
                    >
                        <option className="form-select-option" value="">Seleccione una unidad de medida</option>
                        {unidadesMedida.map(unidad => (
                            <option className="form-select-option" key={unidad.id} value={unidad.id}>{unidad.denominacion}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button className="btn-Guardar" onClick={toggleNuevaUnidadModal}>Nueva Unidad Medida</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="txtPrecioCompra" className="form-label">Precio de Compra</label>
                    <input type="number" id="txtPrecioCompra" className="form-control" placeholder="Ingrese el precio de compra" value={insumo.precioCompra || ''} onChange={e => setInsumo({ ...insumo, precioCompra: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtStockActual" className="form-label">Stock Actual</label>
                    <input type="number" id="txtStockActual" className="form-control" placeholder="Ingrese el stock actual" value={insumo.stockActual || ''} onChange={e => setInsumo({ ...insumo, stockActual: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtStockMaximo" className="form-label">Stock Máximo</label>
                    <input type="number" id="txtStockMaximo" className="form-control" placeholder="Ingrese el stock máximo" value={insumo.stockMaximo || ''} onChange={e => setInsumo({ ...insumo, stockMaximo: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cmbCategoria" className="form-label">Categoría</label>
                    <select
                        id="cmbCategoria"
                        className="form-select"
                        value={insumo.categoria?.id || ''}
                        onChange={e => setInsumo({ 
                            ...insumo, 
                            categoria: { 
                                id: parseInt(e.target.value), 
                                denominacion: categorias.find(c => c.id === parseInt(e.target.value))?.denominacion || '', 
                                eliminado: false 
                        } 
                        })}
                    >
                        <option className="form-select-option" value="">Seleccione una categoría</option>
                        {Array.isArray(categorias) && categorias.length > 0 ? (
                            categorias.map(categoria => (
                                <option className="form-select-option" key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                            ))
                        ) : (
                            <option className="form-select-option" value="">Cargando categorías...</option>
                        )}
                    </select>
                </div>
                <div>
                    <button className="btn-Guardar" onClick={toggleAgregarCategoria}>Nueva Categoria</button>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" id="chkEsParaElaborar" className="form-check-input" checked={insumo.esParaElaborar || false} onChange={e => setInsumo({ ...insumo, esParaElaborar: e.target.checked })} />
                    <label htmlFor="chkEsParaElaborar" className="form-check-label">¿Es para elaborar?</label>
                </div>
                <div>
                    <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-Cancelar" variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button className ="btn-Guardar" variant="primary" onClick={guardarInsumo}>
                    Guardar
                </Button>
            </Modal.Footer>
            <div>
                {/* Modal para agregar imagen */}
                {showAgregarImagenModal && (
                    <AgregarImagenModal
                        show={showAgregarImagenModal}
                        onSave={handleImagenSeleccionada}
                        toggleModal={toggleAgregarImagenModal}
                        imagenes={imagenes}
                        setImagenes={setImagenes}
                    />
                )}
            </div>
            <div>
                {/* Modal para agregar unidad de medida */}
                <AgregarUnidadMedidaModal
                    show={showNuevaUnidadModal}
                    onHide={() => setShowNuevaUnidadModal(false)}
                    agregarUnidadMedida={handleNuevaUnidadMedida}
                />
            </div>
            <div>
            <AgregarCategoriaModal
                show={showAgregarCategoriaModal}
                onHide={() => setAgregarCategoriaModal(false)}
                actualizarCategorias={handleActualizarCategoria}
            />
            </div>
        </Modal>
    );
}

export default InsumoFormulario;
