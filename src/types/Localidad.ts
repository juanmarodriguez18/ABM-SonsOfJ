import { Base } from './Base';
import { Provincia } from './Provincia';

export class Localidad extends Base {
    nombre: string;
    provincia: Provincia;

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        nombre: string = '',
        provincia: Provincia = null
    ) {
        super(id, eliminado);
        this.nombre = nombre;
        this.provincia = provincia;
    }
}
