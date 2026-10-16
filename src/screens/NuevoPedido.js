// pantalla para cargar un pedido nuevo de un cliente
// el pedido arranca en "Pendiente" (est001) y se descuenta el stock de los productos
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

import { supabase } from "../services/supabase";
import { obtenerClientes } from "../services/clientesServices";
import { obtenerProductos } from "../services/productosServices";

const NARANJA = "#F15A29";
const ID_TECLADO = "tecladoNuevoPedido";

// en web Alert.alert no se ve, por eso usamos el alert del navegador
const mostrarMensaje = (titulo, mensaje) => {
  if (Platform.OS === "web") globalThis.alert(`${titulo}\n\n${mensaje}`);
  else Alert.alert(titulo, mensaje);
};

// arma el siguiente id: ped001, ped002... mirando el numero mas alto
const siguienteIdPedido = (pedidos) => {
  const mayor = pedidos.reduce((max, p) => {
    const numero = Number(String(p.id).replace(/\D/g, "")) || 0;
    return Math.max(max, numero);
  }, 0);
  return `ped${String(mayor + 1).padStart(3, "0")}`;
};

// precio de venta: si el producto no lo tiene cargado, lo calculamos con compra + margen
const precioVenta = (p) => {
  if (Number(p.precio) > 0) return Number(p.precio);
  const compra = Number(p.precio_compra) || 0;
  const margen = Number(p.margen) || 0;
  return compra + (compra * margen) / 100;
};

export default function NuevoPedido({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [clienteId, setClienteId] = useState(null);
  const [metodoId, setMetodoId] = useState(null);
  // lo que va pidiendo: { productoId: cantidad }
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    const cargar = async () => {
      try {
        const [listaClientes, listaProductos, resMetodos] = await Promise.all([
          obtenerClientes(),
          obtenerProductos(),
          supabase.from("metodosPago").select("id, nombre").eq("activo", true).order("id"),
        ]);
        setClientes(listaClientes ?? []);
        // solo productos que tengan stock
        setProductos((listaProductos ?? []).filter((p) => Number(p.stock) > 0));
        if (resMetodos.error) console.log("Error metodos de pago:", resMetodos.error.message);
        else setMetodos(resMetodos.data ?? []);
      } catch (err) {
        mostrarMensaje("Error", err?.message || "No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // cambia la cantidad de un producto (no deja pasar del stock)
  const cambiarCantidad = (producto, texto) => {
    const numero = Number(texto.replace(/\D/g, "")) || 0;
    const tope = Number(producto.stock) || 0;
    setCantidades((actual) => ({ ...actual, [producto.id]: Math.min(numero, tope) }));
  };

  // productos que tienen cantidad mayor a 0
  const elegidos = productos.filter((p) => (cantidades[p.id] || 0) > 0);
  const total = elegidos.reduce(
    (suma, p) => suma + precioVenta(p) * cantidades[p.id],
    0,
  );

  const guardar = async () => {
    if (!clienteId) return mostrarMensaje("Falta el cliente", "Elegí a quién es el pedido.");
    if (elegidos.length === 0) return mostrarMensaje("Sin productos", "Poné la cantidad de al menos un producto.");
    if (metodos.length > 0 && !metodoId) return mostrarMensaje("Falta el pago", "Elegí un método de pago.");

    try {
      setGuardando(true);

      // buscamos los ids que ya existen para armar el siguiente
      const { data: pedidosActuales, error: errorIds } = await supabase.from("pedidos").select("id");
      if (errorIds) throw errorIds;

      const nuevo = {
        id: siguienteIdPedido(pedidosActuales ?? []),
        clienteId,
        fecha: new Date().toISOString(),
        total,
        trabajadorId: "trab001", // por ahora siempre el mismo trabajador
        estadoId: "est001", // todo pedido nuevo arranca pendiente
      };
      if (metodoId) nuevo.metodoPagoId = metodoId;

      const { error } = await supabase.from("pedidos").insert(nuevo);
      if (error) throw error;

      // guardamos que productos llevo y cuantos (tabla detalle_pedido)
      const filas = elegidos.map((p, indice) => ({
        id: `${nuevo.id}-${indice + 1}`, // ped011-1, ped011-2...
        pedidoId: nuevo.id,
        productoId: String(p.id),
        cantidad: cantidades[p.id],
        precioUnitario: precioVenta(p),
        subtotal: precioVenta(p) * cantidades[p.id],
      }));
      const { error: errorDetalle } = await supabase.from("detalle_pedido").insert(filas);
      if (errorDetalle) console.log("No se guardo el detalle:", errorDetalle.message);

      // descontamos el stock de cada producto pedido
      for (const p of elegidos) {
        const { error: errorStock } = await supabase
          .from("productos")
          .update({ stock: Number(p.stock) - cantidades[p.id] })
          .eq("id", p.id);
        if (errorStock) console.log("No se pudo descontar stock de", p.nombre, errorStock.message);
      }

      if (Platform.OS === "web") {
        globalThis.alert(`Pedido ${nuevo.id} creado. Quedó en Pendientes.`);
        navigation.goBack();
      } else {
        Alert.alert("Pedido creado", `El pedido ${nuevo.id} quedó en Pendientes.`, [
          { text: "Aceptar", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      mostrarMensaje("No se pudo guardar", err?.message || "Intentá nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  // boton redondeado para elegir (cliente / metodo)
  const Chip = ({ activo, texto, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: activo ? NARANJA : "#E5DCD3",
        backgroundColor: activo ? NARANJA : "#FFFFFF",
      }}
    >
      <Text style={{ color: activo ? "#FFFFFF" : "#302820", fontWeight: activo ? "bold" : "normal" }}>
        {texto}
      </Text>
    </TouchableOpacity>
  );

  const titulo = { fontSize: 16, fontWeight: "bold", color: "#302820", marginTop: 20, marginBottom: 10 };

  if (cargando) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFF9F3" }}>
        <ActivityIndicator size="large" color={NARANJA} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF9F3" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* encabezado */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={26} color="#302820" />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#302820" }}>Nuevo pedido</Text>
          </View>

          {/* 1. cliente */}
          <Text style={titulo}>1. Cliente</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {clientes.map((c) => (
              <Chip
                key={c.id}
                activo={clienteId === c.id}
                texto={`${c.nombre ?? ""} ${c.apellido ?? ""}`.trim() || c.id}
                onPress={() => setClienteId(c.id)}
              />
            ))}
          </View>

          {/* 2. productos */}
          <Text style={titulo}>2. Productos</Text>
          {productos.map((p) => {
            const cantidad = cantidades[p.id] || 0;
            return (
              <View
                key={p.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: cantidad > 0 ? NARANJA : "#E5DCD3",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 8,
                  gap: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", color: "#302820" }}>{p.nombre}</Text>
                  <Text style={{ color: "#8C8178", fontSize: 12 }}>
                    $ {precioVenta(p).toLocaleString("es-AR")} c/u · stock {p.stock}
                  </Text>
                  {cantidad > 0 ? (
                    <Text style={{ color: NARANJA, fontWeight: "bold", marginTop: 4 }}>
                      $ {(precioVenta(p) * cantidad).toLocaleString("es-AR")}
                    </Text>
                  ) : null}
                </View>
                <TextInput
                  value={cantidad ? String(cantidad) : ""}
                  onChangeText={(texto) => cambiarCantidad(p, texto)}
                  placeholder="0"
                  keyboardType="number-pad"
                  inputAccessoryViewID={ID_TECLADO}
                  style={{
                    width: 60,
                    textAlign: "center",
                    borderWidth: 1,
                    borderColor: "#E5DCD3",
                    borderRadius: 10,
                    paddingVertical: 8,
                    backgroundColor: "#FFF9F3",
                  }}
                />
              </View>
            );
          })}

          {/* 3. metodo de pago */}
          {metodos.length > 0 ? (
            <>
              <Text style={titulo}>3. Método de pago</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {metodos.map((m) => (
                  <Chip key={m.id} activo={metodoId === m.id} texto={m.nombre} onPress={() => setMetodoId(m.id)} />
                ))}
              </View>
            </>
          ) : null}

          {/* total y guardar */}
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#302820", marginTop: 24 }}>
            Total: $ {total.toLocaleString("es-AR")}
          </Text>
          <TouchableOpacity
            onPress={guardar}
            disabled={guardando}
            style={{
              backgroundColor: NARANJA,
              opacity: guardando ? 0.6 : 1,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 14,
            }}
          >
            {guardando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 16 }}>Guardar pedido</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* boton "Listo" arriba del teclado de numeros (solo iphone) */}
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={ID_TECLADO}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", backgroundColor: "#F1ECE6", paddingHorizontal: 16, paddingVertical: 8 }}>
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Text style={{ color: NARANJA, fontWeight: "bold", fontSize: 16 }}>Listo</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </SafeAreaView>
  );
}
