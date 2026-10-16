import { useEffect, useRef, useCallback } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

// ── Constantes de configuración ──────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_ITEMS = 9;
const LOGO_FADE_DURATION = 1200;
const LOGO_SPRING_FRICTION = 8;
const LOGO_SPRING_TENSION = 20;
const PULSE_SPEED = 400;
const NAVIGATE_DELAY = 5500;
const SCROLL_DURATION = 10000;

// ── Hook principal ───────────────────────────────────────────
export default function useSplashAnimations(onFinish) {
  // Valores animados del logo
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;

  // Opacidad y escala individual para cada uno de los 9 items
  const itemOpacities = useRef(
    Array.from({ length: TOTAL_ITEMS }, () => new Animated.Value(0.3))
  ).current;
  const itemScales = useRef(
    Array.from({ length: TOTAL_ITEMS }, () => new Animated.Value(0.85))
  ).current;

  // Desplazamiento horizontal del carrusel
  const scrollX = useRef(new Animated.Value(SCREEN_WIDTH * 0.15)).current;

  // Referencias para cleanup
  const intervalRef = useRef(null);
  const pulseAnimRef = useRef(null);
  const scrollAnimRef = useRef(null);
  const timeoutsRef = useRef([]);

  // ── Animación del logo (fade in + spring) ──────────────────
  const animateLogo = useCallback((callback) => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: LOGO_FADE_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: LOGO_SPRING_FRICTION,
        tension: LOGO_SPRING_TENSION,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }, [logoOpacity, logoScale]);

  // ── Palpitación del logo ───────────────────────────────────
  const startLogoPulse = useCallback(() => {
    const pulse = Animated.sequence([
      Animated.timing(logoPulse, {
        toValue: 1.03,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoPulse, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);
    pulseAnimRef.current = Animated.loop(pulse);
    pulseAnimRef.current.start();
  }, [logoPulse]);

  // ── Iluminar un item (el nuevo se enciende antes de apagar) ─
  const highlightItem = useCallback((index) => {
    Animated.parallel([
      Animated.timing(itemOpacities[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(itemScales[index], {
        toValue: 1.25,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      const fadeOut = [];
      for (let i = 0; i < TOTAL_ITEMS; i++) {
        if (i === index) continue;
        fadeOut.push(
          Animated.timing(itemOpacities[i], {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(itemScales[i], {
            toValue: 0.85,
            duration: 200,
            useNativeDriver: true,
          }),
        );
      }
      Animated.parallel(fadeOut).start();
    }, 120);
    timeoutsRef.current.push(t);
  }, [itemOpacities, itemScales]);

  // ── Carrusel: iluminación + scroll horizontal ──────────────
  const startCarousel = useCallback(() => {
    let step = 0;

    highlightItem(0);
    step = 1;

    intervalRef.current = setInterval(() => {
      highlightItem(step % TOTAL_ITEMS);
      step++;
    }, PULSE_SPEED);

    // Scroll horizontal suave en loop
    const startScrollLoop = () => {
      scrollX.setValue(SCREEN_WIDTH * 0.15);
      scrollAnimRef.current = Animated.timing(scrollX, {
        toValue: -SCREEN_WIDTH * 0.6,
        duration: SCROLL_DURATION,
        useNativeDriver: true,
        easing: Easing.linear,
      });
      scrollAnimRef.current.start(({ finished }) => {
        if (finished) startScrollLoop();
      });
    };

    startScrollLoop();
  }, [highlightItem, scrollX]);

  // ── Cleanup ────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pulseAnimRef.current) pulseAnimRef.current.stop();
    if (scrollAnimRef.current) scrollAnimRef.current.stop();
    timeoutsRef.current.forEach(clearTimeout);
  }, []);

  // ── Efecto principal ───────────────────────────────────────
  useEffect(() => {
    animateLogo(() => {
      startLogoPulse();
      startCarousel();
    });

    const navigationTimeout = setTimeout(onFinish, NAVIGATE_DELAY);

    return () => {
      clearTimeout(navigationTimeout);
      cleanup();
    };
  }, [animateLogo, startLogoPulse, startCarousel, cleanup, onFinish]);

  return {
    logoScale,
    logoOpacity,
    logoPulse,
    itemOpacities,
    itemScales,
    scrollX,
    TOTAL_ITEMS,
  };
}
