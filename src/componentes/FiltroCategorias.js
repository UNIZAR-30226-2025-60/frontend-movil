import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { useThemeColors } from "../componentes/Tema";

export default function FiltroCategorias({ onSelectCategoria }) {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // Nuevo estado para gestionar la categoría seleccionada
    const colors = useThemeColors();

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch("http://10.0.2.2:3000/api/libros/tematicas");
                const data = await response.json();
                setCategorias(data); // Suponiendo que 'data' es un array de objetos con 'tematica'
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    const handleCategoriaPress = (tematica) => {
        // Cambia la categoría seleccionada o la desactiva si ya está seleccionada
        if (categoriaSeleccionada === tematica) {
            setCategoriaSeleccionada(null); // Si la categoría ya está seleccionada, la desactiva
            onSelectCategoria(null); // Limpia los resultados de búsqueda
        } else {
            setCategoriaSeleccionada(tematica); // Marca la categoría como seleccionada
            onSelectCategoria(tematica); // Realiza la búsqueda de libros por esta categoría
        }
    };

    if (loading) {
        return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasContainer}>
            <ActivityIndicator size="large" color={colors.icon} />
        </ScrollView>
        );
    }

    return (
        <View style={styles.categoriasWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasContainer}>
            {categorias.map((categoria) => (
                <TouchableOpacity
                    key={categoria.tematica}
                    style={[
                    styles.categoriaButton,
                    {
                        backgroundColor: categoriaSeleccionada === categoria.tematica ? colors.categoriaButtonSec : colors.categoriaButton, // Cambia el color si la categoría está seleccionada
                    },
                    ]}
                    onPress={() => handleCategoriaPress(categoria.tematica)}
                >
                    <Text
                    style={{
                        color: categoriaSeleccionada === categoria.tematica ? colors.buttonText : colors.icon, // Cambia el texto según la categoría seleccionada
                    }}
                    >
                    {categoria.tematica}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    categoriasWrapper: {
        paddingHorizontal: 10,
        flexDirection: 'row', // Para asegurarnos de que los botones se alineen horizontalmente
        flexWrap: 'wrap', // Para permitir que los botones se ajusten cuando se alcance el final de la línea
    },
    categoriasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Hace que los botones se envuelvan en la siguiente fila si no caben
    },
    categoriaButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10, // Espacio entre botones en la fila
    },
});
