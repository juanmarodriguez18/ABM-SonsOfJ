import { Base } from './Base';
import { Pais } from './Pais';
import { Provincia } from './Provincia';

export class Localidad extends Base {
    nombre: string;
    provincia: Provincia;

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        nombre: string = '',
        provincia: Provincia = new Provincia(0, false, '', new Pais()),
    ) {
        super(id, eliminado);
        this.nombre = nombre;
        this.provincia = provincia;
    }
}
