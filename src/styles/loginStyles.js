import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts } from '../config/theme';

const { width, height } = Dimensions.get('window');

// ── Assets del Login ─────────────────────────────────────────
export const LOGIN_IMAGES = {
  background: require('../../assets/Login/fondo_login_sabores_andinos_v3.png'),
  logo: require('../../assets/Splashscreen/logo_sabores_andinos_1080.png'),
  correo: require('../../assets/Login/ic_correo_512.png'),
  candado: require('../../assets/Login/ic_candado_512.png'),
  ojo: require('../../assets/Login/ic_ojo_512.png'),
  usuario: require('../../assets/Login/ic_usuario_512.png'),
};

// ── Dimensiones ──────────────────────────────────────────────
const LOGO_SIZE = width * 0.45;
const INPUT_HEIGHT = 52;
const ICON_SIZE = 22;

// ── Estilos ──────────────────────────────────────────────────
export default StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 240, 232, 0.85)',
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },

  // ── Logo ───────────────────────────────────────────────────
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
  },

  // ── Títulos ────────────────────────────────────────────────
  title: {
    fontFamily: fonts.header,
    fontSize: 30,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },

  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 28,
  },

  // ── Campos de entrada ──────────────────────────────────────
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },

  inputLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.black,
    marginBottom: 6,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    height: INPUT_HEIGHT,
    paddingHorizontal: 14,
  },

  inputWrapperFocused: {
    borderColor: colors.mountainBlue,
    borderWidth: 1.5,
  },

  inputIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginRight: 10,
    tintColor: colors.gray,
  },

  inputIconFocused: {
    tintColor: colors.mountainBlue,
  },

  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.black,
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 6,
  },

  eyeIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    tintColor: colors.gray,
  },

  // ── Olvidé contraseña ──────────────────────────────────────
  forgotRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },

  forgotText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.mountainBlue,
  },

  // ── Botón principal ────────────────────────────────────────
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.sunriseRed,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: colors.sunriseRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  loginButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    color: colors.white,
    letterSpacing: 1,
  },

  // ── Registro ───────────────────────────────────────────────
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  registerText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.gray,
  },

  registerLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.mountainBlue,
    marginLeft: 4,
  },
});
