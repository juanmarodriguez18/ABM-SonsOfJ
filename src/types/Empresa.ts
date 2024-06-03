import { Base } from './Base';
import { Sucursal } from './Sucursal';

export class Empresa extends Base {
    nombre: string;
    razonSocial: string;
    cuil: number;
    sucursales: Sucursal[];

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        nombre: string = '',
        razonSocial: string = '',
        cuil: number = 0,
        sucursales: Sucursal[] = []
    ) {
        super(id, eliminado);
        this.nombre = nombre;
        this.razonSocial = razonSocial;
        this.cuil = cuil;
        this.sucursales = sucursales;
    }
}
