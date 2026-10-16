import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../config/theme";

export default function Button({
  title,
  onPress,
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled = false,
}) {
  const outline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        outline ? styles.outline : styles.primary,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.mountainBlue : "#FFFFFF"} />
      ) : (
        <Text
          style={[
            styles.text,
            outline ? styles.outlineText : styles.primaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.mountainBlue,
    borderColor: colors.mountainBlue,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: colors.mountainBlue,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: colors.mountainBlue,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.8,
  },
});
