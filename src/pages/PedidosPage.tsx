import { useState } from "react"
import { Pedido } from "../types/Pedido"
import { useFetch } from "../hooks/useFetch"

export const PedidosPage = () => {
	//const [pedidos, setPedidos] = useState<Pedido[]>();
	const datos = useFetch('http://localhost:8080/pedidos');
	console.log(datos);

	return(
		<>
			<p>Prueba</p>
		</>
	)
}