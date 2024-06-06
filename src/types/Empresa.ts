import { Base } from './Base';
import { ImagenEmpresa } from './ImagenEmpresa';
import { Sucursal } from './Sucursal';

export class Empresa extends Base {
    nombre: string;
    razonSocial: string;
    cuil: number;
    imagenesEmpresa: ImagenEmpresa[];
    sucursales: Sucursal[];

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        nombre: string = '',
        razonSocial: string = '',
        cuil: number = 0,
        imagenesEmpresa: ImagenEmpresa[] = [],
        sucursales: Sucursal[] = []
    ) {
        super(id, eliminado);
        this.nombre = nombre;
        this.razonSocial = razonSocial;
        this.cuil = cuil;
        this.imagenesEmpresa = imagenesEmpresa;
        this.sucursales = sucursales;
    }
}
