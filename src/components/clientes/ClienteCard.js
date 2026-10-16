import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../config/theme";
import styles from "../../styles/clientesStyles";
import PedidosCliente from "./PedidosCliente";

// Abre una aplicación externa.
const abrirEnlace = (url) => {
  Linking.openURL(url).catch(() => {
    Alert.alert("Error", "No se pudo abrir la aplicación.");
  });
};

// Tarjeta de información de un cliente.
export default function ClienteCard({
  cliente,
  pedidos,
  expandido,
  onToggle,
  onEditar,
  onEliminar,
}) {
  const iniciales = `${cliente.nombre?.[0] ?? ""}${
    cliente.apellido?.[0] ?? ""
  }`;

  // Solicita confirmación antes de eliminar.
  const confirmarEliminacion = () => {
    const ejecutarEliminacion = () => {
      onEliminar?.();
    };

    if (Platform.OS === "web") {
      const confirmar = globalThis.confirm(
        `¿Seguro que querés eliminar a ${cliente.nombre} ${cliente.apellido}?`,
      );

      if (confirmar) {
        ejecutarEliminacion();
      }

      return;
    }

    Alert.alert(
      "Eliminar cliente",
      `¿Seguro que querés eliminar a ${cliente.nombre} ${cliente.apellido}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: ejecutarEliminacion,
        },
      ],
    );
  };

  return (
    <View style={styles.tarjeta}>
      {/* Resumen del cliente. */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggle}
        style={styles.filaPrincipal}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{iniciales.toUpperCase()}</Text>
        </View>

        <View style={styles.contenidoFlexible}>
          <Text style={styles.nombre}>
            {cliente.nombre} {cliente.apellido}
          </Text>

          <View style={styles.filaIcono}>
            <Ionicons name="location-outline" size={14} color={colors.gray} />
            <Text style={styles.textoSecundario}>{cliente.direccion}</Text>
          </View>
        </View>

        {pedidos.length > 0 && (
          <View style={styles.badgePedidos}>
            <Text style={styles.textoBadge}>{pedidos.length}</Text>
          </View>
        )}

        <Ionicons
          name={expandido ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.gray}
        />
      </TouchableOpacity>

      {/* Detalles del cliente. */}
      {expandido && (
        <View style={styles.detalle}>
          <View style={styles.filaIcono}>
            <Ionicons name="mail-outline" size={16} color={colors.sunriseRed} />
            <Text style={styles.textoDetalle}>{cliente.email}</Text>
          </View>

          <View style={styles.filaIcono}>
            <Ionicons name="call-outline" size={16} color={colors.sunriseRed} />
            <Text style={styles.textoDetalle}>{cliente.telefono}</Text>
          </View>

          <PedidosCliente pedidos={pedidos} />

          {/* Acciones de contacto. */}
          <View style={styles.acciones}>
            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() => abrirEnlace(`tel:${cliente.telefono}`)}
            >
              <Ionicons name="call" size={17} color={colors.sunriseRed} />
              <Text style={styles.textoAccion}>Llamar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() => abrirEnlace(`https://wa.me/54${cliente.telefono}`)}
            >
              <Ionicons
                name="logo-whatsapp"
                size={17}
                color={colors.sunriseRed}
              />
              <Text style={styles.textoAccion}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonAccion}
              onPress={() => abrirEnlace(`mailto:${cliente.email}`)}
            >
              <Ionicons name="mail" size={17} color={colors.sunriseRed} />
              <Text style={styles.textoAccion}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* Acciones administrativas. */}
          <View style={styles.accionesAdmin}>
            <TouchableOpacity style={styles.botonAdmin} onPress={onEditar}>
              <Ionicons
                name="create-outline"
                size={16}
                color={colors.mountainBlue}
              />
              <Text style={styles.textoEditar}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonAdmin}
              onPress={confirmarEliminacion}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
              <Text style={styles.textoEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
