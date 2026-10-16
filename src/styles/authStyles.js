import { StyleSheet, Dimensions } from 'react-native';
import { colors, fonts } from '../config/theme';

const { width, height } = Dimensions.get('window');

export const AUTH_IMAGES = {
  background: require('../../assets/Login/fondo_login_sabores_andinos_v3.png'),
  logo: require('../../assets/Splashscreen/logo_sabores_andinos_1080.png'),
  correo: require('../../assets/Login/ic_correo_512.png'),
  candado: require('../../assets/Login/ic_candado_512.png'),
  ojo: require('../../assets/Login/ic_ojo_512.png'),
  usuario: require('../../assets/Login/ic_usuario_512.png'),
};

const LOGO_BIG = width * 0.45;
const LOGO_SM = width * 0.22;
const INPUT_H = 52;
const IC = 22;

export default StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(245,240,232,0.85)' },
  overlayDark: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,20,20,0.92)' },
  scrollContent: {
    flexGrow: 1, alignItems: 'center',
    paddingHorizontal: 32, paddingTop: height * 0.06, paddingBottom: 40,
  },
  logoBig: {
    width: LOGO_BIG, height: LOGO_BIG,
    borderRadius: LOGO_BIG / 2, marginBottom: 20,
  },
  logoSmall: {
    width: LOGO_SM, height: LOGO_SM,
    borderRadius: LOGO_SM / 2, marginBottom: 16,
  },
  backButton: { alignSelf: 'flex-start', marginBottom: 12, padding: 4 },
  backText: { fontFamily: fonts.body, fontSize: 28, color: colors.white },
  backTextDark: { fontFamily: fonts.body, fontSize: 28, color: colors.black },
  title: {
    fontFamily: fonts.header, fontSize: 28,
    color: colors.black, textAlign: 'center', marginBottom: 4,
  },
  titleWhite: {
    fontFamily: fonts.header, fontSize: 28,
    color: colors.white, textAlign: 'center', marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.body, fontSize: 14, color: colors.gray,
    textAlign: 'center', marginBottom: 24, paddingHorizontal: 10,
  },
  subtitleWhite: {
    fontFamily: fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', marginBottom: 24, paddingHorizontal: 10,
  },
  inputContainer: { width: '100%', marginBottom: 14 },
  inputLabel: {
    fontFamily: fonts.bodySemiBold, fontSize: 13,
    color: colors.black, marginBottom: 6, marginLeft: 4,
  },
  inputLabelWhite: {
    fontFamily: fonts.bodySemiBold, fontSize: 13,
    color: colors.white, marginBottom: 6, marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: colors.inputBorder,
    height: INPUT_H, paddingHorizontal: 14,
  },
  inputWrapperFocused: { borderColor: colors.mountainBlue, borderWidth: 1.5 },
  inputIcon: { width: IC, height: IC, marginRight: 10, tintColor: colors.gray },
  inputIconFocused: { tintColor: colors.mountainBlue },
  input: {
    flex: 1, fontFamily: fonts.body, fontSize: 15,
    color: colors.black, paddingVertical: 0,
  },
  eyeButton: { padding: 6 },
  eyeIcon: { width: IC, height: IC, tintColor: colors.gray },
  primaryButton: {
    width: '100%', height: 50, backgroundColor: colors.sunriseRed,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', marginBottom: 20, elevation: 3,
    shadowColor: colors.sunriseRed, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6,
  },
  primaryButtonText: {
    fontFamily: fonts.bodySemiBold, fontSize: 16,
    color: colors.white, letterSpacing: 1,
  },
  arrowText: { fontFamily: fonts.body, fontSize: 18, color: colors.white, marginLeft: 8 },
  linkRow: { flexDirection: 'row', alignItems: 'center' },
  linkText: { fontFamily: fonts.body, fontSize: 14, color: colors.gray },
  linkHighlight: {
    fontFamily: fonts.bodySemiBold, fontSize: 14,
    color: colors.mountainBlue, marginLeft: 4,
  },
  linkHighlightWhite: {
    fontFamily: fonts.bodySemiBold, fontSize: 14,
    color: colors.sunriseRed, marginLeft: 4,
  },
  codeRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  codeInput: {
    width: 46, height: 54, backgroundColor: colors.white,
    borderRadius: 10, borderWidth: 1.5, borderColor: colors.inputBorder,
    textAlign: 'center', fontFamily: fonts.bodySemiBold,
    fontSize: 22, color: colors.black, marginHorizontal: 4,
  },
  codeInputFocused: { borderColor: colors.mountainBlue, borderWidth: 2 },
  reqBox: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10, padding: 14, marginBottom: 20,
  },
  reqTitle: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.white, marginBottom: 8 },
  reqItem: {
    fontFamily: fonts.body, fontSize: 12,
    color: 'rgba(255,255,255,0.6)', marginBottom: 3, marginLeft: 6,
  },
  reqItemValid: { color: colors.terraceGreen },
  timerText: {
    fontFamily: fonts.body, fontSize: 13,
    color: colors.gray, textAlign: 'center', marginBottom: 6,
  },
  timerBold: { fontFamily: fonts.bodySemiBold, color: colors.sunriseRed },
  footer: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 'auto', paddingTop: 20,
  },
  footerLogo: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  footerText: { fontFamily: fonts.body, fontSize: 11, color: colors.gray },
  footerTextWhite: { fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  legalText: {
    fontFamily: fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.5)',
    textAlign: 'center', marginTop: 12, paddingHorizontal: 20,
  },
  cancelText: { fontFamily: fonts.body, fontSize: 15, color: colors.gray, textAlign: 'center', marginTop: 4 },
  emailHighlight: { fontFamily: fonts.bodySemiBold, color: colors.mountainBlue },
  passwordEyeContainer: { position: "relative" },
  passwordEyeSlash: {
    position: "absolute",
    top: 9,
    left: -2,
    width: 28,
    height: 2,
    backgroundColor: colors.gray,
    transform: [{ rotate: "-45deg" }],
    borderRadius: 1,
  },
  keyboardArea: { flex: 1 },
  securityBox: { backgroundColor: "rgba(0,0,0,0.05)" },
  securityTitle: { color: colors.black },
  securityItem: { color: colors.gray },
  buttonLoading: { opacity: 0.7 },
  legalTextGray: { color: colors.gray },
});
