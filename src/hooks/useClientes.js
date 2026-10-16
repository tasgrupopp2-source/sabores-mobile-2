import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

// Servicio para trabajar con los clientes y pedidos en Supabase.
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerClientes,
  obtenerPedidos,
} from "../services/clientesServices";

/**
 * Concentra toda la lógica de datos de Clientes:
 * carga, agrupación de pedidos, alta, edición y baja.
 * La pantalla solo se ocupa de mostrar lo que este hook devuelve.
 */
export default function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Carga clientes y pedidos al mismo tiempo.
  const cargar = useCallback(async () => {
    try {
      const [datosClientes, datosPedidos] = await Promise.all([
        obtenerClientes(),
        obtenerPedidos(),
      ]);
      setClientes(Array.isArray(datosClientes) ? datosClientes : []);
      setPedidos(Array.isArray(datosPedidos) ? datosPedidos : []);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.message || "No se pudieron cargar los clientes.",
      );
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  // Carga los datos al abrir la pantalla.
  useEffect(() => {
    cargar();
  }, [cargar]);

  // Recarga la lista al deslizar hacia abajo.
  const refrescar = () => {
    setRefrescando(true);
    cargar();
  };

  // Agrupa los pedidos por cliente.
  const pedidosPorCliente = useMemo(() => {
    const grupos = {};

    pedidos.forEach((pedido) => {
      if (!grupos[pedido.clienteId]) {
        grupos[pedido.clienteId] = [];
      }
      grupos[pedido.clienteId].push(pedido);
    });

    return grupos;
  }, [pedidos]);

  // Guarda un cliente nuevo o los cambios de uno existente.
  // Devuelve true si se guardó, para que la pantalla cierre el formulario.
  const guardar = async (datos, clienteEditando) => {
    if (!datos.nombre.trim() || !datos.apellido.trim()) {
      Alert.alert("Faltan datos", "El nombre y el apellido son obligatorios.");
      return false;
    }

    setGuardando(true);

    try {
      if (clienteEditando) {
        await actualizarCliente(clienteEditando.id, datos);
      } else {
        await crearCliente(datos);
      }

      await cargar();
      return true;
    } catch (error) {
      Alert.alert("Error", error?.message || "No se pudo guardar el cliente.");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  // Pide confirmación y elimina el cliente.
  const eliminar = (cliente) => {
    // Un cliente con pedidos no se puede borrar (relación con pedidos).
    if ((pedidosPorCliente[cliente.id] ?? []).length > 0) {
      Alert.alert(
        "No se puede eliminar",
        "Este cliente tiene pedidos asociados. Para borrarlo primero tendrías que eliminar o reasignar esos pedidos.",
      );
      return;
    }

    Alert.alert(
      "Eliminar cliente",
      `¿Seguro que querés eliminar a ${cliente.nombre} ${cliente.apellido}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarCliente(cliente.id);
              await cargar();
            } catch (error) {
              // 23503 = el cliente tiene pedidos asociados (clave foránea).
              if (error?.code === "23503") {
                Alert.alert(
                  "No se puede eliminar",
                  "Este cliente tiene pedidos asociados.",
                );
                return;
              }

              Alert.alert(
                "Error",
                error?.message || "No se pudo eliminar el cliente.",
              );
            }
          },
        },
      ],
    );
  };

  return {
    clientes,
    pedidosPorCliente,
    cargando,
    refrescando,
    guardando,
    refrescar,
    guardar,
    eliminar,
  };
}
