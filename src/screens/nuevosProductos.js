import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// para abrir la galeria del celu
import * as ImagePicker from "expo-image-picker";
// para subir la imagen a supabase storage
import { supabase } from "../services/supabase";

import {
  actualizarProducto,
  crearProducto,
} from "../services/productosServices";
import { obtenerProveedores } from "../services/proveedoresService";
import styles from "../styles/nuevosProductosStyles";

const convertirNumero = (valor) => Number(valor.replace(",", "."));

// nombre del bucket de supabase storage donde se guardan las fotos
const BUCKET = "productos";

export default function NuevosProductos({ navigation, route }) {
  const producto = route.params?.producto;
  const esEdicion = Boolean(producto);
  const proveedorInicial = producto?.proveedor_id ?? producto?.proveedores?.id ?? "";

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [precioCompra, setPrecioCompra] = useState(
    producto?.precio_compra === undefined || producto?.precio_compra === null
      ? ""
      : String(producto.precio_compra),
  );
  const [margen, setMargen] = useState(
    producto?.margen === undefined || producto?.margen === null
      ? "30"
      : String(producto.margen),
  );
  const [stock, setStock] = useState(
    producto?.stock === undefined ? "" : String(producto.stock),
  );
  // url de la imagen que ya tenia el producto (solo en edicion)
  const imagenExistente = producto?.imagen ?? null;
  // imagen nueva elegida de la galeria (todavia no subida)
  const [imagenNueva, setImagenNueva] = useState(null);
  const [proveedorId, setProveedorId] = useState(proveedorInicial);
  const [proveedores, setProveedores] = useState([]);
  const [mostrarProveedores, setMostrarProveedores] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarProveedores = async () => {
      try {
        const datos = await obtenerProveedores();
        if (activo) setProveedores(datos);
      } catch (err) {
        if (activo) {
          setError(err?.message || "No se pudieron cargar los proveedores.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarProveedores();
    return () => {
      activo = false;
    };
  }, []);

  // en web Alert.alert no se ve, por eso usamos el alert del navegador
  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      globalThis.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  // abre la galeria y guarda la imagen elegida para mostrar la preview
  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // cuadrada
      quality: 0.7, // la comprime un poco para que pese menos
    });

    // si el usuario cerro la galeria sin elegir, no hacemos nada
    if (!resultado.canceled) {
      setImagenNueva(resultado.assets[0]);
    }
  };

  // sube la imagen a supabase storage y devuelve la url publica
  const subirImagen = async (archivo) => {
    // leemos el archivo como bytes (funciona en celu y en web)
    const respuesta = await fetch(archivo.uri);
    const bytes = await respuesta.arrayBuffer();

    const tipo = archivo.mimeType || "image/jpeg";
    const extension = tipo.split("/")[1] || "jpg";
    // nombre unico para que no se pise con otra foto
    const ruta = `producto-${Date.now()}.${extension}`;

    const { error: errorSubida } = await supabase.storage
      .from(BUCKET)
      .upload(ruta, bytes, { contentType: tipo });
    if (errorSubida) throw errorSubida;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
    return data.publicUrl;
  };

  // lo que se ve en la preview: la nueva si eligio una, si no la que ya tenia
  const imagenPreview = imagenNueva?.uri ?? imagenExistente;

  const proveedorSeleccionado = useMemo(
    () =>
      proveedores.find(
        (proveedor) => String(proveedor.id) === String(proveedorId),
      ),
    [proveedores, proveedorId],
  );

  const precioVenta = useMemo(() => {
    const compra = convertirNumero(precioCompra);
    const porcentaje = convertirNumero(margen);

    if (
      precioCompra.trim() === "" ||
      margen.trim() === "" ||
      !Number.isFinite(compra) ||
      !Number.isFinite(porcentaje)
    ) {
      return 0;
    }

    return compra + (compra * porcentaje) / 100;
  }, [precioCompra, margen]);

  const guardar = async () => {
    const nombreLimpio = nombre.trim();
    const precioCompraNumero = convertirNumero(precioCompra);
    const margenNumero = convertirNumero(margen);
    const stockNumero = Number(stock);

    if (!nombreLimpio) {
      mostrarMensaje("Campo obligatorio", "Ingresá el nombre del producto.");
      return;
    }
    if (!proveedorId) {
      mostrarMensaje("Proveedor obligatorio", "Seleccioná un proveedor.");
      return;
    }
    if (
      precioCompra.trim() === "" ||
      !Number.isFinite(precioCompraNumero) ||
      precioCompraNumero < 0
    ) {
      mostrarMensaje(
        "Precio de compra inválido",
        "Ingresá un precio numérico mayor o igual a cero.",
      );
      return;
    }
    if (
      margen.trim() === "" ||
      !Number.isFinite(margenNumero) ||
      margenNumero < 0
    ) {
      mostrarMensaje(
        "Margen inválido",
        "Ingresá un margen numérico mayor o igual a cero.",
      );
      return;
    }
    if (stock.trim() === "" || !Number.isInteger(stockNumero) || stockNumero < 0) {
      mostrarMensaje("Stock inválido", "Ingresá un stock entero mayor o igual a cero.");
      return;
    }

    const datos = {
      nombre: nombreLimpio,
      precio_compra: precioCompraNumero,
      margen: margenNumero,
      precio: precioCompraNumero + (precioCompraNumero * margenNumero) / 100,
      stock: stockNumero,
      proveedor_id: proveedorId,
    };

    try {
      setGuardando(true);

      // si eligio una imagen nueva la subimos; si no, queda la que tenia (o null)
      datos.imagen = imagenNueva ? await subirImagen(imagenNueva) : imagenExistente;

      if (esEdicion) {
        await actualizarProducto(producto.id, datos);
      } else {
        await crearProducto(datos);
      }

      const titulo = esEdicion ? "Producto actualizado" : "Producto creado";
      const mensaje = esEdicion
        ? "Los cambios se guardaron correctamente."
        : "El producto se creó correctamente.";

      if (Platform.OS === "web") {
        // en web: aviso del navegador y despues volvemos
        globalThis.alert(mensaje);
        navigation.goBack();
      } else {
        // en el celu: alerta con boton aceptar que vuelve atras
        Alert.alert(titulo, mensaje, [
          { text: "Aceptar", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      mostrarMensaje(
        "No se pudo guardar",
        err?.message || "Intentá nuevamente.",
      );
    } finally {
      setGuardando(false);
    }
  };

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
        {/* preview de la imagen (la nueva o la que ya tenia) */}
        {imagenPreview ? (
          <Image
            source={{ uri: imagenPreview }}
            style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 10 }}
          />
        ) : null}
        {/* boton que abre la galeria */}
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
                  const seleccionado =
                    String(proveedor.id) === String(proveedorId);
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