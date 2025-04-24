/**
 * Archivo: Favoritos.js
 * Descripción: Pantalla que muestra los libros favoritos del usuario.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import BuscadorLibrosLista from '../componentes/BuscadorLibrosLista';
import { useThemeColors } from "../componentes/Tema";
import { useColorScheme } from "react-native";
import cargandoModoOscuro from "../../assets/animacion_cargando_modo_oscuro.gif";
import cargandoModoClaro from "../../assets/animacion_cargando_modo_claro.gif";
import { API_URL } from "../../config";


export default function Favoritos({ correoUsuario }) {
   const [librosFavoritos, setLibrosFavoritos] = useState([]);
   const [librosFavoritosFiltrados, setLibrosFavoritosFiltrados] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const navigation = useNavigation();
   const colors = useThemeColors();
   const theme = useColorScheme();

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
         const url = `${API_URL}/listas/favoritos/${encodeURIComponent(correoUsuario)}`;
         const respuesta = await fetch(url);

         const textoRespuesta = await respuesta.text(); // Leer la respuesta como texto primero

         // Verificar si la respuesta es JSON antes de intentar parsearla
         if (textoRespuesta.startsWith("{") || textoRespuesta.startsWith("[")) {
            const datos = JSON.parse(textoRespuesta); // Convertir en JSON si es válido

            if (Array.isArray(datos)) {
               // Cargar detalles de cada libro
               // const librosConDetalles = await Promise.all(
               //    datos.map(async (libro) => {
               //       const detalles = await obtenerDetallesLibro(libro.enlace_libro);
               //       return detalles ? { ...libro, ...detalles } : libro;
               //    })
               // );
               // setLibrosFavoritos(librosConDetalles);

               // Primero, asigna la lista básica a los favoritos
               setLibrosFavoritos(datos);
               // Luego, para cada libro, obtener los detalles de forma individual
               datos.forEach(async (libro) => {
                  const detalles = await obtenerDetallesLibro(libro.enlace_libro);
                  if (detalles) {
                     // Actualiza el libro correspondiente en el estado
                     setLibrosFavoritos((prevLibros) =>
                        prevLibros.map((item) =>
                           item.enlace_libro === libro.enlace_libro
                              ? { ...item, ...detalles }
                              : item
                        )
                     );
                  }
               });

            } else {
               console.warn("La respuesta no es una lista de libros:", datos);
               setLibrosFavoritos([]); // Si no es un array, dejar la lista vacía
            }
         }
      } catch (error) {
         console.error('Error al obtener los enlaces de los libros favoritos:', error);
         setLibrosFavoritos([]); // En caso de fallo, dejar la lista vacía
      } finally {
         // Forza un retardo mínimo para mostrar el gif (500 ms en este ejemplo)
         setTimeout(() => setIsLoading(false), 500);
      }
   };

   useFocusEffect(
      useCallback(() => {
         obtenerFavoritos();
      }, [correoUsuario])
   );

   useFocusEffect(
      useCallback(() => {
         setLibrosFavoritosFiltrados(librosFavoritos);
      }, [librosFavoritos])
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

         <BuscadorLibrosLista setLibros={setLibrosFavoritosFiltrados} libros={librosFavoritos} />

         {isLoading ? (
            <View style={styles.loadingContainer}>
               <Image source={theme === 'dark' ? cargandoModoOscuro : cargandoModoClaro} style={styles.loadingImage}/>
               <Text style={{ color: colors.text, marginTop: 10 }}>Cargando...</Text>
            </View>
         ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
               <View style={styles.grid}>
                  {librosFavoritosFiltrados.length > 0 ? (
                     librosFavoritosFiltrados.map((libro, index) => (
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
         )}
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
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
   },
   loadingImage: {
      width: 160,
      height: 160
   },
});