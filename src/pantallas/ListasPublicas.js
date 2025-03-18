// ListasPublicas.js

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from '../componentes/Tema';
import { API_URL } from '../../config';

/**
 * Pantalla para mostrar todas las listas públicas existentes en el sistema.
 */
export default function ListasPublicas() {
  const [listasPublicas, setListasPublicas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const colors = useThemeColors();

  /**
   * Al montar el componente, obtenemos las listas públicas.
   */
  useEffect(() => {
    obtenerListasPublicas();
  }, []);

  /**
   * Función para llamar al endpoint y obtener las listas públicas.
   */
  const obtenerListasPublicas = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/listas/publicas`);
      if (!respuesta.ok) {
        // Por ejemplo, si no hay listas públicas o si ocurre un error:
        const textoError = await respuesta.text();
        console.warn('Error al obtener listas públicas:', textoError);
        setListasPublicas([]);  // Deja la lista vacía
      } else {
        const datos = await respuesta.json();
        setListasPublicas(datos);
      }
    } catch (error) {
      console.error('Error al obtener las listas públicas:', error);
      setListasPublicas([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el toque en una lista pública para navegar a la pantalla
   * que muestra sus libros (por ejemplo, "LibrosDeListaScreen").
   */
  const manejarListaPress = (lista) => {
    // Aquí necesitas el usuario_id y el nombre de la lista
    // para armar la ruta y/o params que usas en "LibrosDeListaScreen"
    navigation.navigate('LibrosDeListaScreen', {
      nombreLista: lista.nombre,
      descripcionLista: lista.descripcion,
      usuarioId: lista.usuario_id,
      esPublica: true,
      // Por ejemplo, puedes pasar la URL ya formada:
      url: `${API_URL}/listas/${encodeURIComponent(lista.usuario_id)}/${encodeURIComponent(lista.nombre)}/libros`,
    });
  };

  /**
   * Renderiza cada ítem de la lista (tarjeta).
   */
  const renderItem = ({ item }) => {
    return (
      <View style={[styles.itemContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={styles.listaContenido}
          onPress={() => manejarListaPress(item)}
        >
          <Ionicons name="book-outline" size={50} color={colors.icon} />
          <Text style={[styles.nombreLista, { color: colors.text }]}>
            {item.nombre}
          </Text>
          {/* Podrías mostrar el "usuario_id" para indicar quién es el dueño */}
          <Text style={[styles.usuarioLista, { color: colors.text }]}>
            de {item.usuario_id}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Encabezado personalizado */}
      <Encabezado titulo="Listas Públicas" />

      {isLoading ? (
        <Text style={{ margin: 20, color: colors.text }}>Cargando...</Text>
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
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden'
  },
  listaContenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  nombreLista: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14
  },
  usuarioLista: {
    fontSize: 12,
    opacity: 0.6,
  },
  textoVacio: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  }
});
