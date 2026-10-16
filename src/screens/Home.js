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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../config/theme";
import BottomNavigation from "../components/BottomNavigation";
import PanelControl from "../components/home/PanelControl";
import { NUEVOS, obtenerImagen } from "../data/imagenesProductos";
import useHome from "../hooks/useHome";
import styles from "../styles/HomeStyles";

export default function Home({ navigation }) {
  const {
    pedidosPendientes,
    pedidosEnRuta,
    pedidosEntregados,
    cargandoPedidos,
    productosCriticos,
  } = useHome();

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.buscador}>
          <Ionicons name="search" size={18} color="gray" />
          <TextInput
            placeholder="Buscar productos, pedidos..."
            style={{ flex: 1 }}
          />
        </View>

        <Text style={styles.titulo}>Gestión productos</Text>

        <ImageBackground
          source={require("../../assets/Splashscreen/ventana.png")}
          style={styles.banner}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color="white"
            style={{ alignSelf: "flex-end" }}
          />
          <Text style={styles.etiqueta}>ESPECIALISTAS EN ESPECIAS</Text>
        </ImageBackground>

        <Text style={styles.subtitulo}>Novedades</Text>

        <View style={styles.fila}>
          <TouchableOpacity
            style={styles.cajaNaranja}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ListaPedidos", { estadoId: "est001", titulo: "Pedidos pendientes" })}
          >
            <Text style={styles.cajaLabel}>PENDIENTES</Text>
            {cargandoPedidos ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cajaNumero}>{pedidosPendientes}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cajaNaranja}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ListaPedidos", { estadoId: "est005", titulo: "Pedidos en ruta" })}
          >
            <Text style={styles.cajaLabel}>EN RUTA</Text>
            {cargandoPedidos ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cajaNumero}>{pedidosEnRuta}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cajaNaranja}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("ListaPedidos", { estadoId: "est004", titulo: "Pedidos entregados" })}
          >
            <Text style={styles.cajaLabel}>ENTREGADOS</Text>
            {cargandoPedidos ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.cajaNumero}>{pedidosEntregados}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.alerta}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.error} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cajaLabel}>ALERTA DE INVENTARIO</Text>
            <Text>{productosCriticos} productos con stock crítico</Text>
          </View>
          <TouchableOpacity
            style={styles.botonBlanco}
            onPress={() => navigation.navigate("ProductosCriticosCliente")}
          >
            <Text>Revisar</Text>
          </TouchableOpacity>
        </View>

        <PanelControl navigation={navigation} />

        <TouchableOpacity
          style={styles.promo}
          onPress={() => navigation.navigate("NuevosProductos")}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitulo}>NUEVOS PRODUCTOS</Text>
            <Text style={{ color: "white" }}>Explorá las especias de temporada</Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.subtitulo}>Nuevos Productos</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {NUEVOS.map((producto) => (
            <TouchableOpacity
              key={producto.id}
              style={styles.producto}
              onPress={() => navigation.navigate("NuevosProductos")}
            >
              <View style={styles.foto}>
                <Image
                  source={obtenerImagen(producto.nombre)}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <Text style={styles.etiquetaNuevo}>Nuevo</Text>
              </View>
              <Text style={styles.productoNombre}>
                {producto.nombre.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      <BottomNavigation navigation={navigation} activeRoute="Home" />
    </SafeAreaView>
  );
}
