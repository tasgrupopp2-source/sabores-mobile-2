import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ── Assets: Iconos del carrusel (producto + flecha entre cada uno) ───
const arrow = require('../../assets/Splashscreen/icono_flecha_512 (1).png');

export const ARROW_SRC = arrow;

export const SPLASH_ICONS = [
  { src: require('../../assets/Splashscreen/icono_choclo_512 (1).png'), isArrow: false },
  { src: arrow, isArrow: true },
  { src: require('../../assets/Splashscreen/icono_quinoa_512 (1).png'), isArrow: false },
  { src: arrow, isArrow: true },
  { src: require('../../assets/Splashscreen/icono_papa_512 (1).png'), isArrow: false },
  { src: arrow, isArrow: true },
  { src: require('../../assets/Splashscreen/icono_brote_512 (1).png'), isArrow: false },
  { src: arrow, isArrow: true },
  { src: require('../../assets/Splashscreen/icono_papas_512 (1).png'), isArrow: false },
];

// ── Assets: Imágenes principales ─────────────────────────────────────
export const SPLASH_IMAGES = {
  background: require('../../assets/Splashscreen/fondo_paisaje_andino_1080x2524.jpg'),
  logo: require('../../assets/Splashscreen/logo_sabores_andinos_1080.png'),
};

// ── Dimensiones calculadas ───────────────────────────────────────────
const LOGO_SIZE = width * 0.65;
const ICONS_BOTTOM = height * 0.08;
const ICON_SIZE = 50;
const ARROW_SIZE = 28;

// ── Estilos ──────────────────────────────────────────────────────────
export default StyleSheet.create({
  // Contenedor raíz
  container: {
    flex: 1,
  },

  // Imagen de fondo (paisaje andino)
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Overlay oscuro para contraste del logo
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  // Contenido principal centrado
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },

  // Contenedor del logo con margen inferior
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },

  // Tamaño del logo (65% del ancho de pantalla)
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },

  // Fila de "Cargando" con spinner
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: ICONS_BOTTOM + 70,
  },

  // Texto "Cargando"
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
  },

  // Contenedor de la fila de iconos (posición absoluta abajo)
  iconsContainer: {
    position: 'absolute',
    bottom: ICONS_BOTTOM,
    width: '100%',
    height: 60,
    overflow: 'hidden',
  },

  // Fila horizontal de iconos
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },

  // Contenedor de cada icono de producto
  iconWrapper: {
    width: ICON_SIZE + 8,
    height: ICON_SIZE + 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },

  // Imagen del icono de producto
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },

  // Contenedor de la flecha separadora
  arrowWrapper: {
    width: ARROW_SIZE + 6,
    height: ARROW_SIZE + 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },

  // Imagen de la flecha
  arrow: {
    width: ARROW_SIZE,
    height: ARROW_SIZE,
  },
});
