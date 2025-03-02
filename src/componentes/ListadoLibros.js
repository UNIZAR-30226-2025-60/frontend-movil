/**
 * Archivo: ListadoLibros.js
 * Descripción: Componente que muestra una lista de libros.
 * Contenido:
 *  - Obtiene los libros desde el backend
 *  - Muestra la portada y el título de cada libro
 *  - Permite navegar a la pantalla de detalles del libro
 */

import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "./Tema";

export default function ListadoLibros({ libros }) {
  const navigation = useNavigation();
  const colors = useThemeColors();

  if (!libros || libros.length === 0) {
    return (
      <View style={styles.noResultadosContainer}>
        <Text style={[styles.noResultadosText, { color: colors.text }]}>No se encontraron libros.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        onPress={() => navigation.navigate("Detalles", { libro: item })} 
        style={styles.bookTouchable}
      >
        <Image 
          source={{ uri: item.imagen_portada }}
          style={styles.imagen_portada_libro} 
        />
        <Text style={[styles.bookTitle, { color: colors.text }]}>
          {item.nombre}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList 
      data={libros}
      renderItem={renderItem}
      keyExtractor={(item) => item.enlace}
      numColumns={2}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  itemContainer: {
    flex: 1, // Hace que las celdas de cada fila tengan el mismo tamaño
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
  }
});
