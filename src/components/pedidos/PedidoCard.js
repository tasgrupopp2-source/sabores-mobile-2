import { Text, TouchableOpacity, View } from "react-native";

import styles from "../../styles/listaPedidosStyles";

const ESTADOS = {
  est001: "Pendiente",
  est002: "Confirmado",
  est003: "Preparando",
  est004: "Entregado",
  est005: "En ruta",
};

const SIGUIENTE_ESTADO = {
  est001: { estadoId: "est005", texto: "Enviar (pasa a En ruta)", icono: "🚚" },
  est005: { estadoId: "est004", texto: "Marcar como entregado", icono: "✅" },
};

const formatearMoneda = (importe) =>
  Number(importe || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

const formatearFecha = (fecha) => {
  if (!fecha) return "Fecha no disponible";
  const fechaValida = new Date(fecha);
  if (Number.isNaN(fechaValida.getTime())) return fecha;
  return fechaValida.toLocaleDateString("es-AR");
};

export default function PedidoCard({ pedido, nombreCliente, detallesProductos, onAvanzar }) {
  const siguiente = SIGUIENTE_ESTADO[pedido.estadoId];

  return (
    <View style={styles.tarjeta}>
      <View style={styles.encabezadoTarjeta}>
        <Text style={styles.idPedido}>Pedido #{pedido.id}</Text>
        <View style={styles.etiquetaEstado}>
          <Text style={styles.textoEstado}>
            {ESTADOS[pedido.estadoId] || "Estado desconocido"}
          </Text>
        </View>
      </View>

      <View style={styles.separador} />

      <Text style={styles.etiqueta}>Cliente</Text>
      <Text style={styles.valor}>{nombreCliente || pedido.clienteId || "Sin cliente asignado"}</Text>

      <Text style={styles.etiqueta}>Fecha</Text>
      <Text style={styles.valor}>{formatearFecha(pedido.fecha)}</Text>

      <Text style={styles.etiqueta}>Productos</Text>
      {detallesProductos.length === 0 ? (
        <Text style={styles.valor}>Sin detalle de productos</Text>
      ) : (
        detallesProductos.map((d, i) => (
          <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
            <Text style={styles.valor}>{d.nombre} × {d.cantidad}</Text>
            <Text style={styles.valor}>{formatearMoneda(d.subtotal)}</Text>
          </View>
        ))
      )}

      <View style={styles.filaTotal}>
        <Text style={styles.textoTotal}>Total del pedido</Text>
        <Text style={styles.importe}>{formatearMoneda(pedido.total)}</Text>
      </View>

      {siguiente ? (
        <TouchableOpacity
          onPress={() => onAvanzar(pedido, siguiente)}
          style={{
            marginTop: 12,
            backgroundColor: "#F15A29",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
            {siguiente.icono} {siguiente.texto}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
