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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../config/theme";
import { supabase } from "../services/supabase";
import styles, { AUTH_IMAGES } from "../styles/authStyles";

export default function RecuperarPassword({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    const email = correo.trim().toLowerCase();

    // Validar que el campo no esté vacío.
    if (!email) {
      Alert.alert("Correo requerido", "Ingresá tu correo electrónico.");
      return;
    }

    // Validar el formato básico del correo.
    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!formatoValido) {
      Alert.alert("Correo inválido", "Ingresá una dirección de correo válida.");
      return;
    }

    try {
      setLoading(true);

      // URL para volver a la aplicación móvil.
      const redirectTo = "saboresandinos://restablecer-password";

      // Solicitar el correo de recuperación a Supabase Auth.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        console.error("Error al solicitar recuperación:", error.message);
        Alert.alert("No se pudo enviar el correo", error.message);
        return;
      }

      // Informar que la solicitud fue aceptada.
      navigation.navigate("VerificarCorreo", { email });
    } catch (error) {
      console.error("Error inesperado al recuperar contraseña:", error);

      Alert.alert(
        "Error de conexión",
        "No pudimos solicitar el correo. Revisá tu conexión e intentá nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={AUTH_IMAGES.background}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo grande */}
            <Image
              source={AUTH_IMAGES.logo}
              style={styles.logoBig}
              resizeMode="contain"
            />

            <Text style={styles.title}>RECUPERAR CUENTA</Text>

            <Text style={styles.subtitle}>
              Ingresá tu correo electrónico y te enviaremos las instrucciones
              para recuperar tu contraseña
            </Text>

            {/* Campo: Correo */}
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
                  placeholder="nombre@empresa.com"
                  placeholderTextColor={colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  value={correo}
                  onChangeText={setCorreo}
                  onFocus={() => setFocusedField("correo")}
                  onBlur={() => setFocusedField(null)}
                  editable={!loading}
                  returnKeyType="send"
                  onSubmitEditing={handleEnviar}
                />
              </View>
            </View>

            {/* Botón Enviar */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleEnviar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Enviar</Text>
                  <Text style={styles.arrowText}>→</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Footer */}
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
