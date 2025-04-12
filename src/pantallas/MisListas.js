/**
 * Archivo: MisListas.js
 * Descripción: Pantalla donde el usuario puede ver, crear y gestionar sus listas de libros.
 * Contenido:
 *  - Obtiene y muestra las listas del usuario
 *  - Permite agregar libros a una lista
 *  - Permite crear y eliminar listas
 *  - Implementa un menú desplegable con opciones de edición y eliminación
 */

import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, TouchableWithoutFeedback, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from "../componentes/Tema";
import { API_URL } from "../../config";

// Función para transformar el link original a un formato visualizable
const convertirDriveLink = (url) => {
  // Si es null o undefined, devolvemos null (o "" si prefieres)
  if (!url) return null;
  // Si ya tiene el formato transformado, se retorna directamente
  if (url.includes("uc?id=")) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
  if (match) {
    const fileId = match[1];
    return `https://drive.google.com/uc?id=${fileId}`;
  }
  return url;
};

export default function MisListas({ correoUsuario, navigation, route }) {
  // 📌 Datos de navegación y tema
  const colors = useThemeColors();
  const libro = route.params?.libro;

  // 📌 Estado de listas y control de modal
  const [listas, setListas] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [listasSeleccionadas, setListasSeleccionadas] = useState(new Set());

  /**
   * 📌 Hook para obtener las listas cuando la pantalla recibe foco.
   */
  useFocusEffect(
    useCallback(() => {
      if (correoUsuario) {
        obtenerListas();
      }
    }, [correoUsuario])
  );

  const toggleMenu = (nombreLista) => {
    setMenuVisibleId((prev) => (prev === nombreLista ? null : nombreLista));
  };

  /**
   * 📌 Obtiene las listas del usuario desde el backend y las ordena.
   */
  const obtenerListas = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/listas/${encodeURIComponent(correoUsuario)}`);
      const datos = await respuesta.json();

      const listasConPortada = datos.map(lista => ({
        ...lista,
        original: lista.portada,                    // Guarda el link original
        foto: convertirDriveLink(lista.portada)     // Calcula el link transformado
      }));

      // Filtrar todas las listas que NO sean "Mis Favoritos", "Leídos" o "En proceso"
      const listasFiltradas = datos.filter(
        (lista) =>
          lista.nombre !== 'Mis Favoritos' &&
          lista.nombre !== 'Leídos' &&
          lista.nombre !== 'En proceso'
      );

      // Ordenar alfabéticamente las listas restantes
      listasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));

      // Guardar en estado
      setListas(listasFiltradas);

    } catch (error) {
      console.error('Error al obtener listas:', error);
    }
  };

  /**
   * 📌 Elimina una lista.
   */
  const eliminarLista = async (nombreLista, sinConfirmacion = false) => {
    const ejecutarEliminacion = async () => {
      try {
        const res = await fetch(`${API_URL}/listas/${encodeURIComponent(correoUsuario)}/${encodeURIComponent(nombreLista)}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const msg = await res.text();
          Alert.alert("Error", msg);
        } else {
          await obtenerListas();
          setListasSeleccionadas(new Set());
        }
      } catch (err) {
        console.error("Error al eliminar lista:", err);
        Alert.alert("Error", "Hubo un problema al eliminar la lista.");
      }
    };

    if (sinConfirmacion) {
      await ejecutarEliminacion();
    } else {
      Alert.alert("Eliminar lista", `¿Desea eliminar "${nombreLista}"?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: ejecutarEliminacion }
      ]);
    }
  };

  /**
   * 📌 Función para renderizar cada elemento de la lista.
   */
  const renderItem = ({ item }) => {
    // Determinar si el menú está visible para esta lista
    const isSelected = listasSeleccionadas?.has(item.nombre);

    return (
      <View
        style={[
          styles.itemContainer,
          { borderColor: colors.borderLista },
          isSelected && { backgroundColor: colors.backgroundSelected || '#e0e0e060' }
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (modoSeleccion) {
              const nuevas = new Set(listasSeleccionadas);
              if (nuevas.has(item.nombre)) {
                nuevas.delete(item.nombre);
              } else {
                nuevas.add(item.nombre);
              }
              setListasSeleccionadas(nuevas);
            } else {
              if (libro) {
                añadirLibroALista(item.nombre);
              } else {
                navigation.navigate("LibrosDeListaScreen", {
                  usuarioId: correoUsuario,
                  nombreLista: item.nombre,
                  descripcionLista: item.descripcion,
                  esPublica: item.publica,
                  portada: item.original,
                  portadaTransformada: item.foto,
                  url: `${API_URL}/listas/${correoUsuario}/${encodeURIComponent(item.nombre)}/libros`
                });
              }
            }
          }}
          onLongPress={() => {
            setModoSeleccion(true);
            const nuevas = new Set(listasSeleccionadas);
            nuevas.add(item.nombre);
            setListasSeleccionadas(nuevas);
          }}
          style={[
            styles.listaContenido,
            modoSeleccion && listasSeleccionadas.has(item.nombre) && {
              backgroundColor: colors.backgroundSelected || '#e0e0e060'
            }
          ]}
        >
          {modoSeleccion && (
            <View style={{
              position: 'absolute',
              top: 8,
              left: 8,
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: colors.border,
              backgroundColor: isSelected ? colors.button : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1
            }}>
              {listasSeleccionadas.has(item.nombre) && (
                <Text style={{ color: colors.buttonText, fontSize: 12 }}>✓</Text>
              )}
            </View>
          )}
          {item.portada ? (
            <Image source={{ uri: item.foto }} style={styles.listaImagen} />
          ) : (
            <Ionicons name="book-outline" size={70} color={colors.icon} />
          )}
          <Text style={[styles.nombreLista, { color: colors.text }]}>{item.nombre}</Text>

          {/* Botón de los tres puntos */}
          {!modoSeleccion && (
            <TouchableOpacity
              onPress={() => toggleMenu(item.nombre)}
              style={styles.botonMenu}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={colors.icon} />
            </TouchableOpacity>
          )}

          {/* Menú contextual si está visible */}
          {!modoSeleccion && menuVisibleId === item.nombre && (
            <View style={[styles.menuOpciones, { backgroundColor: colors.backgroundSecondary }]}>
              <TouchableOpacity
                style={styles.opcionMenu}
                onPress={() => {
                  setMenuVisibleId(null);
                  navigation.navigate("EditarLista", { lista: item, correoUsuario });
                }}
              >
                <Ionicons name="create-outline" size={18} color={colors.text} />
                <Text style={[styles.textoOpcion, { color: colors.text }]}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.opcionMenu}
                onPress={() => {
                  setMenuVisibleId(null);
                  eliminarLista(item.nombre);
                }}
              >
                <Ionicons name="trash-outline" size={18} color="red" />
                <Text style={[styles.textoOpcion, { color: "red" }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}

        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)} accessible={false}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>

        {/* 📌 Encabezado de la pantalla */}
        <Encabezado titulo="Mis Listas" correoUsuario={correoUsuario} />

        {listas.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: colors.text, fontSize: 16 }}>No tienes listas aún</Text>
          </View>
        )}

        {/* 📌 Lista de listas */}
        <FlatList
          // Agrega un item "Crear lista"
          data={
            modoSeleccion
              ? listas // si está en modo selección, no mostramos el botón "Crear lista"
              : [...listas, { nombre: 'Crear lista', esNueva: true }]
          }
          keyExtractor={(item) =>
            item.esNueva ? 'nueva' : item.nombre  // Usa el nombre como clave
          }
          renderItem={({ item }) => {
            if (item.esNueva) {
              return (
                <TouchableOpacity
                  style={[styles.itemContainer, styles.addContainer, { borderColor: colors.borderLista }]}
                  color={[colors.text]}
                  onPress={() => navigation.navigate("CrearLista")}
                >
                  <Ionicons name="add-circle-outline" size={50} color={colors.borderLista} />
                  <Text style={[styles.nombreLista, { color: colors.text }]}>
                    Crear lista
                  </Text>
                </TouchableOpacity>
              );
            } else {
              return renderItem({ item });
            }
          }}
          numColumns={2}
          contentContainerStyle={[styles.container]}
        />

        {modoSeleccion && listasSeleccionadas.size > 0 && (
          <View style={styles.barraSeleccion}>
            <TouchableOpacity
              style={[styles.botonAccion, { backgroundColor: colors.buttonDark }]}
              onPress={() => {
                Alert.alert(
                  'Eliminar listas',
                  `¿Deseas eliminar ${listasSeleccionadas.size} lista(s)?`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Borrar seleccionadas',
                      style: 'destructive',
                      onPress: async () => {
                        const promesas = [...listasSeleccionadas].map((nombre) =>
                          eliminarLista(nombre, true)
                        );
                        await Promise.all(promesas);
                        setModoSeleccion(false);
                        setListasSeleccionadas(new Set());
                        obtenerListas();
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={{ color: colors.buttonTextDark, fontWeight: 'bold' }}>Eliminar seleccionadas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonAccion, { backgroundColor: colors.buttonDarkSecondary }]}
              onPress={() => {
                setModoSeleccion(false);
                setListasSeleccionadas(new Set());
              }}
            >
              <Text style={{ color: colors.buttonTextDark }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // 📌 Contenedor principal de la pantalla
  container: {
    flexGrow: 1,
    padding: 16
  },
  // 📌 Contenedor de cada lista
  itemContainer: {
    width: '48%', //flex: 1, HACEMOS MANUALMENTE QUE OBLIGATORIAMENTE OCUPA LA MITAD DE LA PANTALLA
    margin: 5,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden', // Asegura que el contenido no se desborde
  },
  listaContenido: {
    flex: 1, // Ocupa todo el espacio de la tarjeta
    alignItems: "center",
    justifyContent: "center", // Asegura que los elementos estén centrados verticalmente
    width: "100%", // Asegura que el contenedor se expanda correctamente
  },
  listaImagen: {
    width: 100,
    height: 100,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  // 📌 Nombre de la lista
  nombreLista: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14
  },
  // 📌 Estilo especial para el botón "Crear Lista"
  addContainer: {
    borderStyle: 'dashed',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonEliminar: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  barraSeleccion: {
    position: 'absolute',
    bottom: 30,
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  botonAccion: {
    width: '80%',
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
  },
  botonMenu: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 2,
  },
  menuOpciones: {
    position: "absolute",
    top: 30,
    right: 10,
    borderRadius: 6,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 3,
  },
  opcionMenu: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  textoOpcion: {
    marginLeft: 8,
    fontSize: 14,
  },
});
