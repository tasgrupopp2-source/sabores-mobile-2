import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../config/theme";
import styles from "../../styles/HomeStyles";

export default function PanelControl({ navigation }) {
  return (
    <>
      <Text style={styles.subtitulo}>Panel de control</Text>

      <View style={styles.grilla}>
        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("GestionProductos")}
        >
          <Ionicons name="cube-outline" size={26} color={colors.sunriseRed} />
          <Text style={styles.botonTexto}>PRODUCTOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("GestionProveedores")}
        >
          <Ionicons name="business-outline" size={26} color={colors.andeanGold} />
          <Text style={styles.botonTexto}>PROVEEDORES</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("OrdenesCompra")}
        >
          <Ionicons name="document-text-outline" size={26} color="gray" />
          <Text style={styles.botonTexto}>ÓRDENES DE COMPRA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate("Clientes")}
        >
          <Ionicons name="people-outline" size={26} color={colors.andeanGold} />
          <Text style={styles.botonTexto}>CLIENTES</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
