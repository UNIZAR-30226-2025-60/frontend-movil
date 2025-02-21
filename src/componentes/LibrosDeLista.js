// LibrosDeLista.js

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
      const datos = await respuesta.json();
      setLibros(datos);
    } catch (error) {
      console.error('Error al obtener libros:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (finalUrl) obtenerLibros();
  }, [finalUrl]);

  const renderItem = ({ item }) => (
    // <TouchableOpacity
    //   style={[styles.itemContainer, { backgroundColor: colors.background }]}
    //   onPress={() => navigation.navigate("Detalles", { libro: item })}
    // >
    //   <Image source={{ uri: item.enlace_libro }} style={styles.imagen_portada_libro} />
    //   <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={2}>
    //     {item.titulo || 'Título no disponible'}
    //   </Text>
    // </TouchableOpacity>
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
});