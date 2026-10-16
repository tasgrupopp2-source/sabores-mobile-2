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
import useCodigoOtp from "../hooks/useCodigoOtp";
import styles, { AUTH_IMAGES } from "../styles/authStyles";

export default function VerificarCorreo({ navigation, route }) {
  const email = route?.params?.email || "";
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  const {
    code, focusedIndex, setFocusedIndex, timer,
    inputRefs, handleChange, handleKeyPress, resetCode, CODE_LENGTH,
  } = useCodigoOtp();

  const handleVerificar = async () => {
    const token = code.join("").trim();
    if (!email.trim()) {
      Alert.alert("Correo faltante", "Volvé a la pantalla anterior e ingresá tu correo electrónico.");
      return;
    }
    if (token.length !== CODE_LENGTH) {
      Alert.alert("Código incompleto", "Ingresá los seis dígitos que recibiste por correo.");
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({ email: email.trim(), token, type: "recovery" });
      if (error) {
        Alert.alert("No se pudo verificar", error.message || "El código es incorrecto o venció. Solicitá uno nuevo.");
        return;
      }
      if (!data?.session) {
        Alert.alert("No se inició la recuperación", "No se obtuvo una sesión de recuperación. Solicitá un código nuevo e intentá nuevamente.");
        return;
      }
      navigation.navigate("NuevaPassword", { email: email.trim() });
    } catch (err) {
      Alert.alert("Error de conexión", err?.message || "No pudimos verificar el código. Comprobá tu conexión e intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      Alert.alert("Correo faltante", "Volvé a ingresar tu correo electrónico.");
      return;
    }
    try {
      setReenviando(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: "saboresandinos://restablecer-password" });
      if (error) { Alert.alert("No se pudo reenviar", error.message); return; }
      resetCode();
      Alert.alert("Código enviado", "Revisá tu correo electrónico y la carpeta de spam. Usá el código más reciente.");
    } catch (err) {
      Alert.alert("Error", err?.message || "No pudimos enviar el correo. Intentá nuevamente.");
    } finally {
      setReenviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground source={AUTH_IMAGES.background} style={styles.background} resizeMode="cover">
        <View style={styles.overlay} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading || reenviando}>
              <Text style={styles.backTextDark}>{"‹"}</Text>
            </TouchableOpacity>

            <Image source={AUTH_IMAGES.logo} style={styles.logoSmall} resizeMode="contain" />
            <Text style={styles.title}>Verificá tu correo</Text>
            <Text style={styles.subtitle}>
              Enviamos un código de 6 dígitos a{"\n"}
              <Text style={styles.emailHighlight}>{email || "tu correo electrónico"}</Text>
            </Text>

            <View style={styles.codeRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={`code-${index}`}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[styles.codeInput, focusedIndex === index && styles.codeInputFocused]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  editable={!loading && !reenviando}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.7 }]} activeOpacity={0.8} onPress={handleVerificar} disabled={loading || reenviando}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.primaryButtonText}>Verificar código</Text>
                  <Text style={styles.arrowText}>→</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.timerText}>¿No recibiste el código?</Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>Podés reenviar en <Text style={styles.timerBold}>{timer}s</Text></Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={reenviando || loading}>
                {reenviando ? <ActivityIndicator color={colors.mountainBlue} /> : (
                  <Text style={[styles.timerText, { color: colors.mountainBlue }]}>Reenviar código</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate("RecuperarPassword")} disabled={loading || reenviando}>
              <Text style={[styles.timerText, { color: colors.mountainBlue, marginTop: 10 }]}>Cambiar correo electrónico</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Image source={AUTH_IMAGES.logo} style={styles.footerLogo} />
              <Text style={styles.footerText}>SABORES ANDINOS S.R.L.</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
