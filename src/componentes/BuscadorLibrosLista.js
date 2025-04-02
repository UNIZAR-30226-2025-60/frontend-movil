// BuscadorLibrosLista.js
import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useThemeColors } from "./Tema";
import { API_URL } from "../../config";

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

export default function BuscadorLibrosLista({ setLibros, libros }) {
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const colors = useThemeColors(); // Obtenemos los colores según el tema del sistema

    // Usa el debouncedValue para ejecutar la búsqueda cuando el valor esté completamente escrito
    const debouncedTerminoBusqueda = useDebounce(terminoBusqueda, 500);

    useEffect(() => {
        const buscarLibros = () => {
            if (debouncedTerminoBusqueda.trim()) {
                const librosFiltrados = libros.filter(libro =>
                    libro.nombre.toLowerCase().includes(debouncedTerminoBusqueda.toLowerCase())
                );
                setLibros(librosFiltrados);
            } 
            // else {
            //     setLibros(libros); // Si no hay búsqueda, muestra todos los libros
            // }
        };
    
        buscarLibros();
    }, [debouncedTerminoBusqueda, libros]);
    

    return (
      <View style={[styles.contenedor, { backgroundColor: colors.buscador, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textDark} style={styles.icono} />
        <TextInput
          style={[styles.input, { color: colors.textDark }]}
          placeholder="Buscar libros..."
          placeholderTextColor={colors.textDark}
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
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    icono: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
    },
});
