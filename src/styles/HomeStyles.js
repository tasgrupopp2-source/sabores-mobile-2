
/**
 * Estilos de la pantalla principal de Sabores Andinos Mobile.
 */

// Importamos StyleSheet para organizar los estilos.
import { StyleSheet } from "react-native";

// Importamos los colores generales de la aplicación.
import { colors } from "../config/theme";

// Definimos los estilos de Home.
const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contenido: {
    paddingBottom: 30,
  },

  buscador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    margin: 16,
    marginBottom: 0,
    padding: 10,
    borderRadius: 10,
  },

  inputBuscador: {
    flex: 1,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    margin: 16,
  },

  banner: {
    height: 150,
    padding: 12,
    justifyContent: "space-between",
  },

  campana: {
    alignSelf: "flex-end",
  },

  etiqueta: {
    alignSelf: "flex-start",
    backgroundColor: colors.sunriseRed,
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },

  subtitulo: {
    fontSize: 17,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  fila: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
  },

  cajaNaranja: {
    flex: 1,
    backgroundColor: "#FDEEE4",
    padding: 12,
    borderRadius: 12,
  },

  cajaLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.sunriseRed,
  },

  cajaNumero: {
    fontSize: 26,
    fontWeight: "bold",
  },

  alerta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FCE8E3",
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: 12,
  },

  contenidoAlerta: {
    flex: 1,
  },

  botonBlanco: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  grilla: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    rowGap: 12,
  },

  boton: {
    width: "48%",
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 24,
    borderRadius: 12,
    gap: 8,
  },

  botonTexto: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  promo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sunriseRed,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
  },

  contenidoPromo: {
    flex: 1,
  },

  promoTitulo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  textoPromo: {
    color: "white",
  },

  carrusel: {
    paddingLeft: 16,
  },

  producto: {
    width: 130,
    backgroundColor: "white",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
  },

  foto: {
    height: 110,
    backgroundColor: colors.lightGray,
  },

  imagen: {
    width: "100%",
    height: "100%",
  },

  productoNombre: {
    fontSize: 11,
    fontWeight: "bold",
    marginHorizontal: 8,
    marginTop: 6,
    marginBottom: 8,
  },

  etiquetaNuevo: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: colors.andeanGold,
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
});

// Exportamos los estilos para que Home.js pueda importarlos.
export default styles;
