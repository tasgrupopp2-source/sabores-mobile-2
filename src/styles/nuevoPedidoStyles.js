import { StyleSheet } from "react-native";

const NARANJA = "#F15A29";

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "#FFF9F3" },
  pantallaCarga: { flex: 1, justifyContent: "center", backgroundColor: "#FFF9F3" },
  contenido: { padding: 20, paddingBottom: 40 },
  encabezado: { flexDirection: "row", alignItems: "center", gap: 10 },
  tituloEncabezado: { fontSize: 24, fontWeight: "bold", color: "#302820" },
  seccionTitulo: { fontSize: 16, fontWeight: "bold", color: "#302820", marginTop: 20, marginBottom: 10 },
  filaChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#E5DCD3", backgroundColor: "#FFFFFF" },
  chipActivo: { borderColor: NARANJA, backgroundColor: NARANJA },
  chipTexto: { color: "#302820", fontWeight: "normal" },
  chipTextoActivo: { color: "#FFFFFF", fontWeight: "bold" },
  productoFila: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF",
    borderWidth: 1, borderColor: "#E5DCD3", borderRadius: 12, padding: 12, marginBottom: 8, gap: 10,
  },
  productoFilaActiva: { borderColor: NARANJA },
  productoNombre: { fontWeight: "bold", color: "#302820" },
  productoDetalle: { color: "#8C8178", fontSize: 12 },
  productoSubtotal: { color: NARANJA, fontWeight: "bold", marginTop: 4 },
  campoCantidad: {
    width: 60, textAlign: "center", borderWidth: 1, borderColor: "#E5DCD3",
    borderRadius: 10, paddingVertical: 8, backgroundColor: "#FFF9F3",
  },
  total: { fontSize: 20, fontWeight: "bold", color: "#302820", marginTop: 24 },
  botonGuardar: {
    backgroundColor: NARANJA, paddingVertical: 14, borderRadius: 12,
    alignItems: "center", marginTop: 14,
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
  tecladoBar: {
    flexDirection: "row", justifyContent: "flex-end", backgroundColor: "#F1ECE6",
    paddingHorizontal: 16, paddingVertical: 8,
  },
  tecladoListo: { color: NARANJA, fontWeight: "bold", fontSize: 16 },
});

export default styles;
