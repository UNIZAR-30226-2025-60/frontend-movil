/**
 * Archivo: MisListas.js
 * Descripción: Pantalla donde el usuario puede ver, crear y gestionar sus listas de libros.
 * Contenido:
 *  - Obtiene y muestra las listas del usuario
 *  - Permite agregar libros a una lista
 *  - Permite crear y eliminar listas
 *  - Implementa un menú desplegable con opciones de edición y eliminación
 */

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, TouchableWithoutFeedback, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from "../componentes/Tema";
import { API_URL } from "../../config";

export default function MisListas({ correoUsuario, navigation, route }) {
  // 📌 Datos de navegación y tema
  const colors = useThemeColors();
  const libro = route.params?.libro;

  // 📌 Estado de listas y control de modal
  const [listas, setListas] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [listasSeleccionadas, setListasSeleccionadas] = useState(new Set());
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  /**
   * 📌 Hook para obtener las listas cuando la pantalla recibe foco.
   */
  useFocusEffect(
    useCallback(() => {
      if (correoUsuario) {
        obtenerListas();
      }
      setMenuVisibleId(null);
    }, [correoUsuario])
  );

  /**
   * 📌 Obtiene las listas del usuario desde el backend y las ordena.
   */
  const obtenerListas = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/listas/${encodeURIComponent(correoUsuario)}`);
      const datos = await respuesta.json();

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
   * 📌 Elimina una lista, excepto "Mis Favoritos".
   */
  const eliminarLista = async (nombreLista, sinConfirmacion = false) => {
    if (nombreLista === "Mis Favoritos") return;

    const ejecutarEliminacion = async () => {
      try {
        //const res = await fetch(`${API_URL}/listas/${correoUsuario}/${nombreLista}`, {
        const res = await fetch(`${API_URL}/listas/${encodeURIComponent(correoUsuario)}/${encodeURIComponent(nombreLista)}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const msg = await res.text();
          Alert.alert("Error", msg);
        } else {
          await obtenerListas();
          setMenuVisibleId(null);
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
   * 📌 Alterna la visibilidad del menú de una única lista.
   */
  const toggleMenu = (nombreLista) => {
    setMenuVisibleId((prev) => (prev === nombreLista ? null : nombreLista));
  };

  /**
   * 📌 Función para renderizar cada elemento de la lista.
   */
  const renderItem = ({ item }) => {
    // Determinar si el menú está visible para esta lista
    const isMenuVisible = menuVisibleId === item.nombre; // usas el nombre como “ID”

    return (
      <View style={[styles.itemContainer, { borderColor: colors.borderLista }]}>
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
              if (menuVisibleId !== null) {
                setMenuVisibleId(null);
              } else {
                if (libro) {
                  añadirLibroALista(item.nombre);
                } else {
                  navigation.navigate("LibrosDeListaScreen", {
                    usuarioId: correoUsuario,
                    nombreLista: item.nombre,
                    descripcionLista: item.descripcion,
                    esPublica: item.publica,
                    portada: item.portada,
                    //url: `${API_URL}/listas/${correoUsuario}/${encodeURIComponent(item.nombre)}/libros`
                    url: `${API_URL}/listas/${correoUsuario}/${encodeURIComponent(item.nombre)}/libros`
                  });
                }
              }
            }
          }}
          style={[styles.listaContenido]}
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
            <Image source={{ uri: item.portada }} style={styles.listaImagen} />
          ) : (
            <Ionicons name="book-outline" size={70} color={colors.icon} />
          )}
          <Text style={[styles.nombreLista, { color: colors.text }]}>{item.nombre}</Text>
        </TouchableOpacity>

        {/* Menú de tres puntos, si no es “Mis Favoritos” (pero ya lo filtramos) */}
        <TouchableOpacity
          onPress={(event) => {
            event.stopPropagation();
            toggleMenu(item.nombre); // pasamos el nombre
          }}
          style={styles.botonMenu}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={colors.icon} />
        </TouchableOpacity>

        {/* Menú desplegable */}
        {isMenuVisible && (
          <View style={[styles.menuOpciones, { backgroundColor: colors.backgroundSecondary }]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => eliminarLista(item.nombre)}
              style={styles.opcionEliminar}
            >
              <Ionicons name="trash-outline" size={20} color={colors.textDark} />
              <Text style={[styles.textoOpcion, { color: colors.textDark }]}>Eliminar</Text>
            </TouchableOpacity>

            <View style={[styles.linea, { backgroundColor: colors.line, height: 0.8 }]} />

            <TouchableOpacity
              activeOpacity={1}
              style={styles.opcionEliminar}
              onPress={() => {
                // Cierra el menú
                setMenuVisibleId(null);
                // Navega a la pantalla EditarLista
                navigation.navigate("EditarLista", { lista: item, correoUsuario: correoUsuario });
              }}
            >
              <Ionicons name="create-outline" size={20} color={colors.textDark} />
              <Text style={[styles.textoOpcion, { color: colors.textDark }]}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisibleId(null)} accessible={false}>
      <View style={{ flex: 1 }}>

        {/* 📌 Encabezado de la pantalla */}
        <Encabezado titulo="Mis Listas" correoUsuario={correoUsuario} />

        <View style={[styles.topBar, { backgroundColor: colors.backgroundSubtitle }]}>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {dropdownVisible && (
          // Contenedor que ocupa toda la pantalla
          <View style={styles.dropdownMenuContainer}>
            {/* Si se pulsa fuera del menú, se cierra */}
            <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>

            {/* Menú en sí, posicionado debajo del icono */}
            <View style={[styles.dropdownMenu, { backgroundColor: colors.backgroundSecondary }]}>
              <TouchableOpacity
                onPress={() => {
                  setModoSeleccion(true);
                  setDropdownVisible(false);
                }}
                style={styles.dropdownOption}
              >
                <Text style={{ color: colors.text }}>
                  Seleccionar para eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {listas.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: colors.text, fontSize: 16 }}>No tienes listas aún</Text>
          </View>
        )}

        {/* 📌 Lista de listas */}
        <FlatList
          // Agrega un item "Crear lista"
          data={[...listas, { nombre: 'Crear lista', esNueva: true }]}
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
          contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        />

        {modoSeleccion && listasSeleccionadas.size > 0 && (
          <TouchableOpacity
            style={[styles.botonEliminar, { backgroundColor: colors.buttonSec }]}
            onPress={() => {
              Alert.alert(
                'Eliminar listas',
                `¿Deseas eliminar ${listasSeleccionadas.size} lista(s)?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Borrar seleccionadas', // Puedes cambiar este texto a lo que prefieras
                    style: 'destructive',
                    onPress: async () => {
                      for (const nombre of listasSeleccionadas) {
                        await eliminarLista(nombre, true);
                      }
                      setModoSeleccion(false);
                      setListasSeleccionadas(new Set());
                      obtenerListas();
                    }
                  }
                ]
              );
            }}
          >
            <Text style={{ color: colors.buttonText, fontWeight: 'bold' }}>Eliminar seleccionadas</Text>
          </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 40,
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
  checkbox: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  // // 📌 Contenido del modal
  // modalContent: {
  //   width: '80%',
  //   padding: 20,
  //   borderRadius: 10,
  //   alignItems: 'center',
  // },

  // // 📌 Título dentro del modal
  // modalTitle: { 
  //   fontSize: 18, 
  //   fontWeight: 'bold', 
  //   marginBottom: 10 
  // },

  // // 📌 Input de texto dentro del modal
  // input: {
  //   width: '100%',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   padding: 10,
  //   marginBottom: 20,
  // },

  // // 📌 Contenedor de los botones dentro del modal
  // modalBotones: { 
  //   flexDirection: 'row', 
  //   justifyContent: 'space-between', 
  //   width: '100%' 
  // },

  // // 📌 Estilo de cada botón dentro del modal
  // boton: { 
  //   flex: 1, 
  //   alignItems: 'center', 
  //   padding: 10 
  // },

  /** 📌 ESTILOS DEL MENÚ DESPLEGABLE **/

  // 📌 Botón de los tres puntos para abrir el menú
  botonMenu: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
  },

  // 📌 Contenedor del menú desplegable
  menuOpciones: {
    position: "absolute",
    top: 30,
    right: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 10,
  },

  // 📌 Opción dentro del menú desplegable
  opcionEliminar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },

  // 📌 Texto de las opciones dentro del menú
  textoOpcion: {
    marginLeft: 8,
    fontSize: 14,
  },
  botonEliminar: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  linea: {
    width: '100%',
    marginVertical: 3,
  },
  dropdownMenuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // Asegúrate de que se vea por encima
  },
  dropdownMenu: {
    position: 'absolute',
    top: 140,
    right: 16, // Ubícalo a la derecha
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownOption: {
    paddingVertical: 8,
  },
});
