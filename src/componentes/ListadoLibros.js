import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
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
      const response = await fetch("http://localhost:3000/api/libros");
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


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {libros.map(libro => (
        <View key={libro.enlace}> 
          <TouchableOpacity onPress={() => navigation.navigate("detalles", { libro })}>
            <Image 
              source={{ uri: libro.imagen_portada }}
              style={styles.imagen_portada_libro} />
          </TouchableOpacity>
          <Text>{libro.nombre}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  imagen_portada_libro: {
    width: 100,
    height: 150,
    marginBottom: 10,
  },
});
