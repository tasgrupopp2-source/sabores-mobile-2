import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import OrdenCompraCard from "../components/ordenesCompra/OrdenCompraCard";
import {
  crearOrdenCompra,
  eliminarOrdenCompra,
  obtenerOrdenesCompra,
} from "../services/ordenesCompraService";
import { obtenerProductos } from "../services/productosServices";
import { obtenerProveedores } from "../services/proveedoresService";
import styles from "../styles/ordenesCompraStyles";

const detalleVacio = () => ({
  id: `detalle-${Date.now()}-${Math.random()}`,
  productoId: "",
  cantidad: "1",
  precioUnitario: "",
});

// id para la barrita con el boton "Listo" arriba del teclado (solo iphone)
const ID_TECLADO = "tecladoOrdenCompra";

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
    // solo los productos del proveedor elegido
    const productosDelProveedor = productos.filter(
      (p) => String(p.proveedor_id) === String(proveedorNuevo),
    );
    return (
      <View style={styles.filaDetalleFormulario} key={detalle.id}>
        <View style={styles.campoPrecio}>
          {productosDelProveedor.length === 0 && (
            <Text style={styles.textoOpcion}>
              {proveedorNuevo ? "Este proveedor no tiene productos." : "Elegí un proveedor primero."}
            </Text>
          )}
          {productosDelProveedor.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.opcionSeleccion,
                producto?.id === item.id && styles.opcionSeleccionActiva,
              ]}
              onPress={() =>
                actualizarDetalle(detalle.id, {
                  productoId: item.id,
                  // se compra al precio de compra (si no tiene, usa el de venta)
                  precioUnitario: item.precio_compra || item.precio,
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
          inputAccessoryViewID={ID_TECLADO}
        />
        {/* el precio no se toca: se calcula solo (precio de compra x cantidad) */}
        <View style={[styles.campoPrecio, { justifyContent: "center", backgroundColor: "#F3EEE8" }]}>
          {detalle.precioUnitario ? (
            <>
              <Text style={{ color: "#302820", fontWeight: "bold" }}>
                $ {(Number(detalle.precioUnitario) * (Number(detalle.cantidad) || 0)).toLocaleString("es-AR")}
              </Text>
              <Text style={{ color: "#8C8178", fontSize: 11 }}>
                $ {Number(detalle.precioUnitario).toLocaleString("es-AR")} c/u
              </Text>
            </>
          ) : (
            <Text style={{ color: "#8C8178" }}>Precio</Text>
          )}
        </View>
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
    // el KeyboardAvoidingView empuja la pantalla para arriba cuando sale el teclado
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
    {/* ahora toda la pantalla se puede bajar (antes quedaba trabada) */}
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled" // se pueden tocar botones con el teclado abierto
      keyboardDismissMode="on-drag" // si deslizas la pantalla se baja el teclado
      refreshControl={<RefreshControl refreshing={false} onRefresh={cargarDatos} />}
    >
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
                onPress={() => {
                  setProveedorNuevo(proveedor.id);
                  // al cambiar de proveedor se limpian los productos elegidos
                  setDetallesNuevos([detalleVacio()]);
                }}
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
        // como ya estamos dentro de un ScrollView, las ordenes se muestran con map
        <View style={styles.lista}>
          {ordenesFiltradas.length === 0 ? (
            <Text style={styles.textoVacio}>No hay órdenes de compra registradas.</Text>
          ) : (
            ordenesFiltradas.map((item) => (
              <OrdenCompraCard
                key={String(item.id)}
                orden={item}
                nombreProveedor={obtenerNombreProveedor(item)}
                onEliminar={handleEliminar}
              />
            ))
          )}
        </View>
      )}
    </ScrollView>

    {/* en iphone el teclado de numeros no tiene boton para cerrarlo, asi que le agregamos "Listo" */}
    {Platform.OS === "ios" && (
      <InputAccessoryView nativeID={ID_TECLADO}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            backgroundColor: "#F1ECE6",
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <TouchableOpacity onPress={() => Keyboard.dismiss()}>
            <Text style={{ color: "#F15A29", fontWeight: "bold", fontSize: 16 }}>Listo</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    )}
    </KeyboardAvoidingView>
  );
}