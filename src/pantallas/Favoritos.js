// Favoritos.js

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import DetallesLibro  from '../componentes/DetallesLibro';

export default function Favoritos() {
    const [librosFavoritos, setLibrosFavoritos] = useState([]);
    const navigation = useNavigation();

    // Obtener libros favoritos del backend
    const obtenerFavoritos = async () => {
      try {
          const respuesta = await fetch('http://10.0.2.2:3000/api/listas/favoritos/amador@gmail.com');
          const datos = await respuesta.json();
          setLibrosFavoritos(datos);
      } catch (error) {
          console.error('Error al obtener libros favoritos:', error);
      }
    };

    // Eliminar libro de favoritos
    const eliminarDeFavoritos = async (enlaceLibro) => {
        try {
          const respuesta = await fetch('http://10.0.2.2:3000/api/listas/favoritos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuario_id: 'amador@gmail.com',
              enlace_libro: enlaceLibro,
            }),
          });
          if (respuesta.ok) {
            Alert.alert('Éxito', 'Libro eliminado de favoritos');
            obtenerFavoritos(); // Actualiza la lista tras eliminar
          } else {
            Alert.alert('Error', 'No se pudo eliminar el libro');
          }
        } catch (error) {
          console.error('Error al eliminar libro:', error);
        }
    };

    const verDetallesLibro = (libro) => {
      navigation.navigate("DetallesLibro", { libro });
    };

    useEffect(() => {
        obtenerFavoritos();
    }, []);

    return (
      <View style={{ flex: 1 }}>
          <Encabezado titulo="Mis Favoritos" />
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.grid}>
                {librosFavoritos.length > 0 ? (
                    librosFavoritos.map((libro, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.libroContainer}
                            onPress={() => verDetallesLibro(libro)}
                            onLongPress={() =>
                                Alert.alert(
                                    'Eliminar libro',
                                    '¿Estás seguro de que deseas eliminar este libro de favoritos?',
                                    [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { text: 'Eliminar', onPress: () => eliminarDeFavoritos(libro.enlace_libro) },
                                    ]
                                )
                            }
                        >
                            <Image
                              source={{ uri: libro.enlace_libro }}
                              style={styles.imagenLibro}
                            />
                            <Text style={styles.nombreLibro}>{libro.titulo}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.textoVacio}>No tienes libros favoritos aún.</Text>
                )}
            </View>
          </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  libroContainer: { width: '47%', marginBottom: 20, alignItems: 'center' },
  imagenLibro: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10, borderWidth: 1, borderColor: '#ccc' },
  nombreLibro: { marginTop: 8, textAlign: 'center', fontSize: 14 },
  textoVacio: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});
