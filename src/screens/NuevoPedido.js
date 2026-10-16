import {
  ActivityIndicator,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import useNuevoPedido from "../hooks/useNuevoPedido";
import s from "../styles/nuevoPedidoStyles";

const ID_TECLADO = "tecladoNuevoPedido";

const Chip = ({ activo, texto, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[s.chip, activo && s.chipActivo]}>
    <Text style={[s.chipTexto, activo && s.chipTextoActivo]}>{texto}</Text>
  </TouchableOpacity>
);

export default function NuevoPedido({ navigation }) {
  const {
    clientes, productos, metodos,
    cargando, guardando,
    clienteId, setClienteId,
    metodoId, setMetodoId,
    cantidades, cambiarCantidad,
    total, guardar, precioVenta,
  } = useNuevoPedido(navigation);

  if (cargando) {
    return (
      <SafeAreaView style={s.pantallaCarga}>
        <ActivityIndicator size="large" color="#F15A29" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.pantalla}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.contenido} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <View style={s.encabezado}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={26} color="#302820" />
            </TouchableOpacity>
            <Text style={s.tituloEncabezado}>Nuevo pedido</Text>
          </View>

          <Text style={s.seccionTitulo}>1. Cliente</Text>
          <View style={s.filaChips}>
            {clientes.map((c) => (
              <Chip
                key={c.id}
                activo={clienteId === c.id}
                texto={`${c.nombre ?? ""} ${c.apellido ?? ""}`.trim() || c.id}
                onPress={() => setClienteId(c.id)}
              />
            ))}
          </View>

          <Text style={s.seccionTitulo}>2. Productos</Text>
          {productos.map((p) => {
            const cantidad = cantidades[p.id] || 0;
            return (
              <View key={p.id} style={[s.productoFila, cantidad > 0 && s.productoFilaActiva]}>
                <View style={{ flex: 1 }}>
                  <Text style={s.productoNombre}>{p.nombre}</Text>
                  <Text style={s.productoDetalle}>
                    $ {precioVenta(p).toLocaleString("es-AR")} c/u · stock {p.stock}
                  </Text>
                  {cantidad > 0 && (
                    <Text style={s.productoSubtotal}>
                      $ {(precioVenta(p) * cantidad).toLocaleString("es-AR")}
                    </Text>
                  )}
                </View>
                <TextInput
                  value={cantidad ? String(cantidad) : ""}
                  onChangeText={(texto) => cambiarCantidad(p, texto)}
                  placeholder="0"
                  keyboardType="number-pad"
                  inputAccessoryViewID={ID_TECLADO}
                  style={s.campoCantidad}
                />
              </View>
            );
          })}

          {metodos.length > 0 && (
            <>
              <Text style={s.seccionTitulo}>3. Método de pago</Text>
              <View style={s.filaChips}>
                {metodos.map((m) => (
                  <Chip key={m.id} activo={metodoId === m.id} texto={m.nombre} onPress={() => setMetodoId(m.id)} />
                ))}
              </View>
            </>
          )}

          <Text style={s.total}>Total: $ {total.toLocaleString("es-AR")}</Text>
          <TouchableOpacity onPress={guardar} disabled={guardando} style={[s.botonGuardar, guardando && s.botonDeshabilitado]}>
            {guardando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.botonTexto}>Guardar pedido</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={ID_TECLADO}>
          <View style={s.tecladoBar}>
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Text style={s.tecladoListo}>Listo</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </SafeAreaView>
  );
}
