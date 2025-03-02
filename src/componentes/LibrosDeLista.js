/**
 * Archivo: LibrosDeLista.js
 * Descripción: Pantalla que muestra los libros de una lista específica.
 * Contenido:
 *  - Obtiene y muestra libros de una lista seleccionada
 *  - Permite navegar a los detalles de un libro
 */

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from "../componentes/Tema";

export default function ListaLibros({ urlProp, tituloProp }) {
  const route = useRoute();
  const navigation = useNavigation();
  const colors = useThemeColors();

  // Recibir URL y título desde props o parámetros de navegación
  const { nombreLista, url } = route.params || {};
  const finalUrl = urlProp || url || '';
  const finalTitulo = tituloProp || nombreLista || 'Lista de Libros';

  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerLibros = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(finalUrl);
  
      // 📌 Verificar si la respuesta es JSON antes de parsearla
      const textoRespuesta = await respuesta.text();
      
      if (!respuesta.ok) {
        //console.warn("Error en la respuesta del servidor:", textoRespuesta);
        setLibros([]); // Si la respuesta no es válida, dejar la lista vacía
        return;
      }
  
      // 📌 Intentar convertir en JSON solo si es un formato correcto
      const datos = JSON.parse(textoRespuesta);
      setLibros(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error('Error al obtener libros:', error);
      setLibros([]); // Si hay un error, asegurar que la lista quede vacía
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (finalUrl) obtenerLibros();
  }, [finalUrl]);

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => navigation.navigate("Detalles", { libro: item })}>
        <Image source={{ uri: item.imagen_portada }} style={styles.imagen_portada_libro} />
        <Text style={[styles.bookTitle, { color: colors.text }]}>{item.nombre}</Text>
      </TouchableOpacity>
    </View>
  );

  if (cargando) {
    return <ActivityIndicator size="large" color={colors.icon} style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Encabezado titulo={finalTitulo} />

      {/* Botón para regresar a Mis Listas */}
      <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.backButton}>
        <Text style={{ color: colors.text, fontSize: 16 }}>⬅ Volver a Mis Listas</Text>
      </TouchableOpacity>

      <FlatList
        data={libros}
        renderItem={renderItem}
        keyExtractor={(item) => item.enlace}
        numColumns={2}
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay libros en esta lista.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  }
});