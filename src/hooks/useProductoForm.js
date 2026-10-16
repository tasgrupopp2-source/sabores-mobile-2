import { useEffect, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

import {
  actualizarProducto,
  crearProducto,
} from "../services/productosServices";
import { obtenerProveedores } from "../services/proveedoresService";
import { supabase } from "../services/supabase";

const BUCKET = "productos";

const convertirNumero = (valor) => Number(valor.replace(",", "."));

const mostrarMensaje = (titulo, mensaje) => {
  if (Platform.OS === "web") {
    globalThis.alert(`${titulo}\n\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
};

const subirImagen = async (archivo) => {
  const respuesta = await fetch(archivo.uri);
  const bytes = await respuesta.arrayBuffer();

  const tipo = archivo.mimeType || "image/jpeg";
  const extension = tipo.split("/")[1] || "jpg";
  const ruta = `producto-${Date.now()}.${extension}`;

  const { error: errorSubida } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, bytes, { contentType: tipo });
  if (errorSubida) throw errorSubida;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(ruta);
  return data.publicUrl;
};

export default function useProductoForm(producto, navigation) {
  const esEdicion = Boolean(producto);
  const proveedorInicial = producto?.proveedor_id ?? producto?.proveedores?.id ?? "";

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [precioCompra, setPrecioCompra] = useState(
    producto?.precio_compra == null ? "" : String(producto.precio_compra),
  );
  const [margen, setMargen] = useState(
    producto?.margen == null ? "30" : String(producto.margen),
  );
  const [stock, setStock] = useState(
    producto?.stock === undefined ? "" : String(producto.stock),
  );
  const imagenExistente = producto?.imagen ?? null;
  const [imagenNueva, setImagenNueva] = useState(null);
  const [proveedorId, setProveedorId] = useState(proveedorInicial);
  const [proveedores, setProveedores] = useState([]);
  const [mostrarProveedores, setMostrarProveedores] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const datos = await obtenerProveedores();
        if (activo) setProveedores(datos);
      } catch (err) {
        if (activo) setError(err?.message || "No se pudieron cargar los proveedores.");
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, []);

  const imagenPreview = imagenNueva?.uri ?? imagenExistente;

  const proveedorSeleccionado = useMemo(
    () => proveedores.find((p) => String(p.id) === String(proveedorId)),
    [proveedores, proveedorId],
  );

  const precioVenta = useMemo(() => {
    const compra = convertirNumero(precioCompra);
    const porcentaje = convertirNumero(margen);
    if (precioCompra.trim() === "" || margen.trim() === "" || !Number.isFinite(compra) || !Number.isFinite(porcentaje)) {
      return 0;
    }
    return compra + (compra * porcentaje) / 100;
  }, [precioCompra, margen]);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!resultado.canceled) setImagenNueva(resultado.assets[0]);
  };

  const guardar = async () => {
    const nombreLimpio = nombre.trim();
    const precioCompraNumero = convertirNumero(precioCompra);
    const margenNumero = convertirNumero(margen);
    const stockNumero = Number(stock);

    if (!nombreLimpio) return mostrarMensaje("Campo obligatorio", "Ingresá el nombre del producto.");
    if (!proveedorId) return mostrarMensaje("Proveedor obligatorio", "Seleccioná un proveedor.");
    if (precioCompra.trim() === "" || !Number.isFinite(precioCompraNumero) || precioCompraNumero < 0) {
      return mostrarMensaje("Precio de compra inválido", "Ingresá un precio numérico mayor o igual a cero.");
    }
    if (margen.trim() === "" || !Number.isFinite(margenNumero) || margenNumero < 0) {
      return mostrarMensaje("Margen inválido", "Ingresá un margen numérico mayor o igual a cero.");
    }
    if (stock.trim() === "" || !Number.isInteger(stockNumero) || stockNumero < 0) {
      return mostrarMensaje("Stock inválido", "Ingresá un stock entero mayor o igual a cero.");
    }

    const datos = {
      nombre: nombreLimpio,
      precio_compra: precioCompraNumero,
      margen: margenNumero,
      precio: precioCompraNumero + (precioCompraNumero * margenNumero) / 100,
      stock: stockNumero,
      proveedor_id: proveedorId,
    };

    try {
      setGuardando(true);
      datos.imagen = imagenNueva ? await subirImagen(imagenNueva) : imagenExistente;

      if (esEdicion) {
        await actualizarProducto(producto.id, datos);
      } else {
        await crearProducto(datos);
      }

      const titulo = esEdicion ? "Producto actualizado" : "Producto creado";
      const mensaje = esEdicion ? "Los cambios se guardaron correctamente." : "El producto se creó correctamente.";

      if (Platform.OS === "web") {
        globalThis.alert(mensaje);
        navigation.goBack();
      } else {
        Alert.alert(titulo, mensaje, [{ text: "Aceptar", onPress: () => navigation.goBack() }]);
      }
    } catch (err) {
      mostrarMensaje("No se pudo guardar", err?.message || "Intentá nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  return {
    esEdicion,
    nombre, setNombre,
    precioCompra, setPrecioCompra,
    margen, setMargen,
    stock, setStock,
    proveedorId, setProveedorId,
    proveedores,
    proveedorSeleccionado,
    mostrarProveedores, setMostrarProveedores,
    imagenPreview,
    precioVenta,
    cargando,
    guardando,
    error,
    seleccionarImagen,
    guardar,
  };
}
