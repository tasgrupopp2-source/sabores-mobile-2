import { Text, TouchableOpacity, View } from "react-native";

import styles from "../../styles/ordenesCompraStyles";

const obtenerDetalles = (orden) => orden.detalles || orden.detalle_orden_compra || [];

const obtenerNombreProducto = (detalle) =>
  detalle.producto?.nombre || detalle.productos?.nombre || "Producto sin nombre";

const formatoFecha = (fecha) => {
  if (!fecha) return "";
  const fechaOrden = new Date(`${fecha}T00:00:00`);
  return fechaOrden.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function OrdenCompraCard({ orden, nombreProveedor, onEliminar }) {
  const detalles = obtenerDetalles(orden);
  const total = detalles.reduce(
    (suma, detalle) => suma + Number(detalle.totalParcial || 0),
    0,
  );

  return (
    <View style={styles.tarjeta}>
      <View style={styles.filaTarjeta}>
        <Text style={styles.numeroOrden}>{orden.id}</Text>
        <Text
          style={[
            styles.estado,
            orden.estado === "Recibida" && styles.recibida,
            orden.estado === "En tránsito" && styles.enTransito,
            orden.estado === "Cancelada" && styles.cancelada,
          ]}
        >
          {orden.estado}
        </Text>
      </View>
      <Text style={styles.textoProveedor}>{nombreProveedor}</Text>
      <Text style={styles.textoDetalle}>
        {formatoFecha(orden.fecha)} | {detalles.length} productos
      </Text>
      <View style={styles.detalleLista}>
        {detalles.map((detalle) => (
          <View style={styles.detalleFila} key={detalle.id || detalle.productoId}>
            <Text style={styles.detalleNombre}>
              {obtenerNombreProducto(detalle)} × {detalle.cantidad}
            </Text>
            <Text style={styles.detalleImporte}>
              $ {Number(detalle.totalParcial || 0).toLocaleString("es-AR")}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.importe}>$ {total.toLocaleString("es-AR")}</Text>
      <TouchableOpacity onPress={() => onEliminar(orden)} style={styles.botonEliminar}>
        <Text style={styles.textoEliminar}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}
