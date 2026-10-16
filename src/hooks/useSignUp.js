import { useState } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";

import { supabase } from "../services/supabase";

export default function useSignUp(navigation) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSignUp = async () => {
    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (!nombreLimpio || !apellidoLimpio || !correoLimpio || !password || !confirmPassword) {
      Alert.alert("Datos incompletos", "Completá todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Contraseña inválida", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const emailRedirectTo = Linking.createURL("verificar-correo");
      const { data, error } = await supabase.auth.signUp({
        email: correoLimpio,
        password,
        options: {
          data: { nombre: nombreLimpio, apellido: apellidoLimpio },
          emailRedirectTo,
        },
      });

      if (error) { Alert.alert("No se pudo registrar", error.message); return; }

      if (data.user && !data.session) {
        Alert.alert("Revisá tu correo", "Tu cuenta fue creada. Confirmá tu correo electrónico para continuar.", [
          { text: "Aceptar", onPress: () => navigation.replace("Login") },
        ]);
        return;
      }

      if (data.session) {
        navigation.replace("Home");
      } else {
        Alert.alert("Registro iniciado", "Revisá tu correo o intentá iniciar sesión.");
      }
    } catch (err) {
      console.error("Error durante el registro:", err);
      Alert.alert("Error de conexión", "No pudimos completar el registro. Intentá nuevamente.");
    }
  };

  return {
    nombre, setNombre,
    apellido, setApellido,
    correo, setCorreo,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    focusedField, setFocusedField,
    handleSignUp,
  };
}
