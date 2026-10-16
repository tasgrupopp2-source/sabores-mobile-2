import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";

import {
  crearOrdenCompra,
  eliminarOrdenCompra,
  obtenerOrdenesCompra,
} from "../services/ordenesCompraService";
import { obtenerProductos } from "../services/productosServices";
import { obtenerProveedores } from "../services/proveedoresService";

const detalleVacio = () => ({
  id: `detalle-${Date.now()}-${Math.random()}`,
  productoId: "",
  cantidad: "1",
  precioUnitario: "",
});

const mostrarMensaje = (titulo, mensaje) => {
  if (Platform.OS === "web") {
    globalThis.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
};

export default function useOrdenCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorNuevo, setProveedorNuevo] = useState("");
  const [detallesNuevos, setDetallesNuevos] = useState([detalleVacio()]);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [ordenesCargadas, proveedoresCargados, productosCargados] =
        await Promise.all([obtenerOrdenesCompra(), obtenerProveedores(), obtenerProductos()]);
      setOrdenes(ordenesCargadas);
      setProveedores(proveedoresCargados);
      setProductos(productosCargados ?? []);
    } catch (err) {
      mostrarMensaje("Error", err?.message || "No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const detallesNormalizados = useMemo(
    () =>
      detallesNuevos.map((detalle) => {
        const producto = productos.find((item) => String(item.id) === String(detalle.productoId));
        const precio = Number(detalle.precioUnitario || producto?.precio_compra || producto?.precio || 0);
        const cantidad = Number(detalle.cantidad) || 0;
        return {
          ...detalle,
          precioUnitario: detalle.precioUnitario || producto?.precio_compra || producto?.precio || "",
          totalParcial: precio * cantidad,
        };
      }),
    [detallesNuevos, productos],
  );

  const totalNuevo = detallesNormalizados.reduce((t, d) => t + d.totalParcial, 0);

  const actualizarDetalle = (id, cambios) => {
    setDetallesNuevos((act) => act.map((d) => (d.id === id ? { ...d, ...cambios } : d)));
  };

  const agregarDetalle = () => {
    setDetallesNuevos((act) => [...act, detalleVacio()]);
  };

  const quitarDetalle = (id) => {
    setDetallesNuevos((act) => {
      const rest = act.filter((d) => d.id !== id);
      return rest.length ? rest : [detalleVacio()];
    });
  };

  const limpiarFormulario = () => {
    setProveedorNuevo("");
    setDetallesNuevos([detalleVacio()]);
  };

  const cambiarProveedor = (id) => {
    setProveedorNuevo(id);
    setDetallesNuevos([detalleVacio()]);
  };

  const handleCrear = async () => {
    const detallesValidos = detallesNormalizados.filter(
      (d) => d.productoId && Number.isInteger(Number(d.cantidad)) && Number(d.cantidad) > 0 && Number(d.precioUnitario) >= 0,
    );
    if (!proveedorNuevo || detallesValidos.length === 0) {
      mostrarMensaje("Campos incompletos", "Seleccioná un proveedor y agregá al menos un producto válido.");
      return;
    }
    try {
      setGuardando(true);
      await crearOrdenCompra({ proveedorId: proveedorNuevo, detalles: detallesValidos });
      limpiarFormulario();
      setMostrarFormulario(false);
      await cargarDatos();
      mostrarMensaje("Orden creada", "La orden de compra se registró correctamente.");
    } catch (err) {
      mostrarMensaje("Error", err?.message || "No se pudo crear la orden.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = (orden) => {
    const ejecutar = async () => {
      try {
        setCargando(true);
        await eliminarOrdenCompra(orden.id);
        await cargarDatos();
        mostrarMensaje("Orden eliminada", "La orden se eliminó correctamente.");
      } catch (err) {
        mostrarMensaje("Error", err?.message || "No se pudo eliminar la orden.");
      } finally {
        setCargando(false);
      }
    };

    const mensaje = `¿Seguro que querés eliminar la orden ${orden.id}?`;
    if (Platform.OS === "web") {
      if (globalThis.confirm(mensaje)) ejecutar();
      return;
    }
    Alert.alert("Eliminar orden", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: ejecutar },
    ]);
  };

  const obtenerNombreProveedor = (orden) =>
    orden.proveedor?.nombre || orden.proveedores?.nombre || "Proveedor sin nombre";

  const ordenesFiltradas = ordenes.filter((orden) => {
    const texto = busqueda.toLowerCase();
    return (
      String(orden.id || "").toLowerCase().includes(texto) ||
      obtenerNombreProveedor(orden).toLowerCase().includes(texto)
    );
  });

  return {
    ordenesFiltradas,
    proveedores,
    productos,
    cargando,
    guardando,
    busqueda, setBusqueda,
    mostrarFormulario, setMostrarFormulario,
    proveedorNuevo, cambiarProveedor,
    detallesNuevos,
    detallesNormalizados,
    totalNuevo,
    actualizarDetalle,
    agregarDetalle,
    quitarDetalle,
    handleCrear,
    handleEliminar,
    cargarDatos,
    obtenerNombreProveedor,
  };
}
