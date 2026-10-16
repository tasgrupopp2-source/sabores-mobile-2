/**
 * Estilos de la pantalla de Clientes.
 * Usan los colores y fuentes de theme.js para mantener la identidad de la app.
 */

import { StyleSheet } from "react-native";
import { colors, fonts } from "../config/theme";

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Encabezado con el paisaje andino.
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  botonVolver: {
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  titulo: {
    marginLeft: 6,
    fontSize: 24,
    fontFamily: fonts.header,
    color: colors.black,
  },

  // Buscador.
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  inputBuscador: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.black,
  },

  // Contador de clientes.
  contador: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.gray,
  },

  lista: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 110,
  },

  // Tarjeta de cliente.
  tarjeta: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  filaPrincipal: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDE9DC",
  },
  avatarTexto: {
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
    color: colors.sunriseRed,
  },
  nombre: {
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
    color: colors.black,
  },
  filaIcono: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  textoSecundario: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.gray,
  },

  // Detalle desplegable.
  detalle: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: 8,
  },
  textoDetalle: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.black,
  },
  acciones: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  botonAccion: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FDE9DC",
  },
  textoAccion: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.sunriseRed,
  },
  accionesAdmin: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 4,
  },
  botonAdmin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  textoEditar: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.mountainBlue,
  },
  textoEliminar: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.error,
  },

  // Pedidos del cliente.
  badgePedidos: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    marginRight: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sunriseRed,
  },
  textoBadge: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    color: colors.white,
  },
  bloquePedidos: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    gap: 8,
  },
  encabezadoPedidos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tituloPedidos: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.black,
  },
  filaPedido: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  importePedido: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.sunriseRed,
  },

  // Estado vacío.
  vacio: {
    alignItems: "center",
    marginTop: 60,
    gap: 10,
  },
  textoVacio: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.gray,
  },
  contenidoFlexible: { flex: 1 },
  botonGuardarDeshabilitado: { opacity: 0.6 },
  imagenFondo: { opacity: 0.8 },
  encabezadoFondo: { justifyContent: "center" },
  indicadorCarga: { marginTop: 40 },

  // Botón flotante.
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sunriseRed,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  // Modal de alta y edición.
  modalFondo: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalTarjeta: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  modalEncabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 24,
    fontFamily: fonts.header,
    color: colors.black,
  },
  input: {
    height: 48,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.black,
  },
  botonGuardar: {
    height: 50,
    marginTop: 6,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sunriseRed,
  },
  textoGuardar: {
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
    color: colors.white,
  },
});

export default styles;
