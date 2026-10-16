import { Image, Text, TextInput, View } from "react-native";

import { colors } from "../../config/theme";
import styles, { AUTH_IMAGES } from "../../styles/authStyles";
import PasswordEye from "./PasswordEye";

export default function PasswordField({
  label,
  placeholder,
  value,
  onChangeText,
  focused,
  onFocus,
  onBlur,
  visible,
  onToggleVisibility,
  editable = true,
  eyeDisabled = false,
  eyeAccessibilityLabel,
  autoCapitalize,
  autoCorrect,
  autoComplete,
  textContentType,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
        <Image
          source={AUTH_IMAGES.candado}
          style={[styles.inputIcon, focused && styles.inputIconFocused]}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          textContentType={textContentType}
          editable={editable}
        />
        <PasswordEye
          visible={visible}
          onPress={onToggleVisibility}
          disabled={eyeDisabled}
          accessibilityLabel={eyeAccessibilityLabel}
        />
      </View>
    </View>
  );
}
