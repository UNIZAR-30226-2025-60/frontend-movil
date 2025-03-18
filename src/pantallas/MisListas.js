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
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from "../componentes/Tema";
import { API_URL } from "../../config";

export default function MisListas({ correoUsuario, navigation, route }) {
  // 📌 Datos de navegación y tema
  const colors = useThemeColors();
  const libro = route.params?.libro;

  // 📌 Estado de listas y control de modal
  const [listas, setListas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaLista, setNuevaLista] = useState("");
  const [menuVisibleId, setMenuVisibleId] = useState(null);

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
   * 📌 Añadir un libro a la lista seleccionada.
   */
  // const añadirLibroALista = async (nombreLista) => {
  //   try {
  //     const respuesta = await fetch( `${backendUrl}/api/listas/${encodeURIComponent(nombreLista)}`,
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           usuario_id: correoUsuario,
  //           libro_id: libro.enlace,
  //         }),
  //       }
  //     );
  
  //     if (respuesta.ok) {
  //       Alert.alert('Éxito', 'El libro se ha añadido a la lista.');
  //       navigation.goBack();
  //     } else {
  //       const errorText = await respuesta.text();
  //       Alert.alert('Error', errorText);
  //     }
  //   } catch (error) {
  //     console.error('Error al añadir libro a la lista:', error);
  //     Alert.alert('Error', 'No se pudo añadir el libro a la lista.');
  //   }
  // };

  /**
   * 📌 Crea una nueva lista.
   */
  const crearLista = async () => {
    if (!nuevaLista.trim()) return;

    try {
      const respuesta = await fetch(`${API_URL}/listas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: correoUsuario,
          nombre_lista: nuevaLista,
          descripcion: "",
          publica: true,
          portada: ""
        }),
      });

      if (respuesta.ok) {
        setNuevaLista("");
        setModalVisible(false);
        obtenerListas();
      } else {
        Alert.alert('Error', 'No se pudo crear la lista.');
      }
    } catch (error) {
      console.error('Error al crear lista:', error);
    }
  };

  /**
   * 📌 Elimina una lista, excepto "Mis Favoritos".
   */
  const eliminarLista = async (nombreLista) => {
    if (nombreLista === "Mis Favoritos") {
      Alert.alert("Error", "No puedes eliminar la lista 'Mis Favoritos'.");
      return;
    }
  
    Alert.alert(
      "Eliminar lista",
      `¿Estás seguro de que quieres eliminar la lista "${nombreLista}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const respuesta = await fetch(`${API_URL}/listas/${correoUsuario}/${nombreLista}`, {
                method: "DELETE",
              });
  
              if (respuesta.ok) {
                Alert.alert("Éxito", "Lista eliminada correctamente.");
                obtenerListas(); // Recargar las listas
              } else {
                const textoError = await respuesta.text();
                Alert.alert("Error", `No se pudo eliminar la lista. Servidor: ${textoError}`);
              }
            } catch (error) {
              console.error("Error al eliminar lista:", error);
              Alert.alert("Error", "Hubo un problema al eliminar la lista.");
            }
          },
        },
      ]
    );
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
      <View style={[styles.itemContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => {
            // Cierra menú si estaba abierto
            if (menuVisibleId !== null) {
              setMenuVisibleId(null);
            } else {
              // Lógica al pulsar la tarjeta
              // Ejemplo: si tienes un libro para añadir:
              if (libro) {
                añadirLibroALista(item.nombre); 
              } else {
                // O navegar a ver los libros de esa lista
                navigation.navigate("LibrosDeListaScreen", {
                  nombreLista: item.nombre,
                  descripcionLista: item.descripcion,
                  esPublica: item.publica,
                  url: `${API_URL}/listas/${correoUsuario}/${encodeURIComponent(item.nombre)}/libros`
                });
              }
            }
          }}
          style={styles.listaContenido}
        >
          <Ionicons name="book-outline" size={50} color={colors.icon} />
          <Text style={[styles.nombreLista, { color: colors.text }]}>
            {item.nombre}
          </Text>
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
          <View style={styles.menuOpciones}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => eliminarLista(item.nombre)}
              style={styles.opcionEliminar}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
              <Text style={styles.textoOpcion}>Eliminar</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              activeOpacity={1}
              style={styles.opcionEliminar}
            >
              <Ionicons name="create-outline" size={20} color="blue" />
              <Text style={[styles.textoOpcion, { color: "blue" }]}>Editar</Text>
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
        <Encabezado titulo="Mis Listas" />
        
        {/* 📌 Lista de listas */}
        <FlatList
          // Agrega un item "Crear lista"
          data={[...listas, { nombre: 'Crear lista', esNueva: true }]}
          keyExtractor={(item, index) =>
            item.esNueva ? 'nueva' : item.nombre  // Usa el nombre como clave
          }
          renderItem={({ item }) => {
            if (item.esNueva) {
              return (
                <TouchableOpacity
                  style={[styles.itemContainer, styles.addContainer]}
                  onPress={() => navigation.navigate("CrearLista")}
                >
                  <Ionicons name="add-circle-outline" size={50} color={colors.icon} />
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

  /** 📌 ESTILOS DE LAS LISTAS **/

  // 📌 Contenedor de cada lista
  itemContainer: {
    width: '48%', //flex: 1, HACEMOS MANUALMENTE QUE OBLIGATORIAMENTE OCUPA LA MITAD DE LA PANTALLA
    margin: 5,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden', // Asegura que el contenido no se desborde
  },

  listaContenido: {
    flex: 1, // Ocupa todo el espacio de la tarjeta
    alignItems: "center", 
    justifyContent: "center", // Asegura que los elementos estén centrados verticalmente
    width: "100%", // Asegura que el contenedor se expanda correctamente
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
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** 📌 ESTILOS DEL MODAL **/

  // 📌 Contenedor de fondo oscuro del modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente
  },

  // 📌 Contenido del modal
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  // 📌 Título dentro del modal
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },

  // 📌 Input de texto dentro del modal
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },

  // 📌 Contenedor de los botones dentro del modal
  modalBotones: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },

  // 📌 Estilo de cada botón dentro del modal
  boton: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 10 
  },

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
    backgroundColor: "white",
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
    color: "red",
    fontSize: 14,
  },
});
