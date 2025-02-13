import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useEffect, useState } from "react";


export default function App() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    getLibros().then((libros) => {
      setLibros(libros);
    });
  }, []);

  const getLibros = async () => {
    try {
      console.log("Antes de hacer la consulta");
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
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {libros.map(libro => (
          <View> 
            <Image
              source={{ uri: libro.imagen_portada }}
              style={styles.imagen_portada_libro}
            />
            <Text>{libro.nombre}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
    height: 200,
    borderRadius: 10,
  },
});
