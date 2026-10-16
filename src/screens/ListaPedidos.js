import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../config/theme";
import PedidoCard from "../components/pedidos/PedidoCard";
import usePedidos from "../hooks/usePedidos";
import styles from "../styles/listaPedidosStyles";

export default function ListaPedidos({ navigation, route }) {
  const estadoId = route.params?.estadoId;
  const titulo = route.params?.titulo || "Lista de pedidos";

  const {
    pedidos,
    clientes,
    detalles,
    cargando,
    actualizando,
    error,
    cargarPedidos,
    avanzarEstado,
  } = usePedidos(navigation, estadoId);

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
          <Text style={styles.textoVolver}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>Pedidos registrados en Sabores Andinos</Text>

        {estadoId === "est001" ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("NuevoPedido")}
            style={{
              marginTop: 12,
              backgroundColor: "#F15A29",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>+ Nuevo pedido</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={colors.andeanGold} />
          <Text style={styles.mensaje}>Cargando pedidos...</Text>
        </View>
      ) : error ? (
        <View style={styles.centrado}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.botonReintentar} onPress={() => cargarPedidos()}>
            <Text style={styles.textoBotonReintentar}>Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.resumen}>
            <Text style={styles.textoResumen}>
              {pedidos.length} {pedidos.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
            </Text>
          </View>

          <FlatList
            data={pedidos}
            keyExtractor={(item, index) => String(item.id ?? index)}
            renderItem={({ item }) => (
              <PedidoCard
                pedido={item}
                nombreCliente={clientes[item.clienteId]}
                detallesProductos={detalles[String(item.id)] || []}
                onAvanzar={avanzarEstado}
              />
            )}
            contentContainerStyle={styles.lista}
            refreshControl={
              <RefreshControl
                refreshing={actualizando}
                onRefresh={() => cargarPedidos(true)}
                tintColor={colors.andeanGold}
              />
            }
            ListEmptyComponent={
              <View style={styles.centrado}>
                <Text style={styles.iconoVacio}>📦</Text>
                <Text style={styles.tituloVacio}>No hay pedidos</Text>
                <Text style={styles.mensaje}>Todavía no hay pedidos con este estado.</Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}
