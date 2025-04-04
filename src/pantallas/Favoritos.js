/**
 * Archivo: Favoritos.js
 * Descripción: Pantalla que muestra los libros favoritos del usuario.
 * Contenido:
 *  - Obtiene y muestra los libros guardados en "Mis Favoritos"
 *  - Permite navegar a los detalles de un libro
 *  - Posibilita eliminar libros de la lista de favoritos
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import DetallesLibro  from '../pantallas/DetallesLibro';
import { useThemeColors } from "../componentes/Tema";
import { API_URL } from "../../config";


export default function Favoritos({ correoUsuario }) {
    const [librosFavoritos, setLibrosFavoritos] = useState([]);
    const navigation = useNavigation();
    const colors = useThemeColors();

    // 📌 Función para obtener detalles del libro a partir de su enlace
    const obtenerDetallesLibro = async (enlaceLibro) => {
      try {
        const enlaceCodificado = encodeURIComponent(enlaceLibro);
        const respuesta = await fetch(`${API_URL}/libros/libro/${enlaceCodificado}`);
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

    // 📌 Función para obtener favoritos para 'correoUsuario'
    const obtenerFavoritos = async () => {
      try {
        const url = `http://10.0.2.2:3000/api/listas/favoritos/${encodeURIComponent(correoUsuario)}`;
        const respuesta = await fetch(url);
    
        const textoRespuesta = await respuesta.text(); // Leer la respuesta como texto primero
    
        // Verificar si la respuesta es JSON antes de intentar parsearla
        if (textoRespuesta.startsWith("{") || textoRespuesta.startsWith("[")) {
          const datos = JSON.parse(textoRespuesta); // Convertir en JSON si es válido
    
          if (Array.isArray(datos)) {
            // Cargar detalles de cada libro
            const librosConDetalles = await Promise.all(
              datos.map(async (libro) => {
                const detalles = await obtenerDetallesLibro(libro.enlace_libro);
                return detalles ? { ...libro, ...detalles } : libro;
              })
            );
            setLibrosFavoritos(librosConDetalles);
          } else {
            console.warn("La respuesta no es una lista de libros:", datos);
            setLibrosFavoritos([]); // Si no es un array, dejar la lista vacía
          }
        }
      } catch (error) {
        console.error('Error al obtener los enlaces de los libros favoritos:', error);
        setLibrosFavoritos([]); // En caso de fallo, dejar la lista vacía
      }
    };

    // 📌 Función para eliminar libro favorito también usando 'correoUsuario'
    const eliminarDeFavoritos = async (enlaceLibro) => {
        try {
          const respuesta = await fetch(`${API_URL}/listas/favoritos`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuario_id: correoUsuario,
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
      }, [correoUsuario])
    );

    const verDetallesLibro = (libro) => {
      navigation.navigate("Detalles", { libro });
    };

    useEffect(() => {
        obtenerFavoritos();
    }, []);

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Encabezado titulo="Mis Favoritos" correoUsuario={correoUsuario} />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                            <Text style={[styles.nombreLibro, { color: colors.text }]}>{libro.nombre || 'Título no disponible'}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={[styles.textoVacio, { color: colors.text }]}>No se encontraron libros en favoritos</Text>
                )}
            </View>
          </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollContainer: { 
    flexGrow: 1, 
    padding: 16 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  libroContainer: { 
    width: '47%', 
    marginBottom: 20, 
    alignItems: 'center' 
  },
  imagenLibro: { 
    width: 100,
    height: 150,
    marginBottom: 5, 
  },
  nombreLibro: { 
    marginTop: 8, 
    textAlign: 'center', 
    fontSize: 14 
  },
  textoVacio: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginTop: 20 
  },
});
