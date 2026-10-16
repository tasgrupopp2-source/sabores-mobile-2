import { useEffect, useState } from "react";

import { supabase } from "../services/supabase";

export default function usePedidos(navigation, estadoId) {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState({});
  const [detalles, setDetalles] = useState({});
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  const cargarPedidos = async (esActualizacion = false) => {
    if (esActualizacion) setActualizando(true);
    else setCargando(true);
    setError("");

    try {
      if (!estadoId) throw new Error("No se recibió el estado de los pedidos.");

      const { data, error: errorConsulta } = await supabase
        .from("pedidos")
        .select("id, clienteId, fecha, total, estadoId")
        .eq("estadoId", estadoId)
        .order("fecha", { ascending: false });

      if (errorConsulta) throw errorConsulta;
      setPedidos(data || []);

      const resClientes = await supabase.from("clientes").select("id, nombre, apellido");
      if (!resClientes.error) {
        const mapa = {};
        (resClientes.data || []).forEach((c) => {
          mapa[c.id] = `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim();
        });
        setClientes(mapa);
      }

      const ids = (data || []).map((p) => String(p.id));
      if (ids.length > 0) {
        const [resDetalle, resProductos] = await Promise.all([
          supabase.from("detalle_pedido").select("*").in("pedidoId", ids),
          supabase.from("productos").select("id, nombre"),
        ]);
        if (!resDetalle.error) {
          const nombres = {};
          (resProductos.data || []).forEach((p) => { nombres[String(p.id)] = p.nombre; });
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

  const avanzarEstado = async (pedido, siguiente) => {
    const { error: errorUpdate } = await supabase
      .from("pedidos")
      .update({ estadoId: siguiente.estadoId })
      .eq("id", pedido.id);

    if (errorUpdate) {
      const mensaje = errorUpdate.message || "No se pudo cambiar el estado.";
      const { Platform, Alert } = require("react-native");
      if (Platform.OS === "web") globalThis.alert(mensaje);
      else Alert.alert("Error", mensaje);
      return;
    }
    cargarPedidos(true);
  };

  useEffect(() => {
    const quitar = navigation.addListener("focus", () => cargarPedidos());
    return quitar;
  }, [navigation, estadoId]);

  return {
    pedidos,
    clientes,
    detalles,
    cargando,
    actualizando,
    error,
    cargarPedidos,
    avanzarEstado,
  };
}
