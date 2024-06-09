import { Factura } from "../../types/Factura";
import { FormaPago } from "../../types/enums/FormaPago";


export function crearFactura(totalVenta: number, formaPago: FormaPago): Factura {
  const factura = new Factura(
    0,
    false,
    new Date(),
    0,
    0,
    '',
    '',
    formaPago,
    totalVenta
  );

  return factura;
}
