import { Articulo } from './Articulo';
import { ImagenArticulo } from './ImagenArticulo';
import { UnidadMedida } from './UnidadMedida';
import { Categoria } from './Categoria';

export class ArticuloInsumo extends Articulo {
    precioCompra: number;
    stockActual: number;
    stockMaximo: number;
    esParaElaborar: boolean;

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        denominacion: string = '',
        precioVenta: number = 0,
        imagenesArticulo: Set<ImagenArticulo> = new Set(),
        unidadMedida: UnidadMedida = new UnidadMedida(),
        categoria: Categoria,
        precioCompra: number = 0,
        stockActual: number = 0,
        stockMaximo: number = 0,
        esParaElaborar: boolean = false
    ) {
        super(id, eliminado, denominacion, precioVenta, imagenesArticulo, unidadMedida, categoria);
        this.precioCompra = precioCompra;
        this.stockActual = stockActual;
        this.stockMaximo = stockMaximo;
        this.esParaElaborar = esParaElaborar;
    }
}
