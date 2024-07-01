import { Base } from './Base';
import { Empresa } from './Empresa';
import { Domicilio } from './Domicilio';
import { Promocion } from './Promocion';
import { Categoria } from './Categoria';
import { Empleado } from './Empleado';
import { Pedido } from './Pedido';
import { ImagenSucursal } from './ImagenSucursal';

export class Sucursal extends Base {
    nombre: string;
    horarioApertura: string; 
    horarioCierre: string; 
    empresa?: Empresa;
    domicilio: Domicilio;
    promociones?: Promocion[];
    categorias?: Categoria[];
    empleados?: Empleado[];
    pedidos?: Pedido[];
    imagenesSucursal: ImagenSucursal[];

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        nombre: string = '',
        horarioApertura: string = '',
        horarioCierre: string = '',
        empresa: Empresa = new Empresa(),
        domicilio: Domicilio = new Domicilio(),
        promociones: Promocion[] = [],
        categorias: Categoria[] = [],
        empleados: Empleado[] = [],
        pedidos: Pedido[] = [],
        imagenesSucursal: ImagenSucursal[] = []
    ) {
        super(id, eliminado);
        this.nombre = nombre;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
        this.empresa = empresa;
        this.domicilio = domicilio;
        this.promociones = promociones;
        this.categorias = categorias;
        this.empleados = empleados;
        this.pedidos = pedidos;
        this.imagenesSucursal = imagenesSucursal;
    }
}
