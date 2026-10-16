import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import BuscadorProductos from "../components/productos/BuscadorProductos";
import ProductoCard from "../components/productos/ProductoCard";
import {
  eliminarProducto,
  obtenerProductos,
} from "../services/productosServices";
import styles from "../styles/gestionProductosStyles";

const FONDO_ANDINO = require("../../assets/Splashscreen/fondo_paisaje_andino_1080x2524.jpg");

export default function GestionProductos({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [filtroStock, setFiltroStock] = useState("todos");
  const [ordenAscendente, setOrdenAscendente] = useState(null);

  const obtenerStock = (producto) => Number(producto.stock) || 0;
  const formatoPrecio = (valor) =>
    `$${Number(valor || 0).toLocaleString("es-AR")}`;

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await obtenerProductos();
      setProductos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.message || "No se pudieron cargar los productos.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarProductos();
    }, [cargarProductos]),
  );

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es-AR");
    const resultado = productos.filter((producto) => {
      const coincideTexto = [
        producto.nombre,
        producto.categoria,
        producto.descripcion,
        producto.proveedores?.nombre,
      ].some((campo) =>
        String(campo ?? "").toLocaleLowerCase("es-AR").includes(texto),
      );
      const stock = obtenerStock(producto);
      const coincideStock =
        filtroStock === "todos" ||
        (filtroStock === "bajo" && stock > 0 && stock <= 15) ||
        (filtroStock === "agotado" && stock <= 0);
      return coincideTexto && coincideStock;
    });

    if (ordenAscendente === null) return resultado;
    return [...resultado].sort((a, b) => {
      const comparacion = String(a.nombre ?? "").localeCompare(
        String(b.nombre ?? ""),
        "es",
      );
      return ordenAscendente ? comparacion : -comparacion;
    });
  }, [productos, busqueda, filtroStock, ordenAscendente]);

  const agotados = productos.filter(
    (producto) => obtenerStock(producto) <= 0,
  ).length;
  const stockBajo = productos.filter((producto) => {
    const stock = obtenerStock(producto);
    return stock > 0 && stock <= 15;
  }).length;
  const stockOk = productos.filter(
    (producto) => obtenerStock(producto) > 15,
  ).length;

  const confirmarEliminacion = (producto) => {
    Alert.alert(
      "Eliminar producto",
      `¿Querés eliminar ${producto.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarProducto(producto.id);
              await cargarProductos();
              Alert.alert("Producto eliminado", "El producto se eliminó correctamente.");
            } catch (error) {
              Alert.alert(
                "No se pudo eliminar",
                error?.message || "Intentá nuevamente.",
              );
            }
          },
        },
      ],
    );
  };

  const renderProducto = ({ item }) => (
    <ProductoCard
      producto={item}
      formatoPrecio={formatoPrecio}
      onEditar={(producto) =>
        navigation.navigate("NuevosProductos", { producto })
      }
      onEliminar={confirmarEliminacion}
    />
  );

  return (
    <SafeAreaView style={styles.pantalla} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9F3" />
      <ImageBackground
        source={FONDO_ANDINO}
        resizeMode="cover"
        imageStyle={styles.imagenFondo}
        style={styles.headerFondo}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.botonVolver}
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={23} color="#302820" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Gestión de Productos</Text>
        </View>
      </ImageBackground>

      <BuscadorProductos
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        mostrarFiltro={mostrarFiltro}
        setMostrarFiltro={setMostrarFiltro}
        filtroStock={filtroStock}
        setFiltroStock={setFiltroStock}
      />

      <TouchableOpacity
        style={styles.botonNuevo}
        onPress={() => navigation.navigate("NuevosProductos")}
      >
        <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
        <Text style={styles.textoBotonNuevo}>Nuevo producto</Text>
      </TouchableOpacity>

      <View style={styles.resumenIndicadores}>
        <Text style={styles.contador}>
          Mostrando {productosFiltrados.length} productos
        </Text>
        <View style={styles.filaIndicadores}>
          <View style={styles.indicadorOk}>
            <Ionicons name="checkmark-circle" size={10} color="#328253" />
            <Text style={styles.textoIndicadorOk}>STOCK OK {stockOk}</Text>
          </View>
          <View style={styles.indicadorAlerta}>
            <Ionicons name="warning" size={10} color="#C58A00" />
            <Text style={styles.textoIndicadorAlerta}>ALERTAS {stockBajo}</Text>
          </View>
          <View style={styles.indicadorAgotado}>
            <Text style={styles.textoIndicadorAgotado}>
              ✖ AGOTADOS {agotados}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.encabezadoInventario, styles.encabezadoInventarioFila]}>
        <Text style={styles.tituloInventario}>INVENTARIO RECIENTE</Text>
        <TouchableOpacity
          onPress={() =>
            setOrdenAscendente((actual) => (actual === null ? true : !actual))
          }
          style={styles.botonOrdenar}
          accessibilityLabel="Cambiar orden de los productos"
        >
          <Text style={styles.textoOrdenar}>Ordenar</Text>
          <Ionicons name="swap-vertical" size={15} color="#526176" />
        </TouchableOpacity>
      </View>

      {cargando ? (
        <View style={styles.estadoCarga}>
          <ActivityIndicator size="large" color="#F15A29" />
          <Text style={styles.textoCarga}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProducto}
          contentContainerStyle={styles.listaProductos}
          keyboardShouldPersistTaps="handled"
          refreshing={cargando}
          onRefresh={cargarProductos}
          ListEmptyComponent={
            <View style={styles.estadoVacio}>
              <Ionicons name="cube-outline" size={38} color="#9AA3B2" />
              <Text style={styles.textoEstadoVacio}>
                No se encontraron productos.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
