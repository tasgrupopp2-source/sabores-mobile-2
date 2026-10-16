import { Text, View } from "react-native";

import styles from "../../styles/authStyles";

export default function RequisitosSeguridad({ password }) {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <View style={[styles.reqBox, styles.securityBox]}>
      <Text style={[styles.reqTitle, styles.securityTitle]}>
        REQUISITOS DE SEGURIDAD
      </Text>
      <Text style={[styles.reqItem, styles.securityItem, hasMinLength && styles.reqItemValid]}>
        • Al menos 8 caracteres
      </Text>
      <Text style={[styles.reqItem, styles.securityItem, hasUpperCase && styles.reqItemValid]}>
        • Una letra mayúscula
      </Text>
      <Text style={[styles.reqItem, styles.securityItem, hasNumber && styles.reqItemValid]}>
        • Un número
      </Text>
    </View>
  );
}
