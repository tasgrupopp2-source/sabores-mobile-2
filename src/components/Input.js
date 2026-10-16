import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

import { colors } from "../config/theme";

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  leftIcon,
  secureTextEntry = false,
  editable = true,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  accessibilityLabel,
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.black,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 10,
          backgroundColor: editable ? colors.white : "#F0EDE6",
          paddingHorizontal: 12,
          height: 48,
        }}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.gray}
            style={{ marginRight: 8 }}
          />
        ) : null}

        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.black,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          secureTextEntry={secureTextEntry}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          accessibilityLabel={accessibilityLabel || label}
        />
      </View>
    </View>
  );
}
