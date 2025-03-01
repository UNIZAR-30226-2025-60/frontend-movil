import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import { useThemeColors } from "./Tema"; // Importamos los colores del tema

// Función debounce para retrasar la ejecución de la búsqueda
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BuscadorLibros({ setResultados }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const colors = useThemeColors(); // Obtenemos los colores según el tema del sistema

  // Usa el debouncedValue para ejecutar la búsqueda cuando el valor esté completamente escrito
  const debouncedTerminoBusqueda = useDebounce(terminoBusqueda, 500);

  useEffect(() => {
    const buscarLibros = async () => {
      let url;

      if (!debouncedTerminoBusqueda.trim()) {
        url = "http://10.0.2.2:3000/api/libros"; // Obtener todos los libros
      } else {
        url = `http://10.0.2.2:3000/api/libros/obtenerTitulo/${encodeURIComponent(debouncedTerminoBusqueda)}`;
      }

      try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los resultados.");
        }

        const librosEncontrados = await respuesta.json();
        setResultados(librosEncontrados);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
        Alert.alert("❌ Error", "Hubo un problema al buscar o cargar los libros.");
      }
    };

    buscarLibros();
  }, [debouncedTerminoBusqueda]);

  return (
    <View style={[styles.contenedor, { backgroundColor: colors.background }]}>
      <TextInput
        style={styles.input}
        placeholder="Buscar libros..."
        placeholderTextColor="#888"
        value={terminoBusqueda}
        onChangeText={setTerminoBusqueda}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
