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
import useSignUp from "../hooks/useSignUp";
import styles, { AUTH_IMAGES } from "../styles/authStyles";

export default function SignUp({ navigation }) {
  const {
    nombre, setNombre,
    apellido, setApellido,
    correo, setCorreo,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    focusedField, setFocusedField,
    handleSignUp,
  } = useSignUp(navigation);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={AUTH_IMAGES.background} style={styles.background} resizeMode="cover">
        <View style={styles.overlay} />
        <KeyboardAvoidingView style={styles.keyboardArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backTextDark}>{"‹"}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Únete a Sabores Andinos</Text>
            <Text style={styles.subtitle}>Gestioná tus especias con excelencia.</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>NOMBRE</Text>
              <View style={[styles.inputWrapper, focusedField === "nombre" && styles.inputWrapperFocused]}>
                <Image source={AUTH_IMAGES.usuario} style={[styles.inputIcon, focusedField === "nombre" && styles.inputIconFocused]} />
                <TextInput style={styles.input} placeholder="Ej. Juan" placeholderTextColor={colors.gray} value={nombre} onChangeText={setNombre} onFocus={() => setFocusedField("nombre")} onBlur={() => setFocusedField(null)} />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>APELLIDO</Text>
              <View style={[styles.inputWrapper, focusedField === "apellido" && styles.inputWrapperFocused]}>
                <Image source={AUTH_IMAGES.usuario} style={[styles.inputIcon, focusedField === "apellido" && styles.inputIconFocused]} />
                <TextInput style={styles.input} placeholder="Ej. Pérez" placeholderTextColor={colors.gray} value={apellido} onChangeText={setApellido} onFocus={() => setFocusedField("apellido")} onBlur={() => setFocusedField(null)} />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CORREO ELECTRÓNICO</Text>
              <View style={[styles.inputWrapper, focusedField === "correo" && styles.inputWrapperFocused]}>
                <Image source={AUTH_IMAGES.correo} style={[styles.inputIcon, focusedField === "correo" && styles.inputIconFocused]} />
                <TextInput style={styles.input} placeholder="usuario@saborandino.com" placeholderTextColor={colors.gray} keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} onFocus={() => setFocusedField("correo")} onBlur={() => setFocusedField(null)} />
              </View>
            </View>

            <PasswordField label="CONTRASEÑA" placeholder="Tu contraseña" value={password} onChangeText={setPassword} focused={focusedField === "password"} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} visible={showPassword} onToggleVisibility={() => setShowPassword(!showPassword)} eyeAccessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} />

            <PasswordField label="CONFIRMAR CONTRASEÑA" placeholder="Repetí tu contraseña" value={confirmPassword} onChangeText={setConfirmPassword} focused={focusedField === "confirm"} onFocus={() => setFocusedField("confirm")} onBlur={() => setFocusedField(null)} visible={showConfirm} onToggleVisibility={() => setShowConfirm(!showConfirm)} eyeAccessibilityLabel={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"} />

            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleSignUp}>
              <Text style={styles.primaryButtonText}>Registrarse</Text>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>

            <View style={styles.linkRow}>
              <Text style={styles.linkText}>¿Ya tenés una cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkHighlight}>Inicia Sesión</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.legalText, styles.legalTextGray]}>AL REGISTRARTE ACEPTÁS NUESTROS TÉRMINOS Y CONDICIONES</Text>

            <View style={styles.footer}>
              <Image source={AUTH_IMAGES.logo} style={styles.footerLogo} />
              <Text style={styles.footerText}>© 2026 SABORES ANDINOS S.R.L.</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
