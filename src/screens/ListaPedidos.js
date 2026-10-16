// Pantalla para mostrar los pedidos filtrados por estado.

// Importamos los componentes necesarios de React y React Native.
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
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
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError(err.message || "No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  };

  // Cargamos los pedidos cuando se abre la pantalla.
  useEffect(() => {
    cargarPedidos();
  }, [estadoId]);

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
          {item.clienteId || "Sin cliente asignado"}
        </Text>

        <Text style={styles.etiqueta}>Fecha</Text>
        <Text style={styles.valor}>{formatearFecha(item.fecha)}</Text>

        {/* Total del pedido */}
        <View style={styles.filaTotal}>
          <Text style={styles.textoTotal}>Total del pedido</Text>
          <Text style={styles.importe}>{formatearMoneda(item.total)}</Text>
        </View>
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
