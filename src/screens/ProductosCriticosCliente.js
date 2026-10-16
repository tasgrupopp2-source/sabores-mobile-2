import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNavigation from "../components/BottomNavigation";
import { obtenerImagen } from "../data/imagenesProductos";
import { obtenerProductos } from "../services/productosServices";
import styles from "../styles/ProductosCriticosClienteStyles";

// Cantidad máxima para considerar un producto crítico.
const LIMITE_STOCK_CRITICO = 15;

// Formatea el precio según la configuración regional argentina.
const formatoPrecio = (precio) =>
  `$${Number(precio || 0).toLocaleString("es-AR")}`;

export default function ProductosCriticosCliente({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Obtiene los productos desde el servicio existente.
  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerProductos();
      setProductos(datos ?? []);
    } catch (e) {
      console.error("Error cargando productos críticos:", e);
      setError("No pudimos cargar los productos. Intentá nuevamente.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // Filtra productos con stock entre 1 y 15 unidades.
  const productosCriticos = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es-AR");

    return productos.filter((producto) => {
      const stock = Number(producto.stock) || 0;
      const esCritico = stock > 0 && stock <= LIMITE_STOCK_CRITICO;

      const coincide = [
        producto.nombre,
        producto.categoria,
        producto.descripcion,
      ].some((campo) =>
        String(campo ?? "")
          .toLocaleLowerCase("es-AR")
          .includes(texto),
      );

      return esCritico && coincide;
    });
  }, [productos, busqueda]);

  // Dibuja cada producto con el estilo de las tarjetas de Visily.
  const renderProducto = ({ item }) => {
    const stock = Number(item.stock) || 0;

    let imagen = null;
    try {
      imagen = obtenerImagen(item.nombre);
    } catch {
      imagen = null;
    }

    return (
      <View style={styles.tarjeta}>
        <View style={styles.filaProducto}>
          <View style={styles.contenedorImagen}>
            {imagen ? (
              <Image
                source={imagen}
                style={styles.imagenProducto}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagenAlternativa}>
                <Ionicons name="leaf-outline" size={42} color="#C8662B" />
              </View>
            )}

            {/* La etiqueta identifica visualmente el stock crítico. */}
            <View style={styles.etiquetaImagen}>
              <Text style={styles.textoEtiquetaImagen}>¡Últimas!</Text>
            </View>
          </View>

          <View style={styles.datosProducto}>
            <Text style={styles.nombreProducto}>
              {item.nombre || "Producto"}
            </Text>

            {!!item.descripcion && (
              <Text style={styles.descripcion} numberOfLines={3}>
                {item.descripcion}
              </Text>
            )}

            {!!item.categoria && (
              <Text style={styles.categoria}>{item.categoria}</Text>
            )}

            <Text style={styles.presentacion}>
              {item.presentacion || item.unidad || "Producto regional"}
            </Text>

            <Text style={styles.precio}>{formatoPrecio(item.precio)}</Text>

            <View style={styles.filaStock}>
              <Ionicons name="alert-circle" size={17} color="#C8662B" />
              <Text style={styles.textoStock}>
                Quedan {stock} {stock === 1 ? "unidad" : "unidades"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.pantalla} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F0E6" />

      {/* Encabezado beige, como la pantalla Nuevos Productos. */}
      <View style={styles.encabezado}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={29} color="#171717" />
        </TouchableOpacity>

        <Text style={styles.tituloEncabezado}>Productos críticos</Text>
      </View>

      <View style={styles.introduccion}>
        <Text style={styles.subtituloEncabezado}>
          Productos con stock limitado
        </Text>
        <Text style={styles.textoIntroduccion}>
          Aprovechá los productos que quedan disponibles.
        </Text>
      </View>

      {/* Buscador con fondo blanco y bordes redondeados. */}
      <View style={styles.buscador}>
        <Ionicons name="search-outline" size={22} color="#888888" />

        <TextInput
          style={styles.inputBuscador}
          placeholder="Buscar productos..."
          placeholderTextColor="#888888"
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {!!busqueda && (
          <TouchableOpacity onPress={() => setBusqueda("")}>
            <Ionicons name="close-circle" size={21} color="#888888" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.resumen}>
        <Text style={styles.textoResumen}>
          {cargando
            ? "Buscando productos..."
            : `${productosCriticos.length} ${
                productosCriticos.length === 1
                  ? "producto disponible"
                  : "productos disponibles"
              }`}
        </Text>
      </View>

      {cargando ? (
        <View style={styles.estado}>
          <ActivityIndicator size="large" color="#C8662B" />
          <Text style={styles.textoEstado}>Cargando productos...</Text>
        </View>
      ) : error ? (
        <View style={styles.estado}>
          <Ionicons name="cloud-offline-outline" size={42} color="#C8662B" />
          <Text style={styles.textoEstado}>{error}</Text>

          <TouchableOpacity
            style={styles.botonReintentar}
            onPress={cargarProductos}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotonReintentar}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={productosCriticos}
          keyExtractor={(item, index) =>
            String(item.id ?? item.nombre ?? index)
          }
          renderItem={renderProducto}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshing={cargando}
          onRefresh={cargarProductos}
          ListEmptyComponent={
            <View style={styles.estado}>
              <Ionicons
                name="checkmark-circle-outline"
                size={48}
                color="#328253"
              />
              <Text style={styles.textoEstado}>
                No hay productos con stock crítico para esta búsqueda.
              </Text>
            </View>
          }
        />
      )}

      {/* Conservamos la navegación inferior de la aplicación. */}
      <BottomNavigation
        navigation={navigation}
        activeRoute="ProductosCriticosCliente"
      />
    </SafeAreaView>
  );
}
