import { Articulo } from './Articulo';
import { ImagenArticulo } from './ImagenArticulo';
import { UnidadMedida } from './UnidadMedida';
import { Categoria } from './Categoria';
import { Sucursal } from './Sucursal';

export class ArticuloInsumo extends Articulo {
    precioCompra: number;
    stockActual: number;
    stockMinimo: number;
    esParaElaborar: boolean;
    sucursal?: Sucursal;

    constructor(
        eliminado: boolean = false,
        denominacion: string = '',
        precioVenta: number = 0,
        imagenesArticulo: Set<ImagenArticulo> = new Set(),
        unidadMedida: UnidadMedida = new UnidadMedida(),
        categoria: Categoria,
        precioCompra: number = 0,
        stockActual: number = 0,
        stockMinimo: number = 0,
        esParaElaborar: boolean = false,
        sucursal: Sucursal = new Sucursal()
    ) {
        super(0, eliminado, denominacion, precioVenta, imagenesArticulo, unidadMedida, categoria);
        this.precioCompra = precioCompra;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
        this.esParaElaborar = esParaElaborar;
        this.sucursal = sucursal;
    }
}

