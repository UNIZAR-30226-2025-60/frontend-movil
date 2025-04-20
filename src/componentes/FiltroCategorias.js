// FiltroCategotias.js
import React, { useEffect, useState, useRef } from "react";
import { ScrollView, TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";
import { useThemeColors } from "../componentes/Tema";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import cargandoModoOscuro from "../../assets/animacion_cargando_modo_oscuro.gif";
import cargandoModoClaro from "../../assets/animacion_cargando_modo_claro.gif";
import { API_URL } from "../../config";

export default function FiltroCategorias({ onSelectCategoria }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const colors = useThemeColors();
  const theme = useColorScheme();

  const scrollViewRef = useRef(null);
  const scrollOffset = useRef(0);

  useEffect(() => {
    fetchCategorias();
  }, []);

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
      const scrollStep = 200;
      let newOffset = scrollOffset.current + (direction === "left" ? -scrollStep : scrollStep);

      newOffset = Math.max(0, newOffset);
      scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
      scrollOffset.current = newOffset;
    }
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const containerWidth = event.nativeEvent.layoutMeasurement.width;

    setCanScrollLeft(offsetX > 0);
    setCanScrollRight(offsetX + containerWidth < contentWidth);

    scrollOffset.current = offsetX;
  };

  if (loading) {
    return (
      <View>
        {/* <Image source={theme === 'dark' ? cargandoModoOscuro : cargandoModoClaro} /> */}
        <Text>Cargando categorías...</Text>
      </View>
    );
  }

  if (categorias.length === 0) {
    return null;
  }

  return (
    <View style={styles.categoriasWrapper}>
      {categorias.length > 3 && (
        <TouchableOpacity
          style={[styles.arrowButtonLeft, { left: 0, backgroundColor: colors.backgroundSubtitle }]}
          onPress={() => scrollTo("left")}
          disabled={!canScrollLeft}
        >
          <Ionicons name="caret-back-outline" size={30} color={canScrollLeft ? colors.iconArrow : colors.iconArrowDesactivado} />
        </TouchableOpacity>
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriasContainer}
        contentContainerStyle={styles.categoriasInnerContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {categorias.map((categoria) => (
          <TouchableOpacity
            key={categoria.tematica}
            style={[
              styles.categoriaButton,
              {
                backgroundColor:
                  categoriaSeleccionada === categoria.tematica
                    ? colors.categoriaButtonSeleccionado
                    : colors.categoriaButton,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => handleCategoriaPress(categoria.tematica)}
          >
            <Text
              style={{
                color: categoriaSeleccionada === categoria.tematica ? colors.textDark : colors.textDark,
              }}
            >
              {categoria.tematica}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {categorias.length > 3 && (
        <TouchableOpacity
          style={[styles.arrowButtonRight, { right: 0, backgroundColor: colors.backgroundSubtitle }]}
          onPress={() => scrollTo("right")}
          disabled={!canScrollRight}
        >
          <Ionicons name="caret-forward-outline" size={30} color={canScrollRight ? colors.iconArrow : colors.iconArrowDesactivado} />
        </TouchableOpacity>
      )}
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
    // marginRight: 10,
    transform: [{ translateY: -15 }],
    zIndex: 1,
    padding: 10,
    borderRadius: 50,
  },
  arrowButtonRight: {
    top: "25%",
    // marginLeft: 10,
    transform: [{ translateY: -15 }],
    zIndex: 1,
    padding: 10,
    borderRadius: 50,
  },
});