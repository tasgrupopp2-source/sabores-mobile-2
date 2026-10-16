import { useState } from "react";
import {
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

import PasswordField from "../components/auth/PasswordField";
import { colors } from "../config/theme";
import { supabase } from "../services/supabase";
import styles, { LOGIN_IMAGES } from "../styles/loginStyles";

// devuelve el saludo y una frase segun la hora del celuS
const obtenerSaludo = () => {
  const hora = new Date().getHours(); // 0 a 23

  if (hora >= 6 && hora < 12) {
    return { titulo: "¡Buenos días!", frase: "Nos alegra tenerte acá. Ingresá a tu cuenta para continuar." };
  } else if (hora >= 12 && hora < 20) {
    return { titulo: "¡Buenas tardes!", frase: "Seguí disfrutando de los sabores auténticos de nuestra tierra." };
  } else {
    return { titulo: "¡Buenas noches!", frase: "Todo lo natural de nuestra tierra, a un paso de vos." };
  }
};

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Ingresá tu correo y contraseña.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      alert("No se pudo iniciar sesión: " + error.message);
      return;
    }

    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <ImageBackground
        source={LOGIN_IMAGES.background}
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
            {/* ── Logo ─────────────────────────────────────── */}
            <View style={styles.logoContainer}>
              <Image
                source={LOGIN_IMAGES.logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* saludo segun la hora */}
            <Text style={styles.title}>{obtenerSaludo().titulo}</Text>
            <Text style={styles.subtitle}>{obtenerSaludo().frase}</Text>

            {/* ── Campo: Correo ─────────────────────────────── */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "email" && styles.inputWrapperFocused,
                ]}
              >
                <Image
                  source={LOGIN_IMAGES.correo}
                  style={[
                    styles.inputIcon,
                    focusedField === "email" && styles.inputIconFocused,
                  ]}
                />
                <TextInput
                  style={styles.input}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colors.gray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* ── Campo: Contraseña ─────────────────────────── */}
            <PasswordField
              label="Contraseña"
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

            {/* ── Olvidé contraseña ──────────────────────────── */}
            <View style={styles.forgotRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("RecuperarPassword")}
              >
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            {/* ── Botón Ingresar ─────────────────────────────── */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>INGRESAR</Text>
            </TouchableOpacity>

            {/* ── Link a Registro ─────────────────────────────── */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿No tenés cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.registerLink}>Registrate</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}