/**
 * Archivo: LibrosDeLista.js
 * Descripción: Pantalla que muestra los libros de una lista específica.
 * Contenido:
 *  - Obtiene y muestra libros de una lista seleccionada
 *  - Permite navegar a los detalles de un libro
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado'; // ???????????????????????????????????????????????????????????????????????
import ListadoLibros from '../componentes/ListadoLibros';
import { useThemeColors } from "../componentes/Tema";

export default function LibrosDeLista({ correoUsuario, tituloProp }) {
  const route = useRoute();
  const navigation = useNavigation();
  const colors = useThemeColors();

  const { nombreLista, descripcionLista, esPublica } = route.params;
  const finalUrl = `http://10.0.2.2:3000/api/listas/${encodeURIComponent(correoUsuario)}/${encodeURIComponent(nombreLista)}/libros`;
  const finalTitulo = tituloProp || nombreLista || 'Lista de Libros';
  

  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (finalUrl) {
        obtenerLibros();
      }
    }, [finalUrl])
  );

  // Función que obtiene la lista de libros
  const obtenerLibros = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(finalUrl);
      const textoRespuesta = await respuesta.text();

      if (!respuesta.ok) {
        setLibros([]);
        return;
      }

      const datos = JSON.parse(textoRespuesta); // [{ enlace_libro, nombre_lista }, ... ]
      
      const librosConDetalles = await Promise.all(
        datos.map(async (libro) => {
          const detalles = await obtenerDetallesLibro(libro.enlace_libro);
          // Devuelve todo mezclado
          return detalles 
            ? { ...libro, ...detalles }
            : libro;
        })
      );
      
      setLibros(librosConDetalles);
    } catch (error) {
      console.error('Error al obtener libros:', error);
      setLibros([]);
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener detalles individuales
  const obtenerDetallesLibro = async (enlaceLibro) => {
    try {
      const enlaceCodificado = encodeURIComponent(enlaceLibro);
      const respuesta = await fetch(`http://10.0.2.2:3000/api/libros/libro/${enlaceCodificado}`);
      if (respuesta.ok) {
        return await respuesta.json(); 
      }
      return null;
    } catch (error) {
      console.error("Error al obtener detalles del libro:", error);
      return null;
    }
  };

  const verDetallesLibro = (libro) => {
    navigation.navigate("Detalles", { libro });
  };

  if (cargando) {
    return <ActivityIndicator size="large" color={colors.icon} style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>

      {/* Encabezado de lista, tipo banner */}
      <View style={styles.headerLista}>
        <Text style={styles.tituloLista}>{nombreLista || 'Título de la lista'}</Text>

        {/* Usa la descripción real o un fallback */}
        <Text style={styles.descripcionLista}>
          {descripcionLista?.trim() || 'Sin descripción'}
        </Text>

        {/* Muestra "Pública" o "Privada" según el valor booleano */}
        <Text style={styles.privacidad}>
          {esPublica ? 'Pública' : 'Privada'}
        </Text>
      </View>

      {/** Aquí usamos el componente reutilizable */}
      <ListadoLibros libros={libros} onPressLibro={verDetallesLibro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagen_portada_libro: { width: 100, height: 150, marginBottom: 5 },
  bookTitle: { textAlign: 'center', width: 100, marginTop: 5, fontSize: 14 },
  backButton: {
    padding: 10,
    margin: 10,
    backgroundColor: '#ddd',
    alignSelf: 'flex-start',
    borderRadius: 5,
  },
  headerLista: {
    backgroundColor: '#f2f2f2', // color de fondo gris claro
    padding: 16,                // espacio interno
    marginHorizontal: 8,        // márgenes laterales
    marginBottom: 16,           // espacio debajo
    borderRadius: 8,            // esquinas redondeadas
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descripcionLista: {
    fontSize: 14,
    marginBottom: 2,
  },
  privacidad: {
    fontSize: 12,
    color: '#888',
  },
});