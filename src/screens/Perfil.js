import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNavigation from "../components/BottomNavigation";
import Button from "../components/Button";
import Input from "../components/Input";
import PerfilSeguridad from "../components/perfil/PerfilSeguridad";
import { colors } from "../config/theme";
import usePerfil from "../hooks/usePerfil";
import styles from "../styles/perfilStyles";

export default function Perfil({ navigation }) {
  const insets = useSafeAreaInsets();
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);

  const {
    perfil, correo, setCorreo, cargando, guardando, cerrandoSesion,
    error, mensaje, cargarPerfil, guardarCorreo,
    nuevaContrasena, setNuevaContrasena,
    confirmarContrasena, setConfirmarContrasena,
    guardandoContrasena, guardarContrasena, salir,
  } = usePerfil(navigation);

  const handleGuardar = async () => {
    setConfirmacionVisible(false);
    const resultado = await guardarCorreo();
    if (resultado) setConfirmacionVisible(true);
  };

  const handleCerrarSesion = () => {
    Alert.alert("Cerrar sesión", "¿Querés salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: salir },
    ]);
  };

  if (cargando && !perfil) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={colors.mountainBlue} />
          <Text style={styles.stateText}>Cargando los datos de tu cuenta...</Text>
        </View>
        <BottomNavigation navigation={navigation} activeRoute="Perfil" />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={44} color={colors.error} />
          <Text style={styles.sectionTitle}>No pudimos cargar tu perfil</Text>
          <Text style={styles.stateText}>{error || "Ocurrió un problema al consultar tu cuenta."}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Intentar nuevamente" onPress={cargarPerfil} variant="primary" fullWidth />
            <Button title="Cerrar sesión" onPress={handleCerrarSesion} variant="outline" fullWidth loading={cerrandoSesion} disabled={cerrandoSesion} />
          </View>
        </View>
        <BottomNavigation navigation={navigation} activeRoute="Perfil" />
      </View>
    );
  }

  const nombreCompleto = [perfil.nombre, perfil.apellido].filter(Boolean).join(" ");
  const iniciales = nombreCompleto
    ? nombreCompleto.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Mi perfil</Text>
            <Text style={styles.subtitle}>Administrá la información de tu cuenta.</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{iniciales}</Text>
              </View>
              <Text style={styles.profileName}>{nombreCompleto || "Usuario de Sabores Andinos"}</Text>
              <Text style={styles.profileEmail}>{perfil.correo || "Sin correo registrado"}</Text>
              <View style={styles.statusBadge}>
                <Ionicons name="shield-checkmark-outline" size={15} color={colors.mountainBlue} />
                <Text style={styles.statusText}>Cuenta autenticada</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Información del trabajador</Text>
            {perfil.trabajadorVinculado ? (
              <View style={styles.workerInfo}>
                <View style={styles.workerRow}>
                  <Text style={styles.workerLabel}>Nombre</Text>
                  <Text style={styles.workerValue}>{nombreCompleto || "No informado"}</Text>
                </View>
                <View style={styles.workerRow}>
                  <Text style={styles.workerLabel}>Puesto</Text>
                  <Text style={styles.workerValue}>{perfil.puesto || "No informado"}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.notice}>
                <Ionicons name="information-circle-outline" size={20} color={colors.mountainBlue} />
                <Text style={styles.noticeText}>
                  Esta cuenta todavía no está vinculada a un trabajador. Podés continuar utilizando la aplicación en el modo de desarrollo del equipo.
                </Text>
              </View>
            )}

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Datos de la cuenta</Text>
            <Text style={styles.sectionDescription}>
              Podés solicitar un cambio de correo. Según la configuración del proyecto, será necesario confirmar el cambio por email.
            </Text>

            {error ? <Text accessibilityRole="alert" style={[styles.message, styles.errorMessage]}>{error}</Text> : null}
            {confirmacionVisible && mensaje ? <Text accessibilityRole="alert" style={[styles.message, styles.successMessage]}>{mensaje}</Text> : null}

            <Input
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail-outline"
              editable={!guardando}
              accessibilityLabel="Correo electrónico de la cuenta"
            />

            <View style={styles.buttonContainer}>
              <Button title="Guardar cambios" onPress={handleGuardar} variant="primary" fullWidth loading={guardando} disabled={guardando || cerrandoSesion} />
              <Button title="Cerrar sesión" onPress={handleCerrarSesion} variant="outline" fullWidth loading={cerrandoSesion} disabled={cerrandoSesion || guardando} />
            </View>

            <PerfilSeguridad
              nuevaContrasena={nuevaContrasena}
              setNuevaContrasena={setNuevaContrasena}
              confirmarContrasena={confirmarContrasena}
              setConfirmarContrasena={setConfirmarContrasena}
              guardandoContrasena={guardandoContrasena}
              guardarContrasena={guardarContrasena}
              guardando={guardando}
              cerrandoSesion={cerrandoSesion}
            />

            <Text style={styles.footerText}>Sabores Andinos · Perfil de usuario</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavigation navigation={navigation} activeRoute="Perfil" />
    </View>
  );
}
