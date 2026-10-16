import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { colors } from "../../config/theme";
import styles from "../../styles/clientesStyles";

// Buscador con lupa y botón para limpiar el texto.
export default function BuscadorClientes({ busqueda, setBusqueda, cantidad }) {
  return (
    <>
      <View style={styles.buscador}>
        <Ionicons name="search" size={18} color={colors.gray} />
        <TextInput
          style={styles.inputBuscador}
          placeholder="Buscar por nombre, localidad o email"
          placeholderTextColor={colors.gray}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda("")}>
            <Ionicons name="close-circle" size={18} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Cantidad de clientes encontrados. */}
      <Text style={styles.contador}>
        Mostrando {cantidad} {cantidad === 1 ? "cliente" : "clientes"}
      </Text>
    </>
  );
}
