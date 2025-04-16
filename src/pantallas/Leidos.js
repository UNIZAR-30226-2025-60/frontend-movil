// Leidos.js

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import BuscadorLibrosLista from '../componentes/BuscadorLibrosLista';
import { useThemeColors } from "../componentes/Tema";
import cargandoGif from "../../assets/animacion_cargando.gif";
import { API_URL } from "../../config";

export default function Leidos({ correoUsuario }) {
   const [librosLeidos, setLibrosLeidos] = useState([]);
   const [librosLeidosFiltrados, setLibrosLeidosFiltrados] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const navigation = useNavigation();
   const colors = useThemeColors();


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
         console.error("Error al obtener detalles del libro:", error);
         return null;
      }
   };

   const obtenerLeidos = async () => {
      try {
         const respuestaLeidos = await fetch(`${API_URL}/libros/leidos/${correoUsuario}`);
         if (!respuestaLeidos.ok) {
            console.error("Error al obtener los libros leidos del usuario");
            setLibrosLeidos([]);
            setIsLoading(false);
            return;
         }

         const data = await respuestaLeidos.json();

         // const libros = await Promise.all(
         //    data.map(async (libro) => {
         //       const detalles = await obtenerDetallesLibro(libro.enlace_libro);
         //       return detalles ? { ...libro, ...detalles } : libro;
         //    })
         // );
         // setLibrosLeidos(libros);

         // Primero, asigna la lista básica (sin detalles)
         setLibrosLeidos(data);
         // Luego, para cada libro, solicita los detalles de forma individual y actualiza el estado
         data.forEach(async (libro) => {
            const detalles = await obtenerDetallesLibro(libro.enlace_libro);
            if (detalles) {
               setLibrosLeidos((prevLibros) =>
                  prevLibros.map((item) =>
                     item.enlace_libro === libro.enlace_libro
                        ? { ...item, ...detalles }
                        : item
                  )
               );
            }
         });

      } catch (error) {
         console.error("Error al obtener los libros leídos:", error);
         setLibrosLeidos([]);
      } finally {
         // Forza un retardo mínimo para mostrar el gif (500 ms en este ejemplo)
         setTimeout(() => setIsLoading(false), 500);
      }
   };

   useFocusEffect(
      useCallback(() => {
         obtenerLeidos();
      }, [correoUsuario])
   );

   useFocusEffect(
      useCallback(() => {
         setLibrosLeidosFiltrados(librosLeidos);
      }, [librosLeidos])
   );

   useEffect(() => {
      obtenerLeidos();
   }, []);

   const verDetallesLibro = (libro) => {
      navigation.navigate("Detalles", { libro });
   };

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <Encabezado titulo="Leídos" correoUsuario={correoUsuario} />

         <BuscadorLibrosLista setLibros={setLibrosLeidosFiltrados} libros={librosLeidos} />

         {isLoading ? (
            <View style={styles.loadingContainer}>
               {/* Se muestra el gif de carga importado */}
               <Image source={cargandoGif} style={styles.loadingImage} />
               <Text style={{ color: colors.text, marginTop: 10 }}>Cargando...</Text>
            </View>
         ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
               <View style={styles.grid}>
                  {librosLeidosFiltrados.length > 0 ? (
                     librosLeidosFiltrados.map((libro, index) => (
                        <TouchableOpacity
                           key={index}
                           style={styles.libroContainer}
                           onPress={() => verDetallesLibro(libro)}
                        >
                           <Image
                              source={{ uri: libro.imagen_portada }}
                              style={styles.imagenLibro}
                           />
                           <Text style={[styles.nombreLibro, { color: colors.text }]}>
                              {libro.nombre || 'Título no disponible'}
                           </Text>
                        </TouchableOpacity>
                     ))
                  ) : (
                     <Text style={[styles.textoVacio, { color: colors.text }]}>
                        No se encontraron libros leídos
                     </Text>
                  )}
               </View>
            </ScrollView>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   scrollContainer: { flexGrow: 1, padding: 16 },
   grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
   libroContainer: { width: '47%', marginBottom: 20, alignItems: 'center' },
   imagenLibro: { width: 100, height: 150, marginBottom: 5 },
   nombreLibro: { marginTop: 8, textAlign: 'center', fontSize: 14 },
   textoVacio: { fontSize: 16, textAlign: 'center', marginTop: 20 },
   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
   loadingImage: { width: 160, height: 160 },
});
