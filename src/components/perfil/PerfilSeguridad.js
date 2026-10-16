import { useState } from "react";
import { Text, View } from "react-native";

import Button from "../Button";
import Input from "../Input";
import styles from "../../styles/perfilStyles";

export default function PerfilSeguridad({
  nuevaContrasena,
  setNuevaContrasena,
  confirmarContrasena,
  setConfirmarContrasena,
  guardandoContrasena,
  guardarContrasena,
  guardando,
  cerrandoSesion,
}) {
  const [visible, setVisible] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");

  const handleGuardar = async () => {
    setErrorLocal("");
    if (nuevaContrasena.length < 8) {
      setErrorLocal("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setErrorLocal("Las contraseñas no coinciden. Verificá ambos campos.");
      return;
    }
    const actualizado = await guardarContrasena();
    if (actualizado) setVisible(false);
  };

  return (
    <View style={styles.securitySection}>
      <Button
        title={visible ? "Ocultar seguridad" : "Cambiar contraseña"}
        onPress={() => {
          setVisible((actual) => {
            if (actual) {
              setNuevaContrasena("");
              setConfirmarContrasena("");
              setErrorLocal("");
            }
            return !actual;
          });
        }}
        variant="outline"
        fullWidth
      />

      {errorLocal ? (
        <Text accessibilityRole="alert" style={[styles.message, styles.errorMessage]}>
          {errorLocal}
        </Text>
      ) : null}

      {visible ? (
        <View style={styles.securityContent}>
          <Text style={styles.sectionTitle}>Seguridad de la cuenta</Text>
          <Text style={styles.sectionDescription}>
            La contraseña debe tener al menos 8 caracteres.
          </Text>
          <Input
            label="Nueva contraseña"
            value={nuevaContrasena}
            onChangeText={setNuevaContrasena}
            placeholder="Ingresá la nueva contraseña"
            secureTextEntry
            editable={!guardandoContrasena}
          />
          <Input
            label="Confirmar contraseña"
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
            placeholder="Repetí la nueva contraseña"
            secureTextEntry
            editable={!guardandoContrasena}
          />
          <Button
            title="Actualizar contraseña"
            onPress={handleGuardar}
            variant="primary"
            fullWidth
            loading={guardandoContrasena}
            disabled={guardandoContrasena || guardando || cerrandoSesion}
          />
        </View>
      ) : null}
    </View>
  );
}
