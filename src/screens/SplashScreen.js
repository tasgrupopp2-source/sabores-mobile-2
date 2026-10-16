import React from 'react';
import {
  View,
  Image,
  Text,
  Animated,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

// Hook personalizado con la lógica de animaciones
import useSplashAnimations from '../hooks/useSplashAnimations';

// Estilos y assets del splash
import styles, { SPLASH_ICONS, SPLASH_IMAGES, ARROW_SRC } from '../styles/splashStyles';

// ── Componente principal del Splash Screen ───────────────────────────
// Carrusel horizontal con scroll continuo + iluminación secuencial
// Siempre hay una flecha entre cada icono, incluso al duplicar
export default function SplashScreen({ navigation }) {
  const {
    logoScale,
    logoOpacity,
    logoPulse,
    itemOpacities,
    itemScales,
    scrollX,
    TOTAL_ITEMS,
  } = useSplashAnimations(() => navigation.replace('Login'));

  // Duplicamos con flecha de unión para loop visual sin corte
  const carouselItems = [
    ...SPLASH_ICONS,
    { src: ARROW_SRC, isArrow: true },
    ...SPLASH_ICONS,
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={SPLASH_IMAGES.background}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          {/* ── Logo con palpitación ─────────────────────────── */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: Animated.multiply(logoScale, logoPulse) },
                ],
              },
            ]}
          >
            <Image
              source={SPLASH_IMAGES.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* ── Texto "Cargando" con spinner ──────────────────── */}
          <View style={styles.loadingRow}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Cargando</Text>
          </View>

          {/* ── Carrusel con scroll + iluminación ─────────────── */}
          <View style={styles.iconsContainer}>
            <Animated.View
              style={[
                styles.iconsRow,
                { transform: [{ translateX: scrollX }] },
              ]}
            >
              {carouselItems.map((item, index) => {
                const realIndex = index % TOTAL_ITEMS;
                const isArrow = item.isArrow;
                const size = isArrow ? 28 : 50;

                return (
                  <Animated.View
                    key={`item-${index}`}
                    style={[
                      isArrow ? styles.arrowWrapper : styles.iconWrapper,
                      {
                        opacity: itemOpacities[realIndex],
                        transform: [{ scale: itemScales[realIndex] }],
                      },
                    ]}
                  >
                    <Image
                      source={item.src}
                      style={{ width: size, height: size }}
                      resizeMode="contain"
                    />
                  </Animated.View>
                );
              })}
            </Animated.View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
