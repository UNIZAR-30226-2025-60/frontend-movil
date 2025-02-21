// Favoritos.js

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import DetallesLibro  from '../componentes/DetallesLibro';

export default function Favoritos() {
    const [librosFavoritos, setLibrosFavoritos] = useState([]);
    const navigation = useNavigation();

    // Obtener detalles del libro a partir de su enlace
    const obtenerDetallesLibro = async (enlaceLibro) => {
      try {
        const enlaceCodificado = encodeURIComponent(enlaceLibro);
        const respuesta = await fetch(`http://10.0.2.2:3000/api/libros/libro/${enlaceCodificado}`);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          return datos;
        }
        return null;
      } catch (error) {
        console.error(`Error al obtener detalles del libro: ${enlaceLibro}`, error);
        return null;
      }
    };

    const obtenerFavoritos = async () => {
      try {
        const respuesta = await fetch('http://10.0.2.2:3000/api/listas/favoritos/amador@gmail.com');
        const datos = await respuesta.json();
  
        // Obtener los detalles de cada libro y guardarlos en librosFavoritos
        const librosConDetalles = await Promise.all(
          datos.map(async (libro) => {
            const detalles = await obtenerDetallesLibro(libro.enlace_libro);
            return detalles ? { ...libro, ...detalles } : libro;
          })
        );
        setLibrosFavoritos(librosConDetalles);
      } catch (error) {
        console.error('Error al obtener los enlaces de los libros favoritos:', error);
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
            //obtenerFavoritos(); // Actualiza la lista tras eliminar
            setLibrosFavoritos((prevLibros) =>
              prevLibros.filter((libro) => libro.enlace_libro !== enlaceLibro)
            );
          } else {
            Alert.alert('Error', 'No se pudo eliminar el libro');
          }
        } catch (error) {
          console.error('Error al eliminar libro:', error);
        }
    };

    useFocusEffect(
      useCallback(() => {
        obtenerFavoritos();
      }, [])
    );

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
                        >
                            <Image 
                              source={{ uri: libro.imagen_portada }}
                              style={styles.imagenLibro} 
                            />
                            <Text style={styles.nombreLibro}>{libro.nombre || 'Título no disponible'}</Text>
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
  imagenLibro: { 
    width: 100,
    height: 150,
    marginBottom: 5, 
  },
  nombreLibro: { marginTop: 8, textAlign: 'center', fontSize: 14 },
  textoVacio: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});
