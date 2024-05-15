export abstract class Base {
    protected id: number;
    protected eliminado: boolean;

    constructor(id: number = 0, eliminado: boolean = false) {
        this.id = id;
        this.eliminado = eliminado;
    }
}