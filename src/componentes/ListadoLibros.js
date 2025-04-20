/**
 * Archivo: ListadoLibros.js
 * Descripción: Componente que muestra una lista de libros.
 * Contenido:
 *  - Muestra la portada y el título de cada libro
 *  - Permite navegar a la pantalla de detalles del libro
 */

import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "./Tema";
import { useColorScheme } from "react-native";
import cargandoModoOscuro from "../../assets/animacion_cargando_modo_oscuro.gif";
import cargandoModoClaro from "../../assets/animacion_cargando_modo_claro.gif";

export default function ListadoLibros({ libros }) {
   const navigation = useNavigation();
   const colors = useThemeColors();
   const theme = useColorScheme();

   if (!libros || libros.length === 0) {
      return (
         // <View style={styles.noResultadosContainer}>
         //    <Text style={[styles.noResultadosText, { color: colors.text }]}>No se encontraron libros</Text>
         // </View>
         <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.text }}>Cargando libros...</Text>
            <Image source={theme === 'dark' ? cargandoModoOscuro : cargandoModoClaro} style={styles.loadingImage}/>
        </View>
      );
   }

   // MemoizedLibro: Componente memoizado que representa un solo libro en la lista.
   // React.memo evita renders innecesarios si las props no cambian.
   // Esto mejora el rendimiento cuando se renderizan muchos elementos en una FlatList.
   const MemoizedLibro = React.memo(({ item }) => (
      <View style={[styles.itemContainer, { backgroundColor: colors.background }]}>
         {/* Cuando se toca el libro, navega a la pantalla de Detalles pasando el objeto 'item' */}
         <TouchableOpacity
            onPress={() => navigation.navigate("Detalles", { libro: item })}
            style={styles.bookTouchable}
         >

            {/* Muestra la imagen de portada del libro */}
            <Image
               source={{ uri: item.imagen_portada }}
               style={styles.imagen_portada_libro}
            />

            {/* Muestra el nombre del libro debajo de la imagen */}
            <Text style={[styles.bookTitle, { color: colors.text }]}>
               {item.nombre}
            </Text>
         </TouchableOpacity>
      </View>
   ));

   // 📌 renderItem: Función que se pasa a la FlatList para renderizar cada libro.
   // En lugar de recrear el componente, se usa el memoizado para mayor eficiencia.
   const renderItem = ({ item }) => <MemoizedLibro item={item} />;

   return (
      <FlatList
         data={libros}
         renderItem={renderItem}
         keyExtractor={(item) => item.enlace}
         numColumns={2}
         initialNumToRender={6}           // Cuántos ítems renderizar al principio
         maxToRenderPerBatch={8}          // Cuántos ítems renderiza por "batch"
         windowSize={5}                   // Tamaño del buffer (ventana)
         removeClippedSubviews={true}     // Evita render fuera de viewport
         contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      />
   );
}

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      paddingTop: 20,
      paddingBottom: 200,
   },
   itemContainer: {
      width: '48%',  // flex: 1,  OBLIGO MANUALMENTE A QUE OCUPE LA MITAD DE LA PANTALLA
      minHeight: 220, // Asegura que todas las filas tengan la misma altura
      margin: 5,
      alignItems: 'center',
      justifyContent: 'flex-start', // Alinea los elementos dentro de cada celda
   },
   bookTouchable: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 120, // Mantiene la alineación de las columnas
   },
   imagen_portada_libro: {
      width: 100,
      height: 150,
      marginBottom: 5,
   },
   bookTitle: {
      textAlign: "center",
      flexWrap: "wrap",
      width: 100, // Evita que el texto sobresalga
   },
   noResultadosText: {
      textAlign: "center",
      marginTop: 50,
   },
   modalContainer: {
      flexGrow: 1,
      paddingTop: 20,
      paddingBottom: 200,
      justifyContent: 'center',
      alignItems: 'center',
   },
   loadingImage: {
      width: 160,
      height: 160,
   },
});
