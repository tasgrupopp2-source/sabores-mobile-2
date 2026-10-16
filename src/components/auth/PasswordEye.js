import { Image, TouchableOpacity, View } from "react-native";

import styles from "../../styles/authStyles";

export default function PasswordEye({ visible, onPress, disabled = false, accessibilityLabel }) {
  return (
    <TouchableOpacity
      style={styles.eyeButton}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.passwordEyeContainer}>
        <Image source={require("../../../assets/Login/ic_ojo_512.png")} style={styles.eyeIcon} />
        {!visible && <View style={styles.passwordEyeSlash} />}
      </View>
    </TouchableOpacity>
  );
}
