// ListadoLibros.js
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';

export default function ListadoLibros() {
  const [libros, setLibros] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getLibros().then(setLibros);
  }, []);

  const getLibros = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/api/libros");
      if (!response.ok) {
        throw new Error("Error al obtener libros" + response.error);
      }
      const data = await response.json();
      return data;
    } catch(error) {
      console.error(error);
      return [];
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Detalles", { libro: item })}>
        <Image 
          source={{ uri: item.imagen_portada }}
          style={styles.imagen_portada_libro} 
        />
        <Text style={styles.bookTitle}>{item.nombre}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList 
      data={libros}
      renderItem={renderItem}
      keyExtractor={(item) => item.enlace}
      numColumns={2}  // Mantenemos 2 columnas
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center', // Alinea cada item al centro de su contenedor
    justifyContent: 'center',
  },
  imagen_portada_libro: {
    width: 100,  // Establece el tamaño de la imagen a 100px
    height: 150,  // Establece el tamaño de la imagen a 150px
    marginBottom: 5,
  },
  bookTitle: {
    textAlign: 'center',  // Centra el texto
    fontSize: 16,
    width: 100,  // Asegura que el texto tenga el mismo ancho que la imagen
    marginTop: 5,  // Espacio entre la imagen y el título
  },
});
