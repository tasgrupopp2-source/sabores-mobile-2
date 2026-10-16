import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import OrdenCompraCard from "../components/ordenesCompra/OrdenCompraCard";
import { obtenerProductos } from "../services/productosServices";
import {
  crearOrdenCompra,
  eliminarOrdenCompra,
  obtenerOrdenesCompra,
} from "../services/ordenesCompraService";
import { obtenerProveedores } from "../services/proveedoresService";
import styles from "../styles/ordenesCompraStyles";

const detalleVacio = () => ({
  id: `detalle-${Date.now()}-${Math.random()}`,
  productoId: "",
  cantidad: "1",
  precioUnitario: "",
});

const obtenerNombreProveedor = (orden) =>
  orden.proveedor?.nombre || orden.proveedores?.nombre || "Proveedor sin nombre";

export default function OrdenesCompra({ navigation }) {
  const [ordenes, setOrdenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorNuevo, setProveedorNuevo] = useState("");
  const [detallesNuevos, setDetallesNuevos] = useState([detalleVacio()]);

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      globalThis.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [ordenesCargadas, proveedoresCargados, productosCargados] =
        await Promise.all([
          obtenerOrdenesCompra(),
          obtenerProveedores(),
          obtenerProductos(),
        ]);
      setOrdenes(ordenesCargadas);
      setProveedores(proveedoresCargados);
      setProductos(productosCargados ?? []);
    } catch (err) {
      mostrarMensaje("Error", err?.message || "No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const detallesNormalizados = useMemo(
    () =>
      detallesNuevos.map((detalle) => {
        const producto = productos.find(
          (item) => String(item.id) === String(detalle.productoId),
        );
        const precio = Number(detalle.precioUnitario || producto?.precio || 0);
        const cantidad = Number(detalle.cantidad) || 0;
        return {
          ...detalle,
          precioUnitario: detalle.precioUnitario || producto?.precio || "",
          totalParcial: precio * cantidad,
        };
      }),
    [detallesNuevos, productos],
  );

  const totalNuevo = detallesNormalizados.reduce(
    (total, detalle) => total + detalle.totalParcial,
    0,
  );

  const actualizarDetalle = (id, cambios) => {
    setDetallesNuevos((actuales) =>
      actuales.map((detalle) =>
        detalle.id === id ? { ...detalle, ...cambios } : detalle,
      ),
    );
  };

  const agregarDetalle = () => {
    setDetallesNuevos((actuales) => [...actuales, detalleVacio()]);
  };

  const quitarDetalle = (id) => {
    setDetallesNuevos((actuales) => {
      const restantes = actuales.filter((detalle) => detalle.id !== id);
      return restantes.length ? restantes : [detalleVacio()];
    });
  };

  const limpiarFormulario = () => {
    setProveedorNuevo("");
    setDetallesNuevos([detalleVacio()]);
  };

  const handleCrear = async () => {
    const detallesValidos = detallesNormalizados.filter(
      (detalle) =>
        detalle.productoId &&
        Number.isInteger(Number(detalle.cantidad)) &&
        Number(detalle.cantidad) > 0 &&
        Number(detalle.precioUnitario) >= 0,
    );

    if (!proveedorNuevo || detallesValidos.length === 0) {
      mostrarMensaje(
        "Campos incompletos",
        "Seleccioná un proveedor y agregá al menos un producto válido.",
      );
      return;
    }

    try {
      setGuardando(true);
      await crearOrdenCompra({
        proveedorId: proveedorNuevo,
        detalles: detallesValidos,
      });
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

  const ordenesFiltradas = ordenes.filter((orden) => {
    const texto = busqueda.toLowerCase();
    return (
      String(orden.id || "").toLowerCase().includes(texto) ||
      obtenerNombreProveedor(orden).toLowerCase().includes(texto)
    );
  });

  const renderDetalleFormulario = (detalle) => {
    const producto = productos.find(
      (item) => String(item.id) === String(detalle.productoId),
    );
    return (
      <View style={styles.filaDetalleFormulario} key={detalle.id}>
        <View style={styles.campoPrecio}>
          {productos.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.opcionSeleccion,
                producto?.id === item.id && styles.opcionSeleccionActiva,
              ]}
              onPress={() =>
                actualizarDetalle(detalle.id, {
                  productoId: item.id,
                  precioUnitario: item.precio,
                })
              }
              disabled={guardando}
            >
              <Text
                style={[
                  styles.textoOpcion,
                  producto?.id === item.id && styles.textoOpcionActiva,
                ]}
              >
                {item.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.campoCantidad}
          placeholder="Cant."
          value={String(detalle.cantidad)}
          onChangeText={(cantidad) => actualizarDetalle(detalle.id, { cantidad })}
          keyboardType="numeric"
          editable={!guardando}
        />
        <TextInput
          style={styles.campoPrecio}
          placeholder="Precio"
          value={String(detalle.precioUnitario)}
          onChangeText={(precioUnitario) =>
            actualizarDetalle(detalle.id, { precioUnitario })
          }
          keyboardType="numeric"
          editable={!guardando}
        />
        <TouchableOpacity
          style={styles.botonQuitarDetalle}
          onPress={() => quitarDetalle(detalle.id)}
          disabled={guardando}
        >
          <Text style={styles.textoQuitarDetalle}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.flecha}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Órdenes de compra</Text>
      </View>
      <Text style={styles.subtitulo}>Gestión de compras</Text>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar por proveedor o número..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => setMostrarFormulario(true)}
      >
        <Text style={styles.textoBoton}>+ Nueva orden de compra</Text>
      </TouchableOpacity>

      {mostrarFormulario && (
        <View style={styles.tarjeta}>
          <Text style={styles.numeroOrden}>Nueva orden de compra</Text>
          <View style={styles.campoSeleccion}>
            {proveedores.map((proveedor) => (
              <TouchableOpacity
                key={proveedor.id}
                style={[
                  styles.opcionSeleccion,
                  proveedorNuevo === proveedor.id && styles.opcionSeleccionActiva,
                ]}
                onPress={() => setProveedorNuevo(proveedor.id)}
                disabled={guardando}
              >
                <Text
                  style={[
                    styles.textoOpcion,
                    proveedorNuevo === proveedor.id && styles.textoOpcionActiva,
                  ]}
                >
                  {proveedor.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {detallesNuevos.map(renderDetalleFormulario)}
          <TouchableOpacity style={styles.botonAgregar} onPress={agregarDetalle} disabled={guardando}>
            <Text style={styles.textoBoton}>+ Agregar producto</Text>
          </TouchableOpacity>
          <Text style={styles.textoTotalFormulario}>
            Total: $ {totalNuevo.toLocaleString("es-AR")}
          </Text>
          <TouchableOpacity
            style={[styles.botonAgregar, guardando && styles.botonGuardarDeshabilitado]}
            onPress={handleCrear}
            disabled={guardando}
          >
            {guardando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.textoBoton}>Guardar orden</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonCancelar} onPress={() => setMostrarFormulario(false)}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {cargando ? (
        <ActivityIndicator size="large" color="#F15A29" style={styles.indicadorCarga} />
      ) : (
        <FlatList
          data={ordenesFiltradas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <OrdenCompraCard
              orden={item}
              nombreProveedor={obtenerNombreProveedor(item)}
              onEliminar={handleEliminar}
            />
          )}
          contentContainerStyle={styles.lista}
          refreshing={cargando}
          onRefresh={cargarDatos}
          ListEmptyComponent={<Text style={styles.textoVacio}>No hay órdenes de compra registradas.</Text>}
        />
      )}
    </View>
  );
}
