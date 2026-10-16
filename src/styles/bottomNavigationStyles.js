import { StyleSheet } from "react-native";
import { colors, fonts } from "../config/theme";

/**
 
Estilos separados para la barra de navegación inferior.*/
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightGray,
    paddingTop: 5,
    minHeight: 58,
    width: "100%",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
    minHeight: 54,
  },

  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: "#5F6368",
  },

  activeLabel: {
    fontFamily: fonts.bodySemiBold,
    color: colors.sunriseRed,
  },

  pressed: {
    opacity: 0.65,
  },
});

// Colores disponibles para los iconos vectoriales.
styles.activeColor = colors.sunriseRed;
styles.inactiveColor = "#5F6368";

export default styles;