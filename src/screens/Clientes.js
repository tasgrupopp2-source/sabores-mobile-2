import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Colores de la app.
import { colors } from "../config/theme";

// Lógica de datos de clientes y pedidos.
import useClientes from "../hooks/useClientes";

// Estilos de la pantalla.
import styles from "../styles/clientesStyles";

// Componentes de la pantalla.
import BottomNavigation from "../components/BottomNavigation";
import BuscadorClientes from "../components/clientes/BuscadorClientes";
import ClienteCard from "../components/clientes/ClienteCard";
import FormularioCliente from "../components/clientes/FormularioCliente";

// Imagen local del paisaje andino.
const FONDO_ANDINO = require("../../assets/Splashscreen/fondo_paisaje_andino_1080x2524.jpg");

export default function Clientes({ navigation }) {
  // Datos y acciones (cargar, guardar, eliminar).
  const {
    clientes,
    pedidosPorCliente,
    cargando,
    refrescando,
    guardando,
    refrescar,
    guardar,
    eliminar,
  } = useClientes();

  // Estados propios de la pantalla.
  const [busqueda, setBusqueda] = useState("");
  const [idExpandido, setIdExpandido] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  // Filtra por nombre, apellido, localidad o email.
  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es-AR");

    if (!texto) {
      return clientes;
    }

    return clientes.filter((cliente) =>
      [cliente.nombre, cliente.apellido, cliente.direccion, cliente.email].some(
        (campo) =>
          String(campo ?? "")
            .toLocaleLowerCase("es-AR")
            .includes(texto),
      ),
    );
  }, [clientes, busqueda]);

  // Abre el formulario vacío o con los datos del cliente a editar.
  const abrirFormulario = (cliente = null) => {
    setClienteEditando(cliente);
    setModalVisible(true);
  };

  // Guarda y cierra el formulario si salió bien.
  const guardarCliente = async (datos) => {
    const guardado = await guardar(datos, clienteEditando);

    if (guardado) {
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.pantalla} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Encabezado con el paisaje andino. */}
      <ImageBackground
        source={FONDO_ANDINO}
        resizeMode="cover"
        imageStyle={styles.imagenFondo}
        style={styles.encabezadoFondo}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            style={styles.botonVolver}
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={26} color={colors.black} />
          </TouchableOpacity>

          <Text style={styles.titulo}>Clientes</Text>
        </View>
      </ImageBackground>

      {/* Buscador y contador. */}
      <BuscadorClientes
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        cantidad={clientesFiltrados.length}
      />

      {/* Lista de clientes. */}
      {cargando ? (
        <ActivityIndicator
          size="large"
          color={colors.sunriseRed}
          style={styles.indicadorCarga}
        />
      ) : (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={refrescar}
              colors={[colors.sunriseRed]}
            />
          }
          renderItem={({ item }) => (
            <ClienteCard
              cliente={item}
              pedidos={pedidosPorCliente[item.id] ?? []}
              expandido={idExpandido === item.id}
              onToggle={() =>
                setIdExpandido(idExpandido === item.id ? null : item.id)
              }
              onEditar={() => abrirFormulario(item)}
              onEliminar={() => eliminar(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.vacio}>
              <Ionicons name="people-outline" size={48} color={colors.gray} />
              <Text style={styles.textoVacio}>No se encontraron clientes</Text>
            </View>
          }
        />
      )}

      {/* Botón flotante para agregar un cliente. */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => abrirFormulario()}
        accessibilityLabel="Agregar cliente"
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      {/* Formulario de alta y edición. */}
      <FormularioCliente
        visible={modalVisible}
        cliente={clienteEditando}
        guardando={guardando}
        onGuardar={guardarCliente}
        onCerrar={() => setModalVisible(false)}
      />

      {/* Navegación inferior compartida (ninguna pestaña activa). */}
      <BottomNavigation navigation={navigation} activeRoute="Clientes" />
    </SafeAreaView>
  );
}
