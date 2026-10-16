import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { obtenerImagen } from "../../data/imagenesProductos";
import styles from "../../styles/gestionProductosStyles";

export default function ProductoCard({
  producto,
  formatoPrecio,
  onEditar,
  onEliminar,
}) {
  const stock = Number(producto.stock) || 0;
  const precioCompra = Number(producto.precio_compra) || 0;
  const precioVenta = Number(producto.precio) || 0;
  const margen = Number(producto.margen) || 0;
  const imagenUrl = String(producto.imagen ?? "").trim();
  const imagen = /^https?:\/\//i.test(imagenUrl)
    ? { uri: imagenUrl }
    : obtenerImagen(producto.nombre);
  const proveedor = producto.proveedores?.nombre || "Sin proveedor";

  const estado =
    stock <= 0
      ? {
          texto: "AGOTADO",
          contenedor: styles.estadoAgotado,
          textoEstilo: styles.textoAgotado,
        }
      : stock <= 15
        ? {
            texto: "BAJO",
            contenedor: styles.estadoBajo,
            textoEstilo: styles.textoBajo,
          }
        : {
            texto: "OK",
            contenedor: styles.estadoOk,
            textoEstilo: styles.textoOk,
          };

  return (
    <View style={styles.tarjetaProducto}>
      <View style={styles.filaProducto}>
        {imagen ? (
          <Image source={imagen} style={styles.imagenProducto} resizeMode="cover" />
        ) : (
          <View
            style={[
              styles.imagenProducto,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Ionicons name="image-outline" size={24} color="#9AA3B2" />
          </View>
        )}

        <View style={styles.informacionProducto}>
          <Text style={styles.nombreProducto} numberOfLines={1}>
            {(producto.nombre ?? "SIN NOMBRE").toUpperCase()}
          </Text>
          {producto.categoria ? (
            <Text style={styles.categoriaProducto} numberOfLines={1}>
              {String(producto.categoria).toUpperCase()}
            </Text>
          ) : null}
          <Text style={styles.proveedorProducto} numberOfLines={1}>
            Proveedor: {proveedor}
          </Text>
          <Text style={styles.precioProducto}>
            Compra: {formatoPrecio(precioCompra)}
          </Text>
          <Text style={styles.precioProducto}>
            Venta: {formatoPrecio(precioVenta)}
          </Text>
          <Text style={styles.margenProducto}>Margen: {margen}%</Text>
          <Text
            style={[
              styles.textoStock,
              stock <= 0 ? styles.stockAgotado : styles.stockDisponible,
            ]}
          >
            ● Stock: {stock}
          </Text>
        </View>

        <View style={styles.lateralProducto}>
          <View style={[styles.etiquetaEstado, estado.contenedor]}>
            <Text style={[styles.textoEstado, estado.textoEstilo]}>
              {estado.texto}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.filaAcciones}>
        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() => onEditar(producto)}
          accessibilityLabel={`Editar ${producto.nombre}`}
        >
          <Ionicons name="create-outline" size={16} color="#344563" />
          <Text style={styles.textoEditar}>Editar</Text>
        </TouchableOpacity>
        <View style={styles.separadorAcciones} />
        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => onEliminar(producto)}
          accessibilityLabel={`Eliminar ${producto.nombre}`}
        >
          <Ionicons name="trash-outline" size={16} color="#C62828" />
          <Text style={styles.textoEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
