import { Articulo } from './Articulo';
import { Base } from './Base';

export class ImagenArticulo extends Base {
    url: string;
    articulo: Articulo;

    constructor(id: number = 0, eliminado: boolean = false, url: string = '', articulo: Articulo = new Articulo()) {
        super(id, eliminado);
        this.url = url;
        this.articulo = articulo;
    }
}
