// Favoritos.js

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Encabezado from '../componentes/Encabezado';

export default function Favoritos() {
    const [librosFavoritos, setLibrosFavoritos] = useState([]);
    const usuarioCorreo = 'usuario@correo.com'; // Este valor deberia venir de autenticacion

    // Obtener libros favoritos del backend
    const obtenerFavoritos = async () => {
        try {
            const respuesta = await fetch(`http://localhost:8081/api/listas/favoritos/${usuarioCorreo}`);
            const datos = await respuesta.json();
            console.log('Datos obtenidos:', datos);
            setLibrosFavoritos(datos);
        } catch (error) {
            console.error('Error al obtener libros favoritos:', error);
            Alert.alert('Error', 'No se pudieron cargar los libros favoritos.');
        }
    };

    // Eliminar libro de favoritos
    const eliminarDeFavoritos = async (enlaceLibro) => {
        try {
          const respuesta = await fetch('http://localhost:8081/api/listas/favoritos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuario_id: usuarioCorreo,
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

    useEffect(() => {
        obtenerFavoritos();
    }, []);

    return (
        <View style={{ flex: 1 }}>
          <Encabezado />
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Mis favoritos:</Text>
            <View style={styles.grid}>
              {librosFavoritos.length > 0 ? (
                librosFavoritos.map((libro, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.libroContainer}
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
                    <Image source={{ uri: libro.enlace_libro }} style={styles.imagenLibro} />
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
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, textDecorationLine: 'underline' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    libroContainer: { width: '47%', marginBottom: 20, alignItems: 'center' },
    imagenLibro: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10 },
    textoVacio: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});
