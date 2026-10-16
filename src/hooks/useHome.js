import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../services/supabase";

export default function useHome() {
  const [pedidosPendientes, setPedidosPendientes] = useState(0);
  const [pedidosEnRuta, setPedidosEnRuta] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState(0);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const [productosCriticos, setProductosCriticos] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      async function cargarPedidos() {
        setCargandoPedidos(true);
        try {
          const [resPendientes, resEnRuta, resEntregados] = await Promise.all([
            supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estadoId", "est001"),
            supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estadoId", "est005"),
            supabase.from("pedidos").select("id", { count: "exact", head: true }).eq("estadoId", "est004"),
          ]);

          if (!activo) return;

          if (!resPendientes.error) setPedidosPendientes(resPendientes.count ?? 0);
          if (!resEnRuta.error) setPedidosEnRuta(resEnRuta.count ?? 0);
          if (!resEntregados.error) setPedidosEntregados(resEntregados.count ?? 0);
        } catch (error) {
          console.error("Error al consultar los pedidos:", error);
        } finally {
          if (activo) setCargandoPedidos(false);
        }
      }

      cargarPedidos();

      supabase
        .from("productos")
        .select("id", { count: "exact", head: true })
        .gt("stock", 0)
        .lte("stock", 15)
        .then(({ count, error }) => {
          if (error) console.error("Error al contar criticos:", error.message);
          else if (activo) setProductosCriticos(count ?? 0);
        });

      return () => { activo = false; };
    }, []),
  );

  return {
    pedidosPendientes,
    pedidosEnRuta,
    pedidosEntregados,
    cargandoPedidos,
    productosCriticos,
  };
}
