import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../config/theme";
import styles from "../../styles/clientesStyles";

// Formulario vacío para crear un cliente.
const FORMULARIO_VACIO = {
  nombre: "",
  apellido: "",
  direccion: "",
  email: "",
  telefono: "",
};

// Campos del formulario: se dibujan con un map para no repetir código.
const CAMPOS = [
  { clave: "nombre", placeholder: "Nombre" },
  { clave: "apellido", placeholder: "Apellido" },
  { clave: "direccion", placeholder: "Dirección / Localidad" },
  {
    clave: "email",
    placeholder: "Email",
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  { clave: "telefono", placeholder: "Teléfono", keyboardType: "phone-pad" },
];

// Modal para crear un cliente nuevo o editar uno existente.
export default function FormularioCliente({
  visible,
  cliente, // null = cliente nuevo
  guardando,
  onGuardar,
  onCerrar,
}) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

  // Cada vez que se abre, carga los datos del cliente o lo deja vacío.
  useEffect(() => {
    if (!visible) return;

    setFormulario(
      cliente
        ? {
            nombre: cliente.nombre ?? "",
            apellido: cliente.apellido ?? "",
            direccion: cliente.direccion ?? "",
            email: cliente.email ?? "",
            telefono: cliente.telefono ?? "",
          }
        : FORMULARIO_VACIO,
    );
  }, [visible, cliente]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalFondo}
      >
        <View style={styles.modalTarjeta}>
          <View style={styles.modalEncabezado}>
            <Text style={styles.modalTitulo}>
              {cliente ? "Editar cliente" : "Nuevo cliente"}
            </Text>
            <TouchableOpacity onPress={onCerrar}>
              <Ionicons name="close" size={26} color={colors.black} />
            </TouchableOpacity>
          </View>

          {CAMPOS.map(({ clave, ...propiedades }) => (
            <TextInput
              key={clave}
              style={styles.input}
              placeholderTextColor={colors.gray}
              value={formulario[clave]}
              onChangeText={(valor) =>
                setFormulario({ ...formulario, [clave]: valor })
              }
              {...propiedades}
            />
          ))}

          <TouchableOpacity
            style={[styles.botonGuardar, guardando && styles.botonGuardarDeshabilitado]}
            onPress={() => onGuardar(formulario)}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.textoGuardar}>Guardar cliente</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
