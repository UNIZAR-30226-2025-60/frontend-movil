/**
 * Archivo: LibrosDeLista.js
 * Descripción: Pantalla que muestra los libros de una lista específica.
 * Contenido:
 *  - Obtiene y muestra libros de una lista seleccionada
 *  - Permite navegar a los detalles de un libro
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import { Ionicons } from 'react-native-vector-icons';
import ListadoLibros from '../componentes/ListadoLibros';
import { API_URL } from '../../config';

export default function LibrosDeLista({ correoUsuario, tituloProp }) {
  const route = useRoute(); // Accede a los parámetros pasados por navegación
  const navigation = useNavigation(); // Para navegar entre pantallas
  const colors = useThemeColors();  // Colores personalizados según el tema

  // Extraemos los datos que se pasaron como parámetros a la pantalla
  const { url, nombreLista, descripcionLista, esPublica } = route.params;
  const finalUrl = url;

  const [libros, setLibros] = useState([]); // Lista de libros
  const [cargando, setCargando] = useState(true); // Estado de carga

  // Cada vez que la pantalla se enfoca, se vuelve a obtener la lista de libros
  useFocusEffect(
    useCallback(() => {
      if (finalUrl) {
        obtenerLibros();
      }
    }, [finalUrl])
  );

  // 📌 Función que obtiene los libros de la lista desde la API
  const obtenerLibros = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(finalUrl);
      const textoRespuesta = await respuesta.text();

      if (!respuesta.ok) {
        setLibros([]);
        return;
      }

      const datos = JSON.parse(textoRespuesta);
    
      // 🔁 Obtener detalles de cada libro usando el enlace
      const librosDetallados = await Promise.all(
        datos.map(async (item) => {
          const enlaceCodificado = encodeURIComponent(item.enlace_libro);
          const detalle = await fetch(`${API_URL}/libros/libro/${enlaceCodificado}`);
          if (detalle.ok) {
            return await detalle.json();
          } else {
            return null;
          }
        })
      );

      // 📌 Filtrar los que fallaron
      const filtrados = librosDetallados.filter((libro) => libro !== null);
      setLibros(filtrados);

    } catch (error) {
      console.error('Error al obtener libros:', error);
      setLibros([]);
    } finally {
      setCargando(false);
    }
  };

  // 📌 Obtiene los detalles de un libro individual desde la API
  const obtenerDetallesLibro = async (enlaceLibro) => {
    try {
      const enlaceCodificado = encodeURIComponent(enlaceLibro);
      const respuesta = await fetch(`${API_URL}/libros/libro/${enlaceCodificado}`);
      if (respuesta.ok) {
        return await respuesta.json(); 
      }
      return null;
    } catch (error) {
      console.error("Error al obtener detalles del libro:", error);
      return null;
    }
  };

  // 📌 Navega a la pantalla de detalles del libro
  const verDetallesLibro = (libro) => {
    navigation.navigate("Detalles", { libro });
  };

  // Si los datos están cargando, muestra un spinner
  if (cargando) {
    return <ActivityIndicator size="large" color={colors.icon} style={{ marginTop: 20 }} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 📌 Encabezado de la lista */}
      <View style={[styles.headerLista, { backgroundColor: colors.backgroundSubtitle }]}>
        <Text style={[styles.tituloLista, { color: colors.text }]}>{nombreLista || 'Título de la lista'}</Text>
        <Text style={[styles.descripcionLista, { color: colors.text }]}>{descripcionLista?.trim() || 'Sin descripción'}</Text>
        {esPublica ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name='lock-open'
              size={15}
              color={ colors.textSecondary }
            />
            <Text style={[styles.privacidad, { color: colors.textSecondary }]}>Pública</Text>
          </View>  
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name='lock-closed'
              size={15}
              color={ colors.textSecondary }
            />
            <Text style={[styles.privacidad, { color: colors.textSecondary }]}>Privada</Text>
          </View> 
        )}

        
      </View>

      {/* 📌 Componente que muestra los libros en forma de lista */}
      <ListadoLibros libros={libros} onPressLibro={verDetallesLibro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 5
  },
  bookTitle: {
    textAlign: 'center',
    width: 100,
    marginTop: 5,
    fontSize: 14
  },
  headerLista: {
    padding: 16,                // espacio interno
    marginHorizontal: 10,        // márgenes laterales
    marginVertical: 10,
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
  },
});