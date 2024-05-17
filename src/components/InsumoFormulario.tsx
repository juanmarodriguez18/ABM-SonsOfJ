import React, { useState, useEffect } from 'react';
import { ArticuloInsumo } from '../types/ArticuloInsumo';
import { ImagenArticulo } from '../types/ImagenArticulo';
import { UnidadMedida } from '../types/UnidadMedida';
import { getImagenesArticulo } from '../services/ImagenArticuloService';
import { crearUnidadMedida, getUnidadesMedida } from '../services/UnidadMedidaService';
import { useNavigate, useParams } from 'react-router-dom';
import { actualizarInsumo, crearInsumo, getInsumoById } from '../services/ArticuloInsumoService';
import AgregarImagenModal from './AgregarImagenModal';
import { Modal, Button } from 'react-bootstrap';
import '../styles/InsumoFormulario.css';
import AgregarUnidadMedidaModal from './AgregarUnidadMedidaModal';

interface InsumoFormularioProps {
    show: boolean;
    handleClose: () => void;
    onSave: (insumo: ArticuloInsumo) => void;
}


function InsumoFormulario({ show, handleClose, onSave }: InsumoFormularioProps) {
    const navigate = useNavigate();
    const { insumo_id } = useParams();

    const [insumo, setInsumo] = useState<ArticuloInsumo>(new ArticuloInsumo());
    const [imagenes, setImagenes] = useState<ImagenArticulo[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const [showAgregarImagenModal, setShowAgregarImagenModal] = useState<boolean>(false); // Estado para controlar la visibilidad del modal
    const [showNuevaUnidadModal, setShowNuevaUnidadModal] = useState<boolean>(false); // Estado para el modal de nueva unidad de medida

    useEffect(() => {
        async function cargarInsumo() {
            if (insumo_id) {
                const insumoCargado = await getInsumoById(parseInt(insumo_id));
                setInsumo(insumoCargado);
            } else {
                setInsumo(new ArticuloInsumo());
            }
        }
        cargarInsumo();
    }, [insumo_id]);

    useEffect(() => {
        async function cargarDatosIniciales() {
            try {
                const imagenes = await getImagenesArticulo();
                setImagenes(imagenes);
                const unidadesMedida = await getUnidadesMedida();
                setUnidadesMedida(unidadesMedida);
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                setTxtValidacion("Error al cargar datos iniciales. Por favor, inténtelo de nuevo más tarde.");
            }
        }
        cargarDatosIniciales();
    }, []);

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

        try {
            // Convertimos el Set de imágenes a un array para enviar al backend
            const imagenesArticuloArray = Array.from(insumo.imagenesArticulo);
            const insumoParaGuardar = {
            ...insumo,
            imagenesArticulo: imagenesArticuloArray
            };

            if (insumo.id) {
                await actualizarInsumo(insumo.id, insumoParaGuardar);
            } else {
                await crearInsumo(insumoParaGuardar);
                alert(`El insumo se guardó correctamente.`);
                //window.location.reload();
            }
            onSave(insumo);
            handleClose();
            navigate('/insumos');
        } catch (error) {
            console.error("Error al guardar el insumo:", error);
            setTxtValidacion("Error al guardar el insumo. Por favor, inténtelo de nuevo más tarde.");
        }
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        const selectedImagenes = imagenes.filter(imagen => selectedIds.includes(imagen.id));
        setInsumo({ ...insumo, imagenesArticulo: new Set(selectedImagenes) });
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

    const toggleAgregarImagenModal = () => {
        setShowAgregarImagenModal(!showAgregarImagenModal);
    };

    const toggleNuevaUnidadModal = () => {
        setShowNuevaUnidadModal(!showNuevaUnidadModal);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{insumo_id ? "Editar Insumo" : "Agregar Insumo"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="txtDenominacion" className="form-label">Denominación</label>
                    <input type="text" id="txtDenominacion" className="form-control" placeholder="Ingrese la denominación" value={insumo.denominacion || ''} onChange={e => setInsumo({ ...insumo, denominacion: e.target.value })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtPrecioVenta" className="form-label">Precio de Venta</label>
                    <input type="number" id="txtPrecioVenta" className="form-control" placeholder="Ingrese el precio de venta" value={insumo.precioVenta || 0} onChange={e => setInsumo({ ...insumo, precioVenta: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cmbImagenes" className="form-label">Imágenes</label>
                    <select id="cmbImagenes" className="form-select" multiple value={Array.from(insumo.imagenesArticulo).map(img => img.id.toString())} onChange={handleImagenChange}>
                        {[...imagenes].map(imagen => ( <option key={imagen.id} value={imagen.id.toString()}> {imagen.url}</option>))}
                    </select>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={toggleAgregarImagenModal}>Nueva Imagen</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="cmbUnidadMedida" className="form-label">Unidad de Medida</label>
                    <select id="cmbUnidadMedida" className="form-select" value={insumo.unidadMedida?.id || ''} onChange={e => setInsumo({ ...insumo, unidadMedida: { id: parseInt(e.target.value), denominacion: "", eliminado: false } })}>
                        <option value="">Seleccione una unidad de medida</option>
                        {unidadesMedida.map(unidad => (
                            <option key={unidad.id} value={unidad.id}>{unidad.denominacion}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button className="btn btn-primary" onClick={toggleNuevaUnidadModal}>Nueva Unidad Medida</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="txtPrecioCompra" className="form-label">Precio de Compra</label>
                    <input type="number" id="txtPrecioCompra" className="form-control" placeholder="Ingrese el precio de compra" value={insumo.precioCompra || 0} onChange={e => setInsumo({ ...insumo, precioCompra: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtStockActual" className="form-label">Stock Actual</label>
                    <input type="number" id="txtStockActual" className="form-control" placeholder="Ingrese el stock actual" value={insumo.stockActual || 0} onChange={e => setInsumo({ ...insumo, stockActual: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtStockMaximo" className="form-label">Stock Máximo</label>
                    <input type="number" id="txtStockMaximo" className="form-control" placeholder="Ingrese el stock máximo" value={insumo.stockMaximo || 0} onChange={e => setInsumo({ ...insumo, stockMaximo: parseFloat(e.target.value) })} />
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
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={guardarInsumo}>
                    Guardar
                </Button>
            </Modal.Footer>
            <div>
                {/* Modal para agregar imagen */}
                {showAgregarImagenModal && (
                    <AgregarImagenModal
                        show={showAgregarImagenModal}
                        imagenes={imagenes}
                        setImagenes={setImagenes}
                        toggleModal={toggleAgregarImagenModal}
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
        </Modal>
    );
}

export default InsumoFormulario;

