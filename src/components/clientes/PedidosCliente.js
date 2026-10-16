import { Text, View } from "react-native";

import styles from "../../styles/clientesStyles";
import { formatoFecha, formatoPrecio, nombreEstado } from "../../util/pedidos";

// Bloque con el total y el listado de pedidos de un cliente.
export default function PedidosCliente({ pedidos }) {
  const total = pedidos.reduce(
    (suma, pedido) => suma + (Number(pedido.total) || 0),
    0,
  );

  return (
    <View style={styles.bloquePedidos}>
      <View style={styles.encabezadoPedidos}>
        <Text style={styles.tituloPedidos}>Pedidos</Text>
        {pedidos.length > 0 && (
          <Text style={styles.textoSecundario}>
            Total: {formatoPrecio(total)}
          </Text>
        )}
      </View>

      {pedidos.length === 0 ? (
        <Text style={styles.textoSecundario}>Todavía no tiene pedidos.</Text>
      ) : (
        pedidos.map((pedido) => (
          <View key={pedido.id} style={styles.filaPedido}>
            <View style={styles.contenidoFlexible}>
              <Text style={styles.textoDetalle}>{pedido.id}</Text>
              <Text style={styles.textoSecundario}>
                {formatoFecha(pedido.fecha)} · {nombreEstado(pedido.estadoId)}
              </Text>
            </View>
            <Text style={styles.importePedido}>
              {formatoPrecio(pedido.total)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
