/* Importamos el cliente configurado de Supabase. */
import { supabase } from "./supabase";

// Obtiene todos los proveedores ordenados por nombre.
export async function obtenerProveedores() {
  const { data, error } = await supabase
    .from("proveedores")
    .select("id, created_at, nombre, contacto, telefono, rubro")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }

  return data ?? [];
}

// Genera identificadores como prov001, prov002, etc.
async function generarIdProveedor() {
  const { data, error } = await supabase.from("proveedores").select("id");

  if (error) {
    console.error("Error al generar ID:", error);
    throw error;
  }

  const mayorNumero = (data ?? []).reduce((mayor, proveedor) => {
    const coincidencia = String(proveedor.id ?? "").match(/^prov(\d+)$/);
    const numero = coincidencia ? Number(coincidencia[1]) : 0;

    return Math.max(mayor, numero);
  }, 0);

  return `prov${String(mayorNumero + 1).padStart(3, "0")}`;
}

// Registra un proveedor nuevo en Supabase.
export async function crearProveedor(proveedor) {
  const id = await generarIdProveedor();

  const { data, error } = await supabase
    .from("proveedores")
    .insert({
      id,
      nombre: proveedor.nombre.trim(),
      contacto: proveedor.contacto.trim(),
      telefono: proveedor.telefono.trim(),
      rubro: proveedor.rubro?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear proveedor:", error);
    throw error;
  }

  return data;
}

// Actualiza los datos de un proveedor.
export async function actualizarProveedor(id, proveedor) {
  const { data, error } = await supabase
    .from("proveedores")
    .update({
      nombre: proveedor.nombre.trim(),
      contacto: proveedor.contacto.trim(),
      telefono: proveedor.telefono.trim(),
      rubro: proveedor.rubro?.trim() || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar proveedor:", error);
    throw error;
  }

  return data;
}

// Elimina un proveedor por su identificador.
export async function eliminarProveedor(id) {
  const { data, error } = await supabase
    .from("proveedores")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Error al eliminar proveedor:", {
      mensaje: error.message,
      codigo: error.code,
      detalles: error.details,
      sugerencia: error.hint,
    });

    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(
      "No se eliminó el proveedor. Verificá el ID y los permisos de Supabase.",
    );
  }

  return true;
}
