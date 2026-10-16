import { StyleSheet } from "react-native";

// Colores y tarjetas inspirados en Sabores Andinos.
const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F4F0E6",
  },

  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  botonVolver: {
    width: 40,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 8,
  },
  tituloEncabezado: {
    flex: 1,
    color: "#171717",
    fontSize: 25,
    fontWeight: "700",
  },
  introduccion: {
    paddingHorizontal: 28,
    paddingTop: 6,
    paddingBottom: 14,
  },
  subtituloEncabezado: {
    color: "#777777",
    fontSize: 18,
    fontWeight: "500",
  },
  textoIntroduccion: {
    color: "#888888",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },

  // Buscador redondeado.
  buscador: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginHorizontal: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ECE7DE",
  },
  inputBuscador: {
    flex: 1,
    fontSize: 15,
    color: "#222222",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  resumen: {
    paddingHorizontal: 28,
    paddingBottom: 12,
  },
  textoResumen: {
    color: "#777777",
    fontSize: 15,
    fontWeight: "500",
  },

  // Tarjetas blancas con imagen a la izquierda.
  lista: {
    paddingHorizontal: 15,
    paddingTop: 2,
    paddingBottom: 25,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 21,
    marginBottom: 18,
    padding: 13,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  filaProducto: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  contenedorImagen: {
    width: 112,
    height: 125,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F0E6D5",
    marginRight: 14,
  },
  imagenProducto: {
    width: "100%",
    height: "100%",
  },
  imagenAlternativa: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Etiqueta de últimas unidades.
  etiquetaImagen: {
    position: "absolute",
    top: 6,
    left: 5,
    backgroundColor: "#F7B733",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  textoEtiquetaImagen: {
    color: "#24180D",
    fontSize: 11,
    fontWeight: "700",
  },

  datosProducto: {
    flex: 1,
    paddingTop: 2,
  },
  nombreProducto: {
    color: "#171717",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 5,
  },
  descripcion: {
    color: "#858585",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 5,
  },
  categoria: {
    color: "#888888",
    fontSize: 12,
    marginBottom: 4,
  },
  presentacion: {
    color: "#252525",
    fontSize: 13,
    marginTop: 3,
  },
  precio: {
    color: "#D96F2B",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 7,
  },
  filaStock: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },
  textoStock: {
    color: "#B85D24",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
    flexShrink: 1,
  },

  // Estados de carga, error y lista vacía.
  estado: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 35,
  },
  textoEstado: {
    color: "#777777",
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  botonReintentar: {
    backgroundColor: "#D96F2B",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 18,
  },
  textoBotonReintentar: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default styles;
