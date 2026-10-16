import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useProductoForm from "../hooks/useProductoForm";
import styles from "../styles/nuevosProductosStyles";

export default function NuevosProductos({ navigation, route }) {
  const producto = route.params?.producto;

  const {
    esEdicion,
    nombre, setNombre,
    precioCompra, setPrecioCompra,
    margen, setMargen,
    stock, setStock,
    proveedorId, setProveedorId,
    proveedores,
    proveedorSeleccionado,
    mostrarProveedores, setMostrarProveedores,
    imagenPreview,
    precioVenta,
    cargando,
    guardando,
    error,
    seleccionarImagen,
    guardar,
  } = useProductoForm(producto, navigation);

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => navigation.goBack()}
            disabled={guardando}
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={26} color="#302820" />
          </TouchableOpacity>
          <View>
            <Text style={styles.titulo}>
              {esEdicion ? "Editar producto" : "Nuevo producto"}
            </Text>
            <Text style={styles.subtitulo}>
              {esEdicion
                ? "Actualizá los datos del inventario"
                : "Agregá un producto al inventario"}
            </Text>
          </View>
        </View>

        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          style={styles.campo}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del producto"
          placeholderTextColor="#8C8178"
          editable={!guardando}
        />

        <Text style={styles.etiqueta}>Precio de compra</Text>
        <TextInput
          style={styles.campo}
          value={precioCompra}
          onChangeText={setPrecioCompra}
          placeholder="0,00"
          placeholderTextColor="#8C8178"
          keyboardType="decimal-pad"
          editable={!guardando}
        />

        <Text style={styles.etiqueta}>Margen %</Text>
        <TextInput
          style={styles.campo}
          value={margen}
          onChangeText={setMargen}
          placeholder="30"
          placeholderTextColor="#8C8178"
          keyboardType="decimal-pad"
          editable={!guardando}
        />

        <Text style={styles.precioVenta}>
          Precio de venta: ${precioVenta.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

        <Text style={styles.etiqueta}>Stock</Text>
        <TextInput
          style={styles.campo}
          value={stock}
          onChangeText={setStock}
          placeholder="0"
          placeholderTextColor="#8C8178"
          keyboardType="number-pad"
          editable={!guardando}
        />

        <Text style={styles.etiqueta}>Imagen</Text>
        {imagenPreview ? (
          <Image
            source={{ uri: imagenPreview }}
            style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 10 }}
          />
        ) : null}
        <TouchableOpacity
          style={[styles.selector, { justifyContent: "center", gap: 8 }]}
          onPress={seleccionarImagen}
          disabled={guardando}
        >
          <Ionicons name="image-outline" size={20} color="#F15A29" />
          <Text style={{ color: "#F15A29", fontWeight: "600" }}>
            {imagenPreview ? "Cambiar imagen" : "Seleccionar imagen"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.etiqueta}>Proveedor</Text>
        {cargando ? (
          <ActivityIndicator color="#F15A29" />
        ) : (
          <>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setMostrarProveedores((actual) => !actual)}
              disabled={guardando}
            >
              <Text
                style={[
                  styles.textoSelector,
                  !proveedorSeleccionado && styles.textoPlaceholder,
                ]}
              >
                {proveedorSeleccionado?.nombre || "Seleccioná un proveedor"}
              </Text>
              <Ionicons
                name={mostrarProveedores ? "chevron-up" : "chevron-down"}
                size={20}
                color="#776B61"
              />
            </TouchableOpacity>

            {mostrarProveedores && (
              <View style={styles.listaProveedores}>
                {proveedores.map((proveedor) => {
                  const seleccionado = String(proveedor.id) === String(proveedorId);
                  return (
                    <TouchableOpacity
                      key={proveedor.id}
                      style={[
                        styles.opcionProveedor,
                        seleccionado && styles.opcionSeleccionada,
                      ]}
                      onPress={() => {
                        setProveedorId(proveedor.id);
                        setMostrarProveedores(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.textoProveedor,
                          seleccionado && styles.textoProveedorSeleccionado,
                        ]}
                      >
                        {proveedor.nombre}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!cargando && proveedores.length === 0 && !error ? (
          <Text style={styles.mensaje}>No hay proveedores disponibles.</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.botonGuardar,
            (guardando || cargando) && styles.botonDeshabilitado,
          ]}
          onPress={guardar}
          disabled={guardando || cargando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoGuardar}>
              {esEdicion ? "Guardar cambios" : "Crear producto"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
