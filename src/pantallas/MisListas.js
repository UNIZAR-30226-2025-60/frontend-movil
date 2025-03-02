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

export default function MisListas() {
  // 📌 Datos de navegación y tema
  const navigation = useNavigation();
  const colors = useThemeColors();
  const route = useRoute();
  const { libro } = route.params || {};

  // 📌 Estado de listas y control de modal
  const [listas, setListas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaLista, setNuevaLista] = useState("");
  const [menuVisibleId, setMenuVisibleId] = useState(null);

  // 📌 Datos simulados del usuario (debería provenir de autenticación)
  const usuarioCorreo = 'amador@gmail.com';
  const backendUrl = 'http://10.0.2.2:3000';

  /**
   * 📌 Hook para obtener las listas cuando la pantalla recibe foco.
   */
  useFocusEffect(
    useCallback(() => {
      obtenerListas();
      setMenuVisibleId(null);
    }, [])
  );

  /**
   * 📌 Obtiene las listas del usuario desde el backend y las ordena.
   */
  const obtenerListas = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/${usuarioCorreo}`);
      const datos = await respuesta.json();

      console.log('🔎 Respuesta completa del backend:', JSON.stringify(datos, null, 2));
      // Verifica si los datos contienen IDs
      const listasConId = datos.map(lista => ({
        id: lista.id_lista || `temp-${Math.random()}`, // Genera un ID temporal si falta
        nombre: lista.nombre
      }));
      console.log('📌 Listas procesadas:', JSON.stringify(listasConId, null, 2));

      // Ordenar: "Mis Favoritos" primero y el resto alfabéticamente
      const listasOrdenadas = datos.sort((a, b) => {
        if (a.nombre === 'Mis Favoritos') return -1;
        if (b.nombre === 'Mis Favoritos') return 1;
        return a.nombre.localeCompare(b.nombre); // Orden alfabético
      });

      setListas(listasOrdenadas);
    } catch (error) {
      console.error('Error al obtener listas:', error);
    }
  };

  /**
   * 📌 Añadir un libro a la lista seleccionada.
   */
  const añadirLibroALista = async (idLista) => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/libro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioCorreo,
          id_lista: idLista,
          enlace_libro: libro.enlace, // Añadimos el libro
        }),
      });
      if (respuesta.ok) {
        Alert.alert('Éxito', `El libro se ha añadido a la lista seleccionada.`);
        navigation.goBack(); // Volvemos a la pantalla anterior
      } else {
        Alert.alert('Error', 'No se pudo añadir el libro a la lista.');
      }
    } catch (error) {
      console.error('Error al añadir libro a la lista:', error);
    }
  };

  /**
   * 📌 Crea una nueva lista.
   */
  const crearLista = async () => {
    if (!nuevaLista.trim()) return;

    try {
      const respuesta = await fetch(`${backendUrl}/api/listas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioCorreo,
          nombre_lista: nuevaLista,
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
              const respuesta = await fetch(`${backendUrl}/api/listas/${usuarioCorreo}/${nombreLista}`, {
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
  const toggleMenu = (idLista) => {
    setMenuVisibleId(prevId => (prevId === idLista ? null : idLista));
  };

  /**
   * 📌 Función para renderizar cada elemento de la lista.
   */
  const renderItem = ({ item }) => {
    // Añade log para depuración
    console.log(
      'Renderizando lista:',
      item.nombre,
      'ID:', item.id,
    );
    const isMenuVisible = menuVisibleId === item.id_lista && item.nombre !== "Mis Favoritos";
    
    return (
      <View style={[styles.itemContainer, { backgroundColor: colors.background }]}>

        {/* 📌 Contenedor del contenido de la lista */}
        <TouchableOpacity
          onPress={() => {
            if (menuVisibleId !== null) {
              setMenuVisibleId(null); // Solo cerrar el menú si está abierto
            }
            else {
              if (item.nombre === "Mis Favoritos") { navigation.navigate("Mis favoritos"); }
              else if (libro) { añadirLibroALista(item.id_lista); }
              else {
                navigation.navigate("LibrosDeListaScreen", { nombreLista: item.nombre, url: `${backendUrl}/api/listas/${usuarioCorreo}/${item.nombre}/libros` });
              }
            }
          }}
          style={styles.listaContenido}
        >
          <Ionicons name="book-outline" size={50} color={colors.icon} />
          <Text style={[styles.nombreLista, { color: colors.text }]}>{item.nombre}</Text>
        </TouchableOpacity>

        {/* 📌 Botón de menú con tres puntos */}
        {item.nombre !== "Mis Favoritos" && (
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation(); // Evita que el evento se propague y cierre el menú inmediatamente
              toggleMenu(item.id_lista);
            }}
            style={styles.botonMenu}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={colors.icon} />
          </TouchableOpacity>
        )}

        {/* 📌 Menú desplegable con opciones de "Eliminar" y "Editar" */}
        {isMenuVisible && (
          <View style={styles.menuOpciones}>
            <TouchableOpacity activeOpacity={1} onPress={() => eliminarLista(item.nombre)} style={styles.opcionEliminar}>
              <Ionicons name="trash-outline" size={20} color="red" />
              <Text style={styles.textoOpcion}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={() => console.log("Editar lista")} style={styles.opcionEliminar}>
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
          data={[...listas, { id_lista: 'nueva', nombre: 'Crear lista', esNueva: true }]}
          renderItem={({ item, index }) => {
            // Si el ítem es "Crear lista", aseguramos que no se expanda a dos columnas
            const isLastItemAlone = index === listas.length && listas.length % 2 === 0;

            return item.esNueva ? (
              <TouchableOpacity
                style={[
                  styles.itemContainer,
                  styles.addContainer,
                  isLastItemAlone && { flex: 0.5 } // Evita que "Crear lista" ocupe dos espacios
                ]}
                onPress={() => navigation.navigate("CrearLista")}
              >
                <Ionicons name="add-circle-outline" size={50} color={colors.icon} />
                <Text style={[styles.nombreLista, { color: colors.text }]}>Crear lista</Text>
              </TouchableOpacity>
            ) : (
              renderItem({ item }) // Renderiza la lista normal
            );
          }}
          keyExtractor={(item, index) => (item.id_lista ? item.id_lista.toString() : `lista-${index}`)}
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
    flex: 1,
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
