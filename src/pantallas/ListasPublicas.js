/**
 * Archivo: ListasPublicas.js
 * Descripción: Muestra una galería de listas públicas creadas por mí y por otros usuarios.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../componentes/Tema';
import { useColorScheme } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cargandoModoOscuro from "../../assets/animacion_cargando_modo_oscuro.gif";
import cargandoModoClaro from "../../assets/animacion_cargando_modo_claro.gif";
import Encabezado from '../componentes/Encabezado';

import { API_URL } from '../../config';

const convertirDriveLink = (url) => {
   if (!url) return null;
   if (url.includes("uc?id=")) return url;
   const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
   if (match) {
      const fileId = match[1];
      return `https://drive.google.com/uc?id=${fileId}`;
   }
   return url;
};

/**
 * Pantalla para mostrar todas las listas públicas existentes en el sistema.
 */
export default function ListasPublicas({ correoUsuario }) {
   const [listasPublicas, setListasPublicas] = useState([]); // Listado de listas públicas
   const [isLoading, setIsLoading] = useState(true); // Estado de carga

   const navigation = useNavigation();
   const colors = useThemeColors();
   const theme = useColorScheme();

   // Se ejecuta cada vez que se enfoca la pantalla
   useFocusEffect(
      useCallback(() => {
         obtenerListasPublicas();
      }, [])
   );

   /**
    * 📌 Llama al backend para traer todas las listas públicas.
    */
   const obtenerListasPublicas = async () => {
      setIsLoading(true);
      try {
         const respuesta = await fetch(`${API_URL}/listas/publicas`);
         if (!respuesta.ok) {
            // Por ejemplo, si no hay listas públicas o si ocurre un error:
            const textoError = await respuesta.text();
            console.warn('Error al obtener listas públicas:', textoError);
            setListasPublicas([]);  // Deja la lista vacía
         } else {
            const datos = await respuesta.json();
            const listasConPortada = datos.map(lista => ({
               ...lista,
               portada: convertirDriveLink(lista.portada)
            }));
            setListasPublicas(listasConPortada);
         }
      } catch (error) {
         console.error('Error al obtener las listas públicas:', error);
         setListasPublicas([]);
      } finally {
         setIsLoading(false);
      }
   };

   /**
    * 📌 Navega a la pantalla "LibrosDeLista" con los datos de la lista seleccionada.
    */
   const manejarListaPress = (lista) => {
      // Aquí necesitas el usuario_id y el nombre de la lista
      // para armar la ruta y/o params que usas en "LibrosDeListaScreen"
      navigation.navigate('LibrosDeListaScreen', {
         nombreLista: lista.nombre,
         descripcionLista: lista.descripcion,
         usuarioId: lista.usuario_id,
         esPublica: true,
         portada: lista.portada,
         // Por ejemplo, puedes pasar la URL ya formada:
         url: `${API_URL}/listas/${encodeURIComponent(lista.usuario_id)}/${encodeURIComponent(lista.nombre)}/libros`,
      });
   };

   /**
    * 📌 Renderiza cada elemento de la lista pública como una tarjeta.
    */
   const renderItem = ({ item }) => {
      return (
         <View style={[styles.itemContainer, { backgroundColor: colors.background, borderColor: colors.borderLista }]}>
            <TouchableOpacity
               style={styles.listaContenido}
               onPress={() => manejarListaPress(item)}
            >
               {/* Si hay portada, la muestra; si no, muestra un ícono */}
               {item.portada ? (
                  <Image
                     source={{ uri: item.portada }}
                     style={styles.listaImagen}
                  />
               ) : (
                  <Ionicons name="book-outline" size={70} color={colors.icon} />
               )}

               <Text style={[styles.nombreLista, { color: colors.text }]}>
                  {item.nombre.length > 36 ? `${item.nombre.substring(0, 36)}...` : item.nombre}
               </Text>

            </TouchableOpacity>
         </View>
      );
   };

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
         {/* 📌 Encabezado superior de la pantalla */}
         <Encabezado titulo="Listas Públicas" correoUsuario={correoUsuario} />

         {/* 📌 Muestra un texto de carga mientras se obtienen los datos */}
         {isLoading ? (
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
               <Text style={{ color: colors.text }}>Cargando...</Text>
               <Image source={theme === 'dark' ? cargandoModoOscuro : cargandoModoClaro} style={styles.loadingImage}/>
            </View>
            // <Text style={{ margin: 20, color: colors.text }}>Cargando...</Text>
         ) : (
            <FlatList
               data={listasPublicas}
               keyExtractor={(item, index) =>
                  `${item.usuario_id}-${item.nombre}-${index}`
               }
               renderItem={renderItem}
               numColumns={2}
               contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
               ListEmptyComponent={
                  <Text style={[styles.textoVacio, { color: colors.text }]}>
                     No hay listas públicas disponibles.
                  </Text>
               }
            />
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      padding: 16
   },
   itemContainer: {
      width: '48%',
      margin: 5,
      height: 160,
      borderRadius: 10,
      borderWidth: 1,
      overflow: 'hidden'
   },
   listaContenido: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
   },
   listaImagen: {
      width: 100,
      height: 100,
      borderRadius: 5,
      resizeMode: 'cover',
   },
   nombreLista: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: 14
   },
   usuarioLista: {
      fontSize: 12,
   },
   textoVacio: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: 16,
   },
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },  
   loadingImage: {
      width: 160,
      height: 160,
   },
});
