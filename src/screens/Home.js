// Pantalla principal de la aplicación Sabores Andinos.

// Importamos los componentes necesarios de React Native.
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Importamos los hooks de React para manejar estados y efectos.
import { useCallback, useState } from "react";

// Permite ejecutar una función cuando la pantalla vuelve a estar activa.
import { useFocusEffect } from "@react-navigation/native";

// Respeta los bordes seguros del dispositivo para evitar que el contenido
// quede tapado por la hora, la batería o las barras del sistema.
import { SafeAreaView } from "react-native-safe-area-context";

// Importamos los iconos de Expo.
import { Ionicons } from "@expo/vector-icons";

// Importamos los colores definidos para la aplicación.
import { colors } from "../config/theme";

// Importamos la navegación inferior compartida.
import BottomNavigation from "../components/BottomNavigation";

// Importamos los productos destacados y la función que obtiene sus imágenes.
import { NUEVOS, obtenerImagen } from "../data/imagenesProductos";

// Importamos los estilos de la pantalla de inicio.
import styles from "../styles/HomeStyles";

// Importamos el cliente de Supabase para consultar la base de datos.
import { supabase } from "../services/supabase";

// Componente principal de la pantalla de inicio.
export default function Home({ navigation }) {
  // Guarda la cantidad real de pedidos pendientes.
  const [pedidosPendientes, setPedidosPendientes] = useState(0);

  // Guarda la cantidad real de pedidos que están en ruta.
  const [pedidosEnRuta, setPedidosEnRuta] = useState(0);

  // cantidad de pedidos ya entregados
  const [pedidosEntregados, setPedidosEntregados] = useState(0);

  // Indica si todavía se están cargando los datos de los pedidos.
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  // cantidad real de productos con stock critico (entre 1 y 15)
  const [productosCriticos, setProductosCriticos] = useState(0);

  // Consulta Supabase cuando entramos a esta pantalla o volvemos a ella.
  useFocusEffect(
    useCallback(() => {
      // Permite evitar actualizaciones de estado si la pantalla se desmonta.
      let activo = true;

      // Función asíncrona que consulta los pedidos.
      async function cargarPedidos() {
        // Activamos el indicador de carga.
        setCargandoPedidos(true);

        try {
          // Consultamos en paralelo los pedidos de cada estado.
          const [resultadoPendientes, resultadoEnRuta, resultadoEntregados] = await Promise.all([
            // Estado est001: pedidos pendientes.
            supabase
              .from("pedidos")
              .select("id", { count: "exact", head: true })
              .eq("estadoId", "est001"),

            // Estado est005: pedidos en ruta.
            supabase
              .from("pedidos")
              .select("id", { count: "exact", head: true })
              .eq("estadoId", "est005"),

            // est004: pedidos entregados.
            supabase
              .from("pedidos")
              .select("id", { count: "exact", head: true })
              .eq("estadoId", "est004"),
          ]);

          // Solo actualizamos los estados si la pantalla sigue activa.
          if (!activo) return;

          // Si Supabase devuelve un error, lo mostramos en la consola.
          if (resultadoPendientes.error) {
            console.error(
              "Error al cargar pedidos pendientes:",
              resultadoPendientes.error.message,
            );
          } else {
            // Actualizamos el contador de pedidos pendientes.
            setPedidosPendientes(resultadoPendientes.count ?? 0);
          }

          // Comprobamos si ocurrió un error al consultar los pedidos en ruta.
          if (resultadoEnRuta.error) {
            console.error(
              "Error al cargar pedidos en ruta:",
              resultadoEnRuta.error.message,
            );
          } else {
            // Actualizamos el contador de pedidos en ruta.
            setPedidosEnRuta(resultadoEnRuta.count ?? 0);
          }

          // contador de entregados
          if (!resultadoEntregados.error) {
            setPedidosEntregados(resultadoEntregados.count ?? 0);
          }
        } catch (error) {
          // Capturamos posibles errores inesperados.
          console.error("Error al consultar los pedidos:", error);
        } finally {
          // Desactivamos la carga si la pantalla continúa activa.
          if (activo) {
            setCargandoPedidos(false);
          }
        }
      }

      // Ejecutamos la consulta.
      cargarPedidos();

      // contamos los productos con stock critico (misma regla que la pantalla de criticos)
      supabase
        .from("productos")
        .select("id", { count: "exact", head: true })
        .gt("stock", 0) // mas de 0
        .lte("stock", 15) // y hasta 15
        .then(({ count, error }) => {
          if (error) console.error("Error al contar criticos:", error.message);
          else if (activo) setProductosCriticos(count ?? 0);
        });

      // Al salir de la pantalla, evitamos actualizar estados innecesariamente.
      return () => {
        activo = false;
      };
    }, []),
  );

  // Renderizamos la pantalla.
  return (
    <SafeAreaView style={styles.pantalla}>
      {/* Contenedor desplazable para recorrer toda la pantalla. */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Buscador para productos y pedidos. */}
        <View style={styles.buscador}>
          <Ionicons name="search" size={18} color="gray" />

          <TextInput
            placeholder="Buscar productos, pedidos..."
            style={{ flex: 1 }}
          />
        </View>

        {/* Título principal del Dashboard. */}
        <Text style={styles.titulo}>Gestión productos</Text>

        {/* Banner principal con una imagen de fondo. */}
        <ImageBackground
          source={require("../../assets/Splashscreen/ventana.png")}
          style={styles.banner}
        >
          {/* Icono de notificaciones. */}
          <Ionicons
            name="notifications-outline"
            size={22}
            color="white"
            style={{ alignSelf: "flex-end" }}
          />

          {/* Texto promocional del banner. */}
          <Text style={styles.etiqueta}>ESPECIALISTAS EN ESPECIAS</Text>
        </ImageBackground>

        {/* Sección de novedades y resumen de pedidos. */}
        <Text style={styles.subtitulo}>Novedades</Text>

        <View style={styles.fila}>
          {/* Tarjeta de pedidos pendientes. */}
          <TouchableOpacity
            style={styles.cajaNaranja}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("ListaPedidos", {
                estadoId: "est001",
                titulo: "Pedidos pendientes",
              })
            }
          >
            <Text style={styles.cajaLabel}>PENDIENTES</Text>

            {/* Mostramos un indicador mientras consultamos Supabase. */}
            {cargandoPedidos ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cajaNumero}>{pedidosPendientes}</Text>
            )}
          </TouchableOpacity>

          {/* Tarjeta de pedidos que están en ruta. */}
          <TouchableOpacity
            style={styles.cajaNaranja}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("ListaPedidos", {
                estadoId: "est005",
                titulo: "Pedidos en ruta",
              })
            }
          >
            <Text style={styles.cajaLabel}>EN RUTA</Text>

            {/* Mostramos un indicador mientras consultamos Supabase. */}
            {cargandoPedidos ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cajaNumero}>{pedidosEnRuta}</Text>
            )}
          </TouchableOpacity>

          {/* tarjeta de pedidos entregados */}
          <TouchableOpacity
            style={styles.cajaNaranja}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("ListaPedidos", {
                estadoId: "est004",
                titulo: "Pedidos entregados",
              })
            }
          >
            <Text style={styles.cajaLabel}>ENTREGADOS</Text>
            {cargandoPedidos ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cajaNumero}>{pedidosEntregados}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Alerta de inventario. */}
        <View style={styles.alerta}>
          <Ionicons
            name="alert-circle-outline"
            size={24}
            color={colors.error}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.cajaLabel}>ALERTA DE INVENTARIO</Text>
            <Text>{productosCriticos} productos con stock crítico</Text>
          </View>

          {/* Botón para revisar los productos críticos. */}
          <TouchableOpacity
            style={styles.botonBlanco}
            onPress={() => navigation.navigate("ProductosCriticosCliente")}
          >
            <Text>Revisar</Text>
          </TouchableOpacity>
        </View>

        {/* Panel con accesos directos a las funciones de la aplicación. */}
        <Text style={styles.subtitulo}>Panel de control</Text>

        <View style={styles.grilla}>
          {/* Acceso a la gestión de productos. */}
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate("GestionProductos")}
          >
            <Ionicons name="cube-outline" size={26} color={colors.sunriseRed} />

            <Text style={styles.botonTexto}>PRODUCTOS</Text>
          </TouchableOpacity>

          {/* Acceso a la gestión de proveedores. */}
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate("GestionProveedores")}
          >
            <Ionicons
              name="business-outline"
              size={26}
              color={colors.andeanGold}
            />

            <Text style={styles.botonTexto}>PROVEEDORES</Text>
          </TouchableOpacity>

          {/* Acceso a las órdenes de compra. */}
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate("OrdenesCompra")}
          >
            <Ionicons name="document-text-outline" size={26} color="gray" />

            <Text style={styles.botonTexto}>ÓRDENES DE COMPRA</Text>
          </TouchableOpacity>

          {/* Acceso a la gestión de clientes. */}
          <TouchableOpacity
            style={styles.boton}
            onPress={() => navigation.navigate("Clientes")}
          >
            <Ionicons
              name="people-outline"
              size={26}
              color={colors.andeanGold}
            />

            <Text style={styles.botonTexto}>CLIENTES</Text>
          </TouchableOpacity>
        </View>

        {/* Banner para acceder a los productos nuevos. */}
        <TouchableOpacity
          style={styles.promo}
          onPress={() => navigation.navigate("NuevosProductos")}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitulo}>NUEVOS PRODUCTOS</Text>

            <Text style={{ color: "white" }}>
              Explorá las especias de temporada
            </Text>
          </View>

          <Ionicons name="arrow-forward" size={22} color="white" />
        </TouchableOpacity>

        {/* Sección de productos nuevos. */}
        <Text style={styles.subtitulo}>Nuevos Productos</Text>

        {/* Lista horizontal de productos destacados. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 16 }}
        >
          {/* Recorremos la lista y creamos una tarjeta por producto. */}
          {NUEVOS.map((producto) => (
            <TouchableOpacity
              key={producto.id}
              style={styles.producto}
              onPress={() => navigation.navigate("NuevosProductos")}
            >
              {/* Contenedor de la imagen y su etiqueta. */}
              <View style={styles.foto}>
                <Image
                  source={obtenerImagen(producto.nombre)}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />

                {/* Etiqueta que indica que el producto es nuevo. */}
                <Text style={styles.etiquetaNuevo}>Nuevo</Text>
              </View>

              {/* Nombre del producto en mayúsculas. */}
              <Text style={styles.productoNombre}>
                {producto.nombre.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Barra de navegación inferior compartida. */}
      <BottomNavigation navigation={navigation} activeRoute="Home" />
    </SafeAreaView>
  );
}
