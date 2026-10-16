// Cargamos el soporte de URL para React Native.
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

// Obtenemos las credenciales del archivo .env.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Verificamos que las credenciales estén configuradas.
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan las credenciales de Supabase.");
}

// Creamos una única instancia reutilizable.
export const supabase = createClient(supabaseUrl, supabaseKey);
