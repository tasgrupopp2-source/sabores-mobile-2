import { supabase } from "./supabase";

const ORDEN_CON_RELACIONES = `
  id,
  proveedorId,
  fecha,
  estado,
  created_at,
  proveedor:proveedores(nombre, contacto, telefono),
  detalles:detalle_orden_compra(
    id,
    ordenId,
    productoId,
    cantidad,
    precioUnitario,
    totalParcial,
    producto:productos(nombre, precio, presentacion)
  )
`;

export async function obtenerOrdenesCompra() {
  const { data, error } = await supabase
    .from("ordenes_compra")
    .select(ORDEN_CON_RELACIONES)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener órdenes:", error);
    throw error;
  }

  return data ?? [];
}

async function generarIdOrden() {
  const { data, error } = await supabase
    .from("ordenes_compra")
    .select("id");

  if (error) {
    console.error("Error al generar ID:", error);
    throw error;
  }

  const mayorNumero = (data ?? []).reduce((mayor, orden) => {
    const coincidencia = String(orden.id ?? "").match(/^OC-(\d+)$/);
    const numero = coincidencia ? Number(coincidencia[1]) : 0;
    return Math.max(mayor, numero);
  }, 0);

  return `OC-${String(mayorNumero + 1).padStart(4, "0")}`;
}

export async function crearOrdenCompra(orden) {
  const id = await generarIdOrden();
  const detalles = (orden.detalles ?? []).map((detalle) => ({
    ordenId: id,
    productoId: detalle.productoId,
    cantidad: Number(detalle.cantidad),
    precioUnitario: Number(detalle.precioUnitario),
    totalParcial: Number(detalle.totalParcial),
  }));

  const { data, error } = await supabase
    .from("ordenes_compra")
    .insert({
      id,
      proveedorId: orden.proveedorId,
      fecha: new Date().toISOString().split("T")[0],
      estado: "Pendiente",
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear orden:", error);
    throw error;
  }

  if (detalles.length === 0) {
    return { ...data, detalles: [] };
  }

  const { data: detallesGuardados, error: errorDetalles } = await supabase
    .from("detalle_orden_compra")
    .insert(detalles)
    .select();

  if (errorDetalles) {
    console.error("Error al crear detalles de orden:", errorDetalles);
    throw errorDetalles;
  }

  return { ...data, detalles: detallesGuardados ?? [] };
}

export async function eliminarOrdenCompra(id) {
  const { errorDetalles } = await supabase
    .from("detalle_orden_compra")
    .delete()
    .eq("ordenId", id);

  if (errorDetalles) {
    console.error("Error al eliminar detalles de orden:", errorDetalles);
    throw errorDetalles;
  }

  const { error } = await supabase
    .from("ordenes_compra")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar orden:", error);
    throw error;
  }

  return true;
}

export async function actualizarEstadoOrden(id, estado) {
  const { data, error } = await supabase
    .from("ordenes_compra")
    .update({ estado })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar estado:", error);
    throw error;
  }

  return data;
}
