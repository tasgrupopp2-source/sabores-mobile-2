/* Importamos el cliente configurado de Supabase. */
import { supabase } from "./supabase";

// Obtiene todos los clientes ordenados por apellido.
export async function obtenerClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("apellido", { ascending: true });

  if (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }

  return data;
}

// Genera el próximo ID con el formato cli001, cli002, etc.
async function generarIdCliente() {
  const { data, error } = await supabase
    .from("clientes")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  const ultimo = data?.[0]?.id ?? "cli000";
  const numero = parseInt(String(ultimo).replace("cli", ""), 10) || 0;

  return `cli${String(numero + 1).padStart(3, "0")}`;
}

// Registra un cliente nuevo.
export async function crearCliente(cliente) {
  const id = await generarIdCliente();

  const { data, error } = await supabase
    .from("clientes")
    .insert({
      id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      direccion: cliente.direccion,
      email: cliente.email,
      telefono: cliente.telefono,
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }

  return data;
}

// Actualiza un cliente existente usando su ID.
export async function actualizarCliente(id, cliente) {
  const { data, error } = await supabase
    .from("clientes")
    .update({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      direccion: cliente.direccion,
      email: cliente.email,
      telefono: cliente.telefono,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar cliente:", error);
    throw error;
  }

  return data;
}

// Elimina un cliente por su ID.
export async function eliminarCliente(id) {
  const { data, error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Error al eliminar cliente:", error);
    throw error;
  }

  // Verifica si Supabase eliminó algún registro.
  if (!data || data.length === 0) {
    throw new Error(
      "No se eliminó ningún cliente. Verificá el ID y los permisos de Supabase.",
    );
  }

  return true;
}

// Obtiene todos los pedidos, del más reciente al más antiguo.
export async function obtenerPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("id, clienteId, fecha, total, estadoId")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al obtener pedidos:", error);
    throw error;
  }

  return data;
}
