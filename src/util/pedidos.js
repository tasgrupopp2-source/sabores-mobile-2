/**
 * Formatea una fecha para mostrarla en la aplicación.
 */
export function formatoFecha(fecha) {
  if (!fecha) return "Sin fecha";

  const valor = new Date(fecha);

  if (Number.isNaN(valor.getTime())) {
    return "Fecha no disponible";
  }

  return valor.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formatea un importe en pesos argentinos.
 */
export function formatoPrecio(precio) {
  const valor = Number(precio);

  if (!Number.isFinite(valor)) return "$ 0,00";

  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

/**
 * Convierte el estado de un pedido en un texto legible.
 */
export function nombreEstado(estado) {
  if (!estado) return "Sin estado";

  const estados = {
    pendiente: "Pendiente",
    confirmado: "Confirmado",
    preparado: "Preparado",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
    completado: "Completado",
  };

  const clave = String(estado).toLowerCase().trim();

  return estados[clave] || clave.charAt(0).toUpperCase() + clave.slice(1);
}
