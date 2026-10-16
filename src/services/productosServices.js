/* Importamos el cliente configurado de Supabase. */
import { supabase } from "./supabase";

// Obtiene todos los productos de la base de datos.
export async function obtenerProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*, proveedores(id, nombre)")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al obtener productos:", error.message);
    throw error;
  }

  return data;
}

// Registra un producto nuevo.
export async function crearProducto(producto) {
  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: producto.nombre,
      precio_compra: producto.precio_compra,
      margen: producto.margen,
      precio: producto.precio,
      stock: producto.stock,
      proveedor_id: producto.proveedor_id,
      imagen: producto.imagen,
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear producto:", error.message);
    throw error;
  }

  return data;
}

// Actualiza un producto existente usando su ID.
export async function actualizarProducto(id, producto) {
  const { data, error } = await supabase
    .from("productos")
    .update({
      nombre: producto.nombre,
      precio_compra: producto.precio_compra,
      margen: producto.margen,
      precio: producto.precio,
      stock: producto.stock,
      proveedor_id: producto.proveedor_id,
      imagen: producto.imagen,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar producto:", error.message);
    throw error;
  }

  return data;
}

// Elimina un producto por su ID.
export async function eliminarProducto(id) {
  const { error } = await supabase.from("productos").delete().eq("id", id);

  if (error) {
    console.error("Error al eliminar producto:", error.message);
    throw error;
  }
}
