import React from 'react';
import { Image, Animated, StyleSheet } from 'react-native';

/**
 * Componente para iconos y flechas animados del splash.
 * Se ilumina cuando es el activo en la secuencia del carrusel.
 * Secuencia: icono(0) → flecha(1) → icono(2) → flecha(3) → ...
 *
 * Props:
 * - source: imagen del icono o flecha
 * - itemIndex: posición en la secuencia completa (0-8)
 * - activeIndex: Animated.Value que indica el item activo
 * - size: tamaño de la imagen
 * - isArrow: si es flecha (escala menor al activarse)
 */
export default function AnimatedIcon({
  source,
  itemIndex,
  activeIndex,
  size = 38,
  isArrow = false,
}) {
  // El activo brilla completamente, los demás quedan tenues
  const opacity = activeIndex.interpolate({
    inputRange: [itemIndex - 1, itemIndex, itemIndex + 1],
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  // El activo se agranda suavemente
  const scale = activeIndex.interpolate({
    inputRange: [itemIndex - 1, itemIndex, itemIndex + 1],
    outputRange: [0.85, isArrow ? 1.1 : 1.2, 0.85],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        isArrow ? styles.arrowWrapper : styles.iconWrapper,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  arrowWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
});
