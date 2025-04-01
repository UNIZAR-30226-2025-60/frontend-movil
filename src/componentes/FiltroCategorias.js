// // FiltroCategorias.js
// import React, { useEffect, useState, useRef } from "react";
// import { ScrollView, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator, View } from "react-native";
// import { useThemeColors } from "../componentes/Tema";
// import Icon from "react-native-vector-icons/FontAwesome";
// import cargandoGif from "../../assets/animacion_cargando.gif";
// import { API_URL } from "../../config";

// export default function FiltroCategorias({ onSelectCategoria }) {
//   const [categorias, setCategorias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
//   const colors = useThemeColors();
    
//   const scrollViewRef = useRef(null);  
//   const scrollOffset = useRef(0); // Para almacenar la posición actual del scroll

//   useEffect(() => {
//     fetchCategorias();
//   }, []);

//   const fetchCategorias = async () => {
//     try {
//       const response = await fetch(`${API_URL}/libros/tematicas`);
//       const data = await response.json();
//       setCategorias(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setLoading(false);
//     }
//   };

//   const handleCategoriaPress = (tematica) => {
//     if (categoriaSeleccionada === tematica) {
//       setCategoriaSeleccionada(null);
//       onSelectCategoria(null);
//     } else {
//       setCategoriaSeleccionada(tematica);
//       onSelectCategoria(tematica);
//     }
//   };

//   const scrollTo = (direction) => {
//     if (scrollViewRef.current) {
//       const scrollStep = 200; // Cuánto desplazarse en cada pulsación
//       let newOffset = scrollOffset.current + (direction === "left" ? -scrollStep : scrollStep);

//       // Asegurarnos de no salirnos de los límites
//       newOffset = Math.max(0, newOffset); 

//       scrollViewRef.current.scrollTo({ x: newOffset, animated: true });

//       // Actualizar la posición almacenada
//       scrollOffset.current = newOffset;
//     }
//   };

//   if (loading) {
//     return (
//       <View>
//         <Image source={cargandoGif}/>
//       </View>
//     );
//   }

//   if (categorias.length === 0) {
//     return null; // No renderiza nada si no hay categorías
//   }

//   return (
//     <View style={styles.categoriasWrapper}>
//       <TouchableOpacity style={[styles.arrowButtonLeft, { left: 0, backgroundColor: colors.categoriaButton }]} onPress={() => scrollTo("left")}>
//         <Icon name="chevron-left" size={20} color={colors.textDark} />
//       </TouchableOpacity>

//       <ScrollView
//         ref={scrollViewRef}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.categoriasContainer}
//         contentContainerStyle={styles.categoriasInnerContainer}
//         onScroll={(event) => {
//           scrollOffset.current = event.nativeEvent.contentOffset.x; // Guardar la posición actual
//         }}
//         scrollEventThrottle={16} // Hacer el evento más fluido
//       >
//         {categorias.map((categoria) => (
//           <TouchableOpacity
//             key={categoria.tematica}
//             style={[
//               styles.categoriaButton,
//               {
//                 backgroundColor: categoriaSeleccionada === categoria.tematica
//                     ? colors.categoriaButtonSeleccionado
//                     : colors.categoriaButton,
//               },
//             ]}
//             onPress={() => handleCategoriaPress(categoria.tematica)}
//           >
//             <Text style={{ color: categoriaSeleccionada === categoria.tematica ? colors.textLight : colors.textDark }}>
//               {categoria.tematica}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <TouchableOpacity style={[styles.arrowButtonRight, { right: 0, backgroundColor: colors.categoriaButton }]} onPress={() => scrollTo("right")}>
//         <Icon name="chevron-right" size={20} color={colors.textDark} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   categoriasWrapper: {
//     paddingHorizontal: 10,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   categoriasContainer: {
//     flexDirection: "row",
//   },
//   categoriasInnerContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 10,
//   },
//   categoriaButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   arrowButtonLeft: {
//     top: "25%",
//     marginRight: 10,
//     transform: [{ translateY: -15 }],
//     zIndex: 1,
//     padding: 10,
//     borderRadius: 50,
//   },
//   arrowButtonRight: {
//     top: "25%",
//     marginLeft: 10,
//     transform: [{ translateY: -15 }],
//     zIndex: 1,
//     padding: 10,
//     borderRadius: 50,
//   },
// });

import React, { useEffect, useState, useRef } from "react";
import { ScrollView, TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";
import { useThemeColors } from "../componentes/Tema";
import Icon from "react-native-vector-icons/FontAwesome";
import cargandoGif from "../../assets/animacion_cargando.gif";
import { API_URL } from "../../config";

export default function FiltroCategorias({ onSelectCategoria }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const colors = useThemeColors();

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
        <Image source={cargandoGif} />
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
          style={[styles.arrowButtonLeft, { left: 0, backgroundColor: canScrollLeft ? colors.categoriaButton : colors.buttonArrowDesactivado }]}
          onPress={() => scrollTo("left")}
          disabled={!canScrollLeft}
        >
          <Icon name="chevron-left" size={20} color={canScrollLeft ? colors.iconArrow : colors.iconArrowDesactivado} />
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
              },
            ]}
            onPress={() => handleCategoriaPress(categoria.tematica)}
          >
            <Text
              style={{
                color: categoriaSeleccionada === categoria.tematica ? colors.textLight : colors.textDark,
              }}
            >
              {categoria.tematica}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {categorias.length > 3 && (
        <TouchableOpacity
          style={[styles.arrowButtonRight, { right: 0, backgroundColor: canScrollRight ? colors.categoriaButton : colors.buttonArrowDesactivado }]}
          onPress={() => scrollTo("right")}
          disabled={!canScrollRight}
        >
          <Icon name="chevron-right" size={20} color={canScrollRight ? colors.iconArrow : colors.iconArrowDesactivado} />
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
