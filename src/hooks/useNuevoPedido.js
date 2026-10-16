import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

import { supabase } from "../services/supabase";
import { obtenerClientes } from "../services/clientesServices";
import { obtenerProductos } from "../services/productosServices";

const mostrarMensaje = (titulo, mensaje) => {
  if (Platform.OS === "web") globalThis.alert(`${titulo}\n\n${mensaje}`);
  else Alert.alert(titulo, mensaje);
};

const siguienteIdPedido = (pedidos) => {
  const mayor = pedidos.reduce((max, p) => {
    const numero = Number(String(p.id).replace(/\D/g, "")) || 0;
    return Math.max(max, numero);
  }, 0);
  return `ped${String(mayor + 1).padStart(3, "0")}`;
};

const precioVenta = (p) => {
  if (Number(p.precio) > 0) return Number(p.precio);
  const compra = Number(p.precio_compra) || 0;
  const margen = Number(p.margen) || 0;
  return compra + (compra * margen) / 100;
};

export default function useNuevoPedido(navigation) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [metodoId, setMetodoId] = useState(null);
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
        setProductos((listaProductos ?? []).filter((p) => Number(p.stock) > 0));
        if (!resMetodos.error) setMetodos(resMetodos.data ?? []);
      } catch (err) {
        mostrarMensaje("Error", err?.message || "No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const cambiarCantidad = (producto, texto) => {
    const numero = Number(texto.replace(/\D/g, "")) || 0;
    const tope = Number(producto.stock) || 0;
    setCantidades((act) => ({ ...act, [producto.id]: Math.min(numero, tope) }));
  };

  const elegidos = productos.filter((p) => (cantidades[p.id] || 0) > 0);
  const total = elegidos.reduce((s, p) => s + precioVenta(p) * cantidades[p.id], 0);

  const guardar = async () => {
    if (!clienteId) return mostrarMensaje("Falta el cliente", "Elegí a quién es el pedido.");
    if (elegidos.length === 0) return mostrarMensaje("Sin productos", "Poné la cantidad de al menos un producto.");
    if (metodos.length > 0 && !metodoId) return mostrarMensaje("Falta el pago", "Elegí un método de pago.");

    try {
      setGuardando(true);
      const { data: pedidosActuales, error: errorIds } = await supabase.from("pedidos").select("id");
      if (errorIds) throw errorIds;

      const nuevo = {
        id: siguienteIdPedido(pedidosActuales ?? []),
        clienteId, fecha: new Date().toISOString(), total,
        trabajadorId: "trab001", estadoId: "est001",
      };
      if (metodoId) nuevo.metodoPagoId = metodoId;

      const { error } = await supabase.from("pedidos").insert(nuevo);
      if (error) throw error;

      const filas = elegidos.map((p, i) => ({
        id: `${nuevo.id}-${i + 1}`, pedidoId: nuevo.id,
        productoId: String(p.id), cantidad: cantidades[p.id],
        precioUnitario: precioVenta(p), subtotal: precioVenta(p) * cantidades[p.id],
      }));
      const { error: errorDetalle } = await supabase.from("detalle_pedido").insert(filas);
      if (errorDetalle) console.log("No se guardo el detalle:", errorDetalle.message);

      for (const p of elegidos) {
        const { error: errorStock } = await supabase
          .from("productos").update({ stock: Number(p.stock) - cantidades[p.id] }).eq("id", p.id);
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

  return {
    clientes, productos, metodos,
    cargando, guardando,
    clienteId, setClienteId,
    metodoId, setMetodoId,
    cantidades, cambiarCantidad,
    total, guardar, precioVenta,
  };
}
