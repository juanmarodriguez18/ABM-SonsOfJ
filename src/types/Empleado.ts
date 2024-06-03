import { Base } from './Base';
import { ImagenEmpleado } from './ImagenEmpleado';
import { Pedido } from './Pedido';
import { Sucursal } from './Sucursal';
import { UsuarioEmpleado } from './UsuarioEmpleado';
import { Rol } from './enums/Rol';


export class Empleado extends Base {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    fechaNacimiento: string;  // O puedes usar Date si prefieres manejar fechas como objetos Date
    tipoEmpleado: Rol;
    sucursal: Sucursal;
    imagenEmpleado: ImagenEmpleado;
    usuarioEmpleado: UsuarioEmpleado;
    pedidos: Pedido[];

    constructor(
        id: number = 0,
        eliminado: boolean = false,
        nombre: string = '',
        apellido: string = '',
        telefono: string = '',
        email: string = '',
        fechaNacimiento: string = '',
        tipoEmpleado: Rol = Rol.CAJERO,
        sucursal: Sucursal,
        imagenEmpleado: ImagenEmpleado,
        usuarioEmpleado: UsuarioEmpleado,
        pedidos: Pedido[] = []
    ) {
        super(id, eliminado);
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.tipoEmpleado = tipoEmpleado;
        this.sucursal = sucursal;
        this.imagenEmpleado = imagenEmpleado;
        this.usuarioEmpleado = usuarioEmpleado;
        this.pedidos = pedidos;
    }
}
