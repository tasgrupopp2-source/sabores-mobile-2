import { useCallback, useEffect, useState } from "react";
import {
  actualizarContrasena,
  actualizarCorreo,
  cerrarSesion,
  obtenerPerfil,
} from "../services/perfilServices";

/** Centraliza el estado y las acciones de la pantalla Perfil. */
export default function usePerfil(navigation) {
  const [perfil, setPerfil] = useState(null);
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [guardandoContrasena, setGuardandoContrasena] = useState(false);

  const cargarPerfil = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await obtenerPerfil();
      setPerfil(datos);
      setCorreo(datos.correo);
    } catch (err) {
      setError(err.message || "No se pudo cargar el perfil.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  const guardarCorreo = useCallback(async () => {
    setError("");
    setMensaje("");
    if (!correo.trim()) {
      setError("Ingresá un correo electrónico.");
      return false;
    }
    setGuardando(true);
    try {
      const resultado = await actualizarCorreo(correo);
      setMensaje(resultado.mensaje);
      setPerfil((actual) =>
        actual ? { ...actual, correo: resultado.correo } : actual,
      );
      setCorreo(resultado.correo);
      return true;
    } catch (err) {
      setError(err.message || "No se pudo actualizar el correo.");
      return false;
    } finally {
      setGuardando(false);
    }
  }, [correo]);

  const guardarContrasena = useCallback(async () => {
    setError("");
    setMensaje("");
    if (nuevaContrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    setGuardandoContrasena(true);
    try {
      const resultado = await actualizarContrasena(nuevaContrasena);
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setMensaje(resultado.mensaje);
      return true;
    } catch (err) {
      setError(err.message || "No se pudo actualizar la contraseña.");
      return false;
    } finally {
      setGuardandoContrasena(false);
    }
  }, [nuevaContrasena, confirmarContrasena]);

  const salir = useCallback(async () => {
    setError("");
    setMensaje("");
    setCerrandoSesion(true);
    try {
      await cerrarSesion();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (err) {
      setError(err.message || "No se pudo cerrar la sesión.");
    } finally {
      setCerrandoSesion(false);
    }
  }, [navigation]);

  return {
    perfil,
    correo,
    setCorreo,
    cargando,
    guardando,
    cerrandoSesion,
    error,
    mensaje,
    cargarPerfil,
    guardarCorreo,
    nuevaContrasena,
    setNuevaContrasena,
    confirmarContrasena,
    setConfirmarContrasena,
    guardandoContrasena,
    guardarContrasena,
    salir,
  };
}
