import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../styles/gestionProductosStyles";

// Buscador y filtros reutilizables para la pantalla de productos.
export default function BuscadorProductos({
  busqueda,
  setBusqueda,
  mostrarFiltro,
  setMostrarFiltro,
  filtroStock,
  setFiltroStock,
}) {
  // Opciones disponibles para filtrar el inventario.
  const opciones = [
    { valor: "todos", texto: "Todos" },
    { valor: "bajo", texto: "Stock bajo" },
    { valor: "agotado", texto: "Agotados" },
  ];

  return (
    <>
      {/* Campo de búsqueda. */}
      <View style={styles.buscador}>
        <Ionicons
          name="search-outline"
          size={16}
          color="#738096"
        />

        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar por nombre o categoría..."
          placeholderTextColor="#8993A4"
          style={styles.inputBuscador}
        />

        <TouchableOpacity
          onPress={() => setMostrarFiltro(!mostrarFiltro)}
          accessibilityLabel="Mostrar filtros"
        >
          <Ionicons
            name="filter-outline"
            size={18}
            color="#526176"
          />
        </TouchableOpacity>
      </View>

      {/* Las opciones aparecen al tocar el icono de filtros. */}
      {mostrarFiltro && (
        <View style={styles.filtros}>
          {opciones.map((opcion) => {
            const activa = filtroStock === opcion.valor;

            return (
              <TouchableOpacity
                key={opcion.valor}
                style={[
                  styles.opcionFiltro,
                  activa && styles.opcionFiltroActiva,
                ]}
                onPress={() => setFiltroStock(opcion.valor)}
              >
                <Text
                  style={[
                    styles.textoFiltro,
                    activa && styles.textoFiltroActivo,
                  ]}
                >
                  {opcion.texto}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
}