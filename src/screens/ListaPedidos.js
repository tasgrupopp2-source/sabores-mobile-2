// Pantalla para mostrar los pedidos filtrados por estado.

// Importamos los componentes necesarios de React y React Native.
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Importamos la conexión con Supabase.
import { supabase } from "../services/supabase";

// Importamos los colores de la aplicación.
import { colors } from "../config/theme";
import styles from "../styles/listaPedidosStyles";

// Función que devuelve el nombre del estado según su identificador.
const obtenerNombreEstado = (estadoId) => {
  const estados = {
    est001: "Pendiente",
    est002: "Confirmado",
    est003: "Preparando",
    est004: "Entregado",
    est005: "En ruta",
  };

  return estados[estadoId] || "Estado desconocido";
};

// el siguiente paso de cada estado: pendiente -> en ruta -> entregado
const SIGUIENTE_ESTADO = {
  est001: { estadoId: "est005", texto: "Enviar (pasa a En ruta)", icono: "🚚" },
  est005: { estadoId: "est004", texto: "Marcar como entregado", icono: "✅" },
};

// Función que formatea los importes en pesos argentinos.
const formatearMoneda = (importe) => {
  return Number(importe || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });
};

// Función que muestra la fecha en formato argentino.
const formatearFecha = (fecha) => {
  if (!fecha) return "Fecha no disponible";

  const fechaValida = new Date(fecha);

  if (Number.isNaN(fechaValida.getTime())) {
    return fecha;
  }

  return fechaValida.toLocaleDateString("es-AR");
};

