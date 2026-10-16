import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Linking from "expo-linking";

import PasswordField from "../components/auth/PasswordField";
import { colors } from "../config/theme";
import { supabase } from "../services/supabase";
import styles, { AUTH_IMAGES } from "../styles/authStyles";

export default function SignUp({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Registra al usuario en Supabase y valida los datos del formulario.
  const handleSignUp = async () => {
    // Eliminamos espacios innecesarios de los campos de texto.
    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const correoLimpio = correo.trim().toLowerCase();

    // Comprobamos que todos los campos estén completos.
    if (
      !nombreLimpio ||
      !apellidoLimpio ||
      !correoLimpio ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Datos incompletos", "Completá todos los campos.");
      return;
    }

    // Verificamos que las contraseñas coincidan.
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    // Comprobamos que la contraseña tenga al menos seis caracteres.
    if (password.length < 6) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }

    try {
      // Creamos la cuenta utilizando el sistema de autenticación de Supabase.

      const emailRedirectTo = Linking.createURL("verificar-correo");
      const { data, error } = await supabase.auth.signUp({
        email: correoLimpio,
        password,
        options: {
          // Indicamos a dónde debe volver el usuario después de confirmar su correo.
          emailRedirectTo: "saboresandinos://",

          // Guardamos el nombre y el apellido como metadatos del usuario.
          data: {
            nombre: nombreLimpio,
            apellido: apellidoLimpio,
          },
          // Indicamos la URL de retorno después de confirmar el correo.
          emailRedirectTo: emailRedirectTo,
        },
      });

      // Mostramos el error si Supabase rechaza el registro.
      if (error) {
        Alert.alert("No se pudo registrar", error.message);
        return;
      }

      // Si se requiere confirmar el correo, indicamos el siguiente paso.
      if (data.user && !data.session) {
        Alert.alert(
          "Revisá tu correo",
          "Tu cuenta fue creada. Confirmá tu correo electrónico para continuar.",
          [
            {
              text: "Aceptar",
              onPress: () => navigation.replace("Login"),
            },
          ],
        );
        return;
      }

      // Si el registro inició una sesión, entramos a la pantalla principal.
      if (data.session) {
        navigation.replace("Home");
      } else {
        // Si no hay sesión ni usuario confirmado, no damos por terminado el acceso.
        Alert.alert(
          "Registro iniciado",
          "Revisá tu correo o intentá iniciar sesión.",
        );
      }
    } catch (error) {
      // Capturamos errores inesperados de conexión.
      console.error("Error durante el registro:", error);

      Alert.alert(
        "Error de conexión",
        "No pudimos completar el registro. Intentá nuevamente.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <ImageBackground
        source={AUTH_IMAGES.background}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backTextDark}>{"‹"}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Únete a Sabores Andinos</Text>
            <Text style={styles.subtitle}>
              Gestioná tus especias con excelencia.
            </Text>

            {/* ── Nombre ──────────────────────────────────── */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>NOMBRE</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "nombre" && styles.inputWrapperFocused,
                ]}
              >
                <Image
                  source={AUTH_IMAGES.usuario}
                  style={[
                    styles.inputIcon,
                    focusedField === "nombre" && styles.inputIconFocused,
                  ]}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Juan"
                  placeholderTextColor={colors.gray}
                  value={nombre}
                  onChangeText={setNombre}
                  onFocus={() => setFocusedField("nombre")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* ── Apellido ────────────────────────────────── */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>APELLIDO</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "apellido" && styles.inputWrapperFocused,
                ]}
              >
                <Image
                  source={AUTH_IMAGES.usuario}
                  style={[
                    styles.inputIcon,
                    focusedField === "apellido" && styles.inputIconFocused,
                  ]}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Pérez"
                  placeholderTextColor={colors.gray}
                  value={apellido}
                  onChangeText={setApellido}
                  onFocus={() => setFocusedField("apellido")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* ── Correo ──────────────────────────────────── */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "correo" && styles.inputWrapperFocused,
                ]}
              >
                <Image
                  source={AUTH_IMAGES.correo}
                  style={[
                    styles.inputIcon,
                    focusedField === "correo" && styles.inputIconFocused,
                  ]}
                />
                <TextInput
                  style={styles.input}
                  placeholder="usuario@saborandino.com"
                  placeholderTextColor={colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={correo}
                  onChangeText={setCorreo}
                  onFocus={() => setFocusedField("correo")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* ── Contraseña ──────────────────────────────── */}
            <PasswordField
              label="CONTRASEÑA"
              placeholder="Tu contraseña"
              value={password}
              onChangeText={setPassword}
              focused={focusedField === "password"}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              visible={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
              eyeAccessibilityLabel={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            />

            {/* ── Confirmar Contraseña ─────────────────────── */}
            <PasswordField
              label="CONFIRMAR CONTRASEÑA"
              placeholder="Repetí tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              focused={focusedField === "confirm"}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              visible={showConfirm}
              onToggleVisibility={() => setShowConfirm(!showConfirm)}
              eyeAccessibilityLabel={
                showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            />

            {/* ── Botón Registrarse ────────────────────────── */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleSignUp}
            >
              <Text style={styles.primaryButtonText}>Registrarse</Text>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>

            {/* ── Link a Login ─────────────────────────────── */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>¿Ya tenés una cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkHighlight}>Inicia Sesión</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.legalText, styles.legalTextGray]}>
              AL REGISTRARTE ACEPTÁS NUESTROS TÉRMINOS Y CONDICIONES
            </Text>

            <View style={styles.footer}>
              <Image source={AUTH_IMAGES.logo} style={styles.footerLogo} />
              <Text style={styles.footerText}>
                © 2026 SABORES ANDINOS S.R.L.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
