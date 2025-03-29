// FiltroCategorias.js
import React, { useEffect, useState, useRef } from "react";
import { ScrollView, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator, View } from "react-native";
import { useThemeColors } from "../componentes/Tema";
import Icon from "react-native-vector-icons/FontAwesome";
import cargandoGif from "../../assets/animacion_cargando.gif";
import { API_URL } from "../../config";

export default function FiltroCategorias({ onSelectCategoria }) {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const colors = useThemeColors();
    
    const scrollViewRef = useRef(null);  
    const scrollOffset = useRef(0); // Para almacenar la posición actual del scroll

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch(`${API_URL}/libros/tematicas`);
                const data = await response.json();
                setCategorias(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    const handleCategoriaPress = (tematica) => {
        if (categoriaSeleccionada === tematica) {
            setCategoriaSeleccionada(null);
            onSelectCategoria(null);
        } else {
            setCategoriaSeleccionada(tematica);
            onSelectCategoria(tematica);
        }
    };

    const scrollTo = (direction) => {
        if (scrollViewRef.current) {
            const scrollStep = 200; // Cuánto desplazarse en cada pulsación
            let newOffset = scrollOffset.current + (direction === "left" ? -scrollStep : scrollStep);

            // Asegurarnos de no salirnos de los límites
            newOffset = Math.max(0, newOffset); 

            scrollViewRef.current.scrollTo({ x: newOffset, animated: true });

            // Actualizar la posición almacenada
            scrollOffset.current = newOffset;
        }
    };

    if (loading) {
      return (
        <View>
          <Image source={cargandoGif}/>
        </View>
      );
    }

    return (
        <View style={styles.categoriasWrapper}>
            <TouchableOpacity style={[styles.arrowButtonLeft, { left: 0, backgroundColor: colors.buttonArrow }]} onPress={() => scrollTo("left")}>
                <Icon name="chevron-left" size={20} color={colors.icon} />
            </TouchableOpacity>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriasContainer}
                contentContainerStyle={styles.categoriasInnerContainer}
                onScroll={(event) => {
                    scrollOffset.current = event.nativeEvent.contentOffset.x; // Guardar la posición actual
                }}
                scrollEventThrottle={16} // Hacer el evento más fluido
            >
                {categorias.map((categoria) => (
                    <TouchableOpacity
                        key={categoria.tematica}
                        style={[
                            styles.categoriaButton,
                            {
                                backgroundColor: categoriaSeleccionada === categoria.tematica
                                    ? colors.categoriaButtonSeleccionado
                                    : colors.categoriaButton,
                            },
                        ]}
                        onPress={() => handleCategoriaPress(categoria.tematica)}
                    >
                        <Text style={{ color: colors.text }}>
                            {categoria.tematica}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={[styles.arrowButtonRight, { right: 0, backgroundColor: colors.buttonArrow }]} onPress={() => scrollTo("right")}>
                <Icon name="chevron-right" size={20} color={colors.icon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    categoriasWrapper: {
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    categoriasContainer: {
        flexDirection: "row",
    },
    categoriasInnerContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    categoriaButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
  arrowButtonLeft: {
    top: "25%",
    marginRight: 10,
    transform: [{ translateY: -15 }],
    zIndex: 1,
    padding: 10,
    borderRadius: 50,
  },
  arrowButtonRight: {
    top: "25%",
    marginLeft: 10,
    transform: [{ translateY: -15 }],
    zIndex: 1,
    padding: 10,
    borderRadius: 50,
  },
});