// Componente principal de la pantalla.
export default function ListaPedidos({ navigation, route }) {
  // Recibimos el estado y el título desde la pantalla anterior.
  const estadoId = route.params?.estadoId;
  const titulo = route.params?.titulo || "Lista de pedidos";

  // Guardamos los pedidos y el estado de la consulta.
  const [pedidos, setPedidos] = useState([]);
  // para mostrar el nombre del cliente y lo que compro
  const [clientes, setClientes] = useState({}); // { cli001: "Juan Perez" }
  const [detalles, setDetalles] = useState({}); // { ped011: [{ nombre, cantidad, subtotal }] }
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  // Consultamos los pedidos en Supabase.
  const cargarPedidos = async (esActualizacion = false) => {
    if (esActualizacion) {
      setActualizando(true);
    } else {
      setCargando(true);
    }

    setError("");

    try {
      // Verificamos que se haya recibido un estado.
      if (!estadoId) {
        throw new Error("No se recibió el estado de los pedidos.");
      }

      // Consultamos los pedidos correspondientes al estado seleccionado.
      const { data, error: errorConsulta } = await supabase
        .from("pedidos")
        .select("id, clienteId, fecha, total, estadoId")
        .eq("estadoId", estadoId)
        .order("fecha", { ascending: false });

      // Si Supabase devuelve un error, lo mostramos.
      if (errorConsulta) {
        throw errorConsulta;
      }

      // Guardamos los resultados.
      setPedidos(data || []);

      // traemos los clientes para mostrar el nombre en vez del id
      const resClientes = await supabase.from("clientes").select("id, nombre, apellido");
      if (!resClientes.error) {
        const mapa = {};
        (resClientes.data || []).forEach((c) => {
          mapa[c.id] = `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim();
        });
        setClientes(mapa);
      }

      // traemos los productos que se compraron en estos pedidos
      const ids = (data || []).map((p) => String(p.id));
      if (ids.length > 0) {
        const [resDetalle, resProductos] = await Promise.all([
          supabase.from("detalle_pedido").select("*").in("pedidoId", ids),
          supabase.from("productos").select("id, nombre"),
        ]);
        if (resDetalle.error) {
          console.log("Sin detalle de pedidos:", resDetalle.error.message);
        } else {
          const nombres = {};
          (resProductos.data || []).forEach((p) => {
            nombres[String(p.id)] = p.nombre;
          });
          const agrupado = {};
          (resDetalle.data || []).forEach((d) => {
            if (!agrupado[d.pedidoId]) agrupado[d.pedidoId] = [];
            agrupado[d.pedidoId].push({
              nombre: nombres[String(d.productoId)] || "Producto",
              cantidad: d.cantidad,
              subtotal: d.subtotal,
            });
          });
          setDetalles(agrupado);
        }
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError(err.message || "No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  };

  // cambia el estado del pedido en supabase y recarga la lista
  const avanzarEstado = async (pedido) => {
    const siguiente = SIGUIENTE_ESTADO[pedido.estadoId];
    if (!siguiente) return;

    const { error: errorUpdate } = await supabase
      .from("pedidos")
      .update({ estadoId: siguiente.estadoId })
      .eq("id", pedido.id);

    if (errorUpdate) {
      const mensaje = errorUpdate.message || "No se pudo cambiar el estado.";
      if (Platform.OS === "web") globalThis.alert(mensaje);
      else Alert.alert("Error", mensaje);
      return;
    }

    // el pedido se va de esta lista porque ya no tiene este estado
    cargarPedidos(true);
  };

  // Cargamos los pedidos cuando se abre la pantalla.
  // y cada vez que volvemos (por ejemplo despues de crear un pedido)
  useEffect(() => {
    const quitar = navigation.addListener("focus", () => cargarPedidos());
    return quitar;
  }, [navigation, estadoId]);

  // Componente visual de cada pedido.
  const renderizarPedido = ({ item }) => {
    return (
      <View style={styles.tarjeta}>
        {/* Identificador del pedido */}
        <View style={styles.encabezadoTarjeta}>
          <Text style={styles.idPedido}>Pedido #{item.id}</Text>

          <View style={styles.etiquetaEstado}>
            <Text style={styles.textoEstado}>
              {obtenerNombreEstado(item.estadoId)}
            </Text>
          </View>
        </View>

        {/* Información del pedido */}
        <View style={styles.separador} />

        <Text style={styles.etiqueta}>Cliente</Text>
        <Text style={styles.valor}>
          {clientes[item.clienteId] || item.clienteId || "Sin cliente asignado"}
        </Text>

        <Text style={styles.etiqueta}>Fecha</Text>
        <Text style={styles.valor}>{formatearFecha(item.fecha)}</Text>

        {/* lo que compro el cliente */}
        <Text style={styles.etiqueta}>Productos</Text>
        {(detalles[String(item.id)] || []).length === 0 ? (
          <Text style={styles.valor}>Sin detalle de productos</Text>
        ) : (
          detalles[String(item.id)].map((d, i) => (
            <View
              key={i}
              style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}
            >
              <Text style={styles.valor}>
                {d.nombre} × {d.cantidad}
              </Text>
              <Text style={styles.valor}>{formatearMoneda(d.subtotal)}</Text>
            </View>
          ))
        )}

        {/* Total del pedido */}
        <View style={styles.filaTotal}>
          <Text style={styles.textoTotal}>Total del pedido</Text>
          <Text style={styles.importe}>{formatearMoneda(item.total)}</Text>
        </View>

        {/* boton para pasar el pedido al siguiente estado */}
        {SIGUIENTE_ESTADO[item.estadoId] ? (
          <TouchableOpacity
            onPress={() => avanzarEstado(item)}
            style={{
              marginTop: 12,
              backgroundColor: "#F15A29",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
              {SIGUIENTE_ESTADO[item.estadoId].icono} {SIGUIENTE_ESTADO[item.estadoId].texto}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoVolver}>‹ Volver</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>{titulo}</Text>

        <Text style={styles.subtitulo}>
          Pedidos registrados en Sabores Andinos
        </Text>

        {/* en pendientes se pueden cargar pedidos nuevos */}
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

      {/* Contenido principal */}
      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={colors.andeanGold} />
          <Text style={styles.mensaje}>Cargando pedidos...</Text>
        </View>
      ) : error ? (
        <View style={styles.centrado}>
          <Text style={styles.error}>{error}</Text>

          <TouchableOpacity
            style={styles.botonReintentar}
            onPress={() => cargarPedidos()}
          >
            <Text style={styles.textoBotonReintentar}>Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Resumen de la cantidad de pedidos */}
          <View style={styles.resumen}>
            <Text style={styles.textoResumen}>
              {pedidos.length}{" "}
              {pedidos.length === 1
                ? "pedido encontrado"
                : "pedidos encontrados"}
            </Text>
          </View>

          {/* Lista de pedidos */}
          <FlatList
            data={pedidos}
            keyExtractor={(item, index) => String(item.id ?? index)}
            renderItem={renderizarPedido}
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

                <Text style={styles.mensaje}>
                  Todavía no hay pedidos con este estado.
                </Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}
