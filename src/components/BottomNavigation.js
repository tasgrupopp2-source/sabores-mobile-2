import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "../config/theme";
import styles from "../styles/bottomNavigationStyles";

const TABS = [
  {
    route: "Home",
    label: "Inicio",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    route: "GestionProductos",
    label: "Productos",
    icon: "cube-outline",
    activeIcon: "cube",
  },
  {
    route: "Perfil",
    label: "Perfil",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export default function BottomNavigation({ navigation, activeRoute }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab.route === activeRoute;

        return (
          <Pressable
            key={tab.route}
            onPress={() => {
              if (!isActive) {
                navigation.navigate(tab.route);
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={26}
              color={isActive ? colors.mountainBlue : "#84909B"}
            />

            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
