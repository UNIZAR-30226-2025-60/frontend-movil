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
      numColumns={2}
      contentContainerStyle={styles.container}

    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagen_portada_libro: {
    width: 100,
    height: 150,
    marginBottom: 5,
  },
  bookTitle: {
    textAlign: 'center',
    width: 100,
    marginTop: 5,
  },
});
