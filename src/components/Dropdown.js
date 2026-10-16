import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Dropdown({
  opciones,
  valor,
  onChange,
  placeholder = "Seleccioná una opción",
  labelKey = "nombre",
  valueKey = "id",
  disabled = false,
  maxHeight = 200,
}) {
  const [abierto, setAbierto] = useState(false);

  const opcionSeleccionada = opciones.find(
    (op) => String(op[valueKey]) === String(valor),
  );

  return (
    <View style={estilos.contenedor}>
      <TouchableOpacity
        style={[estilos.selector, abierto && estilos.selectorAbierto]}
        onPress={() => setAbierto((prev) => !prev)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            estilos.textoSelector,
            !opcionSeleccionada && estilos.placeholder,
          ]}
          numberOfLines={1}
        >
          {opcionSeleccionada ? opcionSeleccionada[labelKey] : placeholder}
        </Text>
        <Ionicons
          name={abierto ? "chevron-up" : "chevron-down"}
          size={20}
          color="#776B61"
        />
      </TouchableOpacity>

      {abierto && (
        <View style={estilos.lista}>
          <ScrollView
            style={{ maxHeight }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {opciones.length === 0 ? (
              <Text style={estilos.vacio}>Sin opciones disponibles</Text>
            ) : (
              opciones.map((opcion) => {
                const activo = String(opcion[valueKey]) === String(valor);
                return (
                  <TouchableOpacity
                    key={opcion[valueKey]}
                    style={[estilos.opcion, activo && estilos.opcionActiva]}
                    onPress={() => {
                      onChange(opcion[valueKey]);
                      setAbierto(false);
                    }}
                  >
                    <Text
                      style={[
                        estilos.textoOpcion,
                        activo && estilos.textoOpcionActivo,
                      ]}
                    >
                      {opcion[labelKey]}
                    </Text>
                    {activo && (
                      <Ionicons name="checkmark" size={18} color="#F15A29" />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { zIndex: 10 },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5DCD3",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  selectorAbierto: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: "#F15A29",
  },
  textoSelector: { flex: 1, fontSize: 14, color: "#302820" },
  placeholder: { color: "#8C8178" },
  lista: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#E5DCD3",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E8E0",
  },
  opcionActiva: { backgroundColor: "#FFF0E8" },
  textoOpcion: { color: "#555", fontSize: 14 },
  textoOpcionActivo: { color: "#F15A29", fontWeight: "bold" },
  vacio: { color: "#8C8178", padding: 15, textAlign: "center" },
});
