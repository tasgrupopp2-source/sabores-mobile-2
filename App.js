import React from 'react';
import { useFonts, Cormorant_400Regular, Cormorant_700Bold } from '@expo-google-fonts/cormorant';
import { OpenSans_400Regular, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { View, ActivityIndicator } from 'react-native';

// Navegación principal de la app
import Navigation from './src/navigation/Navegation';
import { colors } from './src/config/theme';

export default function App() {
  // Cargamos las fuentes de marca antes de mostrar la app
  const [fontsLoaded] = useFonts({
    Cormorant_400Regular,
    Cormorant_700Bold,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  // Mientras cargan las fuentes mostramos un spinner
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.sunriseRed} />
      </View>
    );
  }

  return <Navigation />;
}
