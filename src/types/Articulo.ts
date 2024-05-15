import { Base } from './Base';
import { ImagenArticulo } from './ImagenArticulo';
import { UnidadMedida } from './UnidadMedida';

// Definición de la clase Articulo extendiendo de Base
export abstract class Articulo extends Base {
    protected denominacion: string;
    protected precioVenta: number;
    protected imagenesArticulo: Set<ImagenArticulo>;
    protected unidadMedida: UnidadMedida;

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        denominacion: string = '',
        precioVenta: number = 0.0,
        imagenesArticulo: Set<ImagenArticulo> = new Set(),
        unidadMedida: UnidadMedida = new UnidadMedida()
    ) {
        super(id, eliminado);
        this.denominacion = denominacion;
        this.precioVenta = precioVenta;
        this.imagenesArticulo = imagenesArticulo;
        this.unidadMedida = unidadMedida;
    }
}
