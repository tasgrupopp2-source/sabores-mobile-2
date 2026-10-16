import { useEffect, useRef, useState } from "react";
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

// Configuración del código de recuperación
const CODE_LENGTH = 6;
const RESEND_SECONDS = 50;

export default function VerificarCorreo({ navigation, route }) {
  const email = route?.params?.email || "";

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  const inputRefs = useRef([]);

  // Cuenta regresiva para reenviar el código
  useEffect(() => {
    if (timer <= 0) return;

    const id = setTimeout(() => {
      setTimer((actual) => actual - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [timer]);

  // Guarda los números y avanza al siguiente campo
  const handleChange = (text, index) => {
    const numeros = text.replace(/\D/g, "");
    const nuevoCodigo = [...code];

    // Permite pegar un código completo
    if (numeros.length > 1) {
      const digitos = numeros.slice(0, CODE_LENGTH).split("");

      digitos.forEach((digito, i) => {
        nuevoCodigo[i] = digito;
      });

      setCode(nuevoCodigo);

      const siguienteIndice = Math.min(digitos.length, CODE_LENGTH - 1);

      inputRefs.current[siguienteIndice]?.focus();
      return;
    }

    nuevoCodigo[index] = numeros;
    setCode(nuevoCodigo);

    if (numeros && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Permite volver al campo anterior con retroceso
  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verifica el código de recuperación con Supabase
  const handleVerificar = async () => {
    const token = code.join("").trim();

    if (!email.trim()) {
      Alert.alert(
        "Correo faltante",
        "Volvé a la pantalla anterior e ingresá tu correo electrónico.",
      );
      return;
    }

    if (token.length !== CODE_LENGTH) {
      Alert.alert(
        "Código incompleto",
        "Ingresá los seis dígitos que recibiste por correo.",
      );
      return;
    }

    try {
      setLoading(true);

      // Verifica el OTP de recuperación.
      // No se debe volver a llamar a resetPasswordForEmail aquí.
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "recovery",
      });

      if (error) {
        Alert.alert(
          "No se pudo verificar",
          error.message ||
            "El código es incorrecto o venció. Solicitá uno nuevo.",
        );
        return;
      }

      // Se necesita una sesión para cambiar la contraseña.
      if (!data?.session) {
        Alert.alert(
          "No se inició la recuperación",
          "No se obtuvo una sesión de recuperación. Solicitá un código nuevo e intentá nuevamente.",
        );
        return;
      }

      // Abre la pantalla para crear una nueva contraseña
      navigation.navigate("NuevaPassword", { email: email.trim() });
    } catch (error) {
      Alert.alert(
        "Error de conexión",
        error?.message ||
          "No pudimos verificar el código. Comprobá tu conexión e intentá nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Solicita un nuevo código de recuperación
  const handleResend = async () => {
    if (!email.trim()) {
      Alert.alert("Correo faltante", "Volvé a ingresar tu correo electrónico.");
      return;
    }

    try {
      setReenviando(true);

      const redirectTo = "saboresandinos://restablecer-password";

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo },
      );

      if (error) {
        Alert.alert("No se pudo reenviar", error.message);
        return;
      }

      setCode(Array(CODE_LENGTH).fill(""));
      setTimer(RESEND_SECONDS);

      Alert.alert(
        "Código enviado",
        "Revisá tu correo electrónico y la carpeta de spam. Usá el código más reciente.",
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error?.message || "No pudimos enviar el correo. Intentá nuevamente.",
      );
    } finally {
      setReenviando(false);
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
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Botón para volver */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading || reenviando}
            >
              <Text style={styles.backTextDark}>{"‹"}</Text>
            </TouchableOpacity>

            {/* Logo */}
            <Image
              source={AUTH_IMAGES.logo}
              style={styles.logoSmall}
              resizeMode="contain"
            />

            <Text style={styles.title}>Verificá tu correo</Text>

            <Text style={styles.subtitle}>
              Enviamos un código de 6 dígitos a{"\n"}
              <Text style={styles.emailHighlight}>
                {email || "tu correo electrónico"}
              </Text>
            </Text>

            {/* Campos para ingresar el código */}
            <View style={styles.codeRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={`code-${index}`}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    focusedIndex === index && styles.codeInputFocused,
                  ]}
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

            {/* Botón para verificar el código */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={handleVerificar}
              disabled={loading || reenviando}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Verificar código</Text>
                  <Text style={styles.arrowText}>→</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Reenvío del código */}
            <Text style={styles.timerText}>¿No recibiste el código?</Text>

            {timer > 0 ? (
              <Text style={styles.timerText}>
                Podés reenviar en <Text style={styles.timerBold}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResend}
                disabled={reenviando || loading}
              >
                {reenviando ? (
                  <ActivityIndicator color={colors.mountainBlue} />
                ) : (
                  <Text
                    style={[styles.timerText, { color: colors.mountainBlue }]}
                  >
                    Reenviar código
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {/* Permite cambiar el correo */}
            <TouchableOpacity
              onPress={() => navigation.navigate("RecuperarPassword")}
              disabled={loading || reenviando}
            >
              <Text
                style={[
                  styles.timerText,
                  {
                    color: colors.mountainBlue,
                    marginTop: 10,
                  },
                ]}
              >
                Cambiar correo electrónico
              </Text>
            </TouchableOpacity>

            {/* Pie de pantalla */}
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
