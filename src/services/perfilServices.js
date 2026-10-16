import { supabase } from "./supabase";

/** Obtiene el usuario autenticado y, si existe, su trabajador vinculado. */
export async function obtenerPerfil() {
  const {
    data: { user },
    error: errorUsuario,
  } = await supabase.auth.getUser();
  if (errorUsuario) throw new Error("No se pudo verificar la cuenta actual.");
  if (!user)
    throw new Error("No hay una sesión activa. Iniciá sesión nuevamente.");

  const { data: trabajador, error: errorTrabajador } = await supabase
    .from("trabajadores")
    .select("id, nombre, apellido, puesto")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (errorTrabajador) {
    throw new Error(
      "No se pudieron consultar los datos del trabajador. Verificá los permisos de la tabla.",
    );
  }

  return {
    usuarioId: user.id,
    correo: user.email ?? "",
    nombre: trabajador?.nombre ?? "",
    apellido: trabajador?.apellido ?? "",
    puesto: trabajador?.puesto ?? "",
    trabajadorVinculado: Boolean(trabajador),
  };
}

/** Solicita el cambio de correo en Supabase Auth. */
export async function actualizarCorreo(nuevoCorreo) {
  const correoLimpio = nuevoCorreo.trim().toLowerCase();
  if (!correoLimpio) throw new Error("Ingresá un correo electrónico.");

  const {
    data: { user },
    error,
  } = await supabase.auth.updateUser({ email: correoLimpio });
  if (error) throw new Error(error.message);

  return {
    correo: user?.email ?? correoLimpio,
    mensaje:
      "Si Supabase solicita una confirmación, revisá tu correo electrónico para completar el cambio.",
  };
}

/** Cierra la sesión actual en Supabase. */
export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error)
    throw new Error("No se pudo cerrar la sesión. Intentá nuevamente.");
}

/** Actualiza la contraseña de la cuenta autenticada. */
export async function actualizarContrasena(nuevaContrasena) {
  if (!nuevaContrasena || nuevaContrasena.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const {
    data: { user },
    error: errorUsuario,
  } = await supabase.auth.getUser();
  if (errorUsuario || !user) {
    throw new Error(
      "No se pudo verificar tu sesión. Iniciá sesión nuevamente.",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: nuevaContrasena,
  });
  if (error)
    throw new Error(error.message || "No se pudo actualizar la contraseña.");

  return { mensaje: "La contraseña se actualizó correctamente." };
}
