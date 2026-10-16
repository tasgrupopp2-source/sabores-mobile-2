import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PasswordField from "../components/auth/PasswordField";
import RequisitosSeguridad from "../components/auth/RequisitosSeguridad";
import { supabase } from "../services/supabase";
import styles, { AUTH_IMAGES } from "../styles/authStyles";

const mostrarMensaje = (titulo, mensaje, acciones) => {
  if (Platform.OS === "web") {
    if (acciones?.length) {
      if (window.confirm(`${titulo}\n\n${mensaje}`)) acciones[0].onPress?.();
    } else {
      window.alert(`${titulo}\n\n${mensaje}`);
    }
    return;
  }
  Alert.alert(titulo, mensaje, acciones);
};

export default function NuevaPassword({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleConfirmar = async () => {
    if (loading) return;
    if (!password || !confirmPassword) {
      return mostrarMensaje("Campos obligatorios", "Ingresá y confirmá tu nueva contraseña.");
    }
    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      return mostrarMensaje("Contraseña insegura", "Usá al menos 8 caracteres, una mayúscula y un número.");
    }
    if (password !== confirmPassword) {
      return mostrarMensaje("Las contraseñas no coinciden", "Verificá que ambas contraseñas sean iguales.");
    }

    try {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        mostrarMensaje("Sesión vencida", "La sesión de recuperación no está activa. Volvé a solicitar un código, verificálo y después ingresá la nueva contraseña.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        mostrarMensaje("No se pudo cambiar la contraseña", error.message || "Intentá nuevamente.");
        return;
      }

      const volverAlLogin = async () => {
        try { await supabase.auth.signOut(); } catch (e) { console.error(e); }
        finally { navigation.replace("Login"); }
      };

      mostrarMensaje("Contraseña actualizada", "Tu contraseña se cambió correctamente. Ahora podés iniciar sesión.", [{ text: "Ir al inicio de sesión", onPress: volverAlLogin }]);
    } catch (err) {
      mostrarMensaje("Error", err?.message || "Ocurrió un problema al cambiar la contraseña. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={AUTH_IMAGES.background} style={styles.background} resizeMode="cover">
        <View style={styles.overlay} />
        <KeyboardAvoidingView style={styles.keyboardArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={styles.backTextDark}>{"‹"}</Text>
            </TouchableOpacity>

            <Image source={AUTH_IMAGES.logo} style={styles.logoSmall} resizeMode="contain" />
            <Text style={styles.title}>Agregar contraseña nueva</Text>
            <Text style={styles.subtitle}>Creá una nueva contraseña para proteger tu cuenta de Sabores Andinos.</Text>

            <PasswordField
              label="CONTRASEÑA NUEVA" placeholder="Tu contraseña"
              value={password} onChangeText={setPassword}
              focused={focusedField === "password"} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
              visible={showPassword} onToggleVisibility={() => setShowPassword((a) => !a)}
              editable={!loading} eyeDisabled={loading}
              eyeAccessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              autoCapitalize="none" autoCorrect={false} autoComplete="new-password" textContentType="newPassword"
            />

            <RequisitosSeguridad password={password} />

            <PasswordField
              label="CONFIRMAR CONTRASEÑA NUEVA" placeholder="Repetí tu contraseña"
              value={confirmPassword} onChangeText={setConfirmPassword}
              focused={focusedField === "confirm"} onFocus={() => setFocusedField("confirm")} onBlur={() => setFocusedField(null)}
              visible={showConfirm} onToggleVisibility={() => setShowConfirm((a) => !a)}
              editable={!loading} eyeDisabled={loading}
              eyeAccessibilityLabel={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
              autoCapitalize="none" autoCorrect={false} autoComplete="new-password" textContentType="newPassword"
            />

            <TouchableOpacity style={[styles.primaryButton, loading && styles.buttonLoading]} activeOpacity={0.8} onPress={handleConfirmar} disabled={loading} accessibilityRole="button">
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.primaryButtonText}>Confirmar Contraseña</Text>
                  <Text style={styles.arrowText}>→</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={loading}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Image source={AUTH_IMAGES.logo} style={styles.footerLogo} />
              <Text style={styles.footerText}>SABOR ANDINO SECURE AUTHENTICATION</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
