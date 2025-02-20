// DetallesLibro.js
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faBook, faFileWord } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "./Tema";

export default function DetallesLibro({ route }) {
  const { libro } = route.params;
  const navigation = useNavigation();
  const [esFavorito, setEsFavorito] = useState(false);  // Estado del corazón
  const [modalVisible, setModalVisible] = useState(false); // Modal para seleccionar lista
  const [listasUsuario, setListasUsuario] = useState([]); // Listas del ususario
  const colors = useThemeColors();

  const usuarioCorreo = 'amador@gmail.com'; // Simulación, debería venir de autenticación
  const backendUrl = 'http://10.0.2.2:3000';

  const handleAñadirValoracion = () => {

  };

  // Verificar si el libro ya está en favoritos al cargar la pantalla
  // SI LA CONSULTA ES PESADA, SE PODRÍA OPTIMIZAR ENVIANDO AL BACKEND SOLO UNA VERIFICACIÓN PUNTUAL
  //    Endpoint que podría existir: /favorito/:usuario_id/:enlace_libro
  //    const respuesta = await fetch(`http://10.0.2.2:3000/api/listas/favorito/amador@gmail.com/${encodeURIComponent(libro.enlace)}`);

  const verificarSiEsFavorito = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/favoritos/${usuarioCorreo}`);
      const favoritos = await respuesta.json();
      const encontrado = favoritos.some(fav => fav.enlace_libro === libro.enlace);
      setEsFavorito(encontrado);  // Actualizar el estado si se encuentra
    } catch (error) {
      console.error('Error al verificar favoritos:', error);
    }
  };

  // Añadir libro a favoritos
  const añadirAFavoritos = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioCorreo,
          enlace_libro: libro.enlace,
        }),
      });
      if (respuesta.ok) {
        setEsFavorito(true);
        Alert.alert('Añadido', 'El libro se ha añadido a tus favoritos');
      } else {
        Alert.alert('Error', 'No se pudo añadir el libro a favoritos');
      }
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
    }
  };

  // Eliminar libro de favoritos
  const eliminarDeFavoritos = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/favoritos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioCorreo,
          enlace_libro: libro.enlace,
        }),
      });
      if (respuesta.ok) {
        setEsFavorito(false);
        Alert.alert('Eliminado', 'El libro se ha eliminado de tus favoritos');
      } else {
        Alert.alert('Error', 'No se pudo eliminar el libro de favoritos');
      }
    } catch (error) {
      console.error('Error al eliminar de favoritos:', error);
    }
  };

  // Manejar pulsación del corazón
  const handleCorazonPress = () => {
    esFavorito ? eliminarDeFavoritos() : añadirAFavoritos();
  };

  const handleAñadirALista = () => {
    navigation.navigate("MisListasScreen", { libro }); // Pasamos el libro a la pantalla de listas
  };
  

  const handleLeer = () => {
    navigation.navigate("LeerLibro", { libro });
  };

  // Obtener listas del usuario
  const obtenerListasUsuario = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/${usuarioCorreo}`);
      const datos = await respuesta.json();
      setListasUsuario(datos);
    } catch (error) {
      console.error('Error al obtener listas del usuario:', error);
    }
  };

  // Añadir libro a la lista seleccionada
  const añadirLibroALista = async (idLista) => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/libro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioCorreo,
          id_lista: idLista,
          enlace_libro: libro.enlace,
        }),
      });
      if (respuesta.ok) {
        Alert.alert('Añadido', 'El libro se ha añadido a la lista seleccionada');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'No se pudo añadir el libro a la lista');
      }
    } catch (error) {
      console.error('Error al añadir libro a la lista:', error);
    }
  };

  // useEffect para cargar el estado inicial del corazón al entrar a la pantalla
  useEffect(() => {
    verificarSiEsFavorito();
  }, []);

  return (
    <ScrollView contentContainerStyle={[stylesGeneral.container, { backgroundColor: colors.background }]}>

      {/* Botón de leer y corazón */}
      <View>
        <TouchableOpacity 
          style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
          onPress={handleLeer}
        >
          <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Leer</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCorazonPress} style={stylesGeneral.corazon}>
            <FontAwesomeIcon
              icon={esFavorito ? faHeartSolid : faHeartRegular}
              size={30}
              color={esFavorito ? 'red' : 'gray'}
            />
        </TouchableOpacity>
      </View>


      {/* Título y botón de "Añadir a lista"*/}
      <View>
      <Text style={[stylesGeneral.titulo, { color: colors.text }]}>{libro.nombre}</Text>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>de: {libro.autor}</Text>
        <TouchableOpacity 
          style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
          onPress={() => { obtenerListasUsuario(); setModalVisible(true); }}
        >
          <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Añadir a lista</Text>
        </TouchableOpacity>
      </View>

      <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]} />

      {/* Más libros del autor */}
      {libro.autor !== "Anónimo" && (
        <View>
          <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Más de {libro.autor}</Text>
            {/* Añadir más libros de ese autor */}
        </View>
      )}

      <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]} />

      {/* Sinopsis */}
      <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Sinopsis</Text>
        <Text style={{ color: colors.text }}>{libro.resumen}</Text>
      </View>

      <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]}/>

      {/* Acerca de este libro */}
      <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Acerca de este libro</Text>
        <View style={stylesAcercaDe.columnas3}>
          {/* Columna del número de páginas */}
          <View style={stylesAcercaDe.columna}>
            <FontAwesomeIcon icon={faBook} style={[stylesAcercaDe.icono, { color: colors.text }]} />
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text style={{ color: colors.text }}>{libro.num_paginas}</Text>
              <Text style={{ color: colors.text }}>páginas</Text>
            </View>
          </View>
          {/* Columna del número de horas de lectura */}
          <View style={stylesAcercaDe.columna}>
            <FontAwesomeIcon icon={faClock} style={[stylesAcercaDe.icono, { color: colors.text }]} />
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text style={{ color: colors.text }}>{libro.horas_lectura}</Text>
              <Text style={{ color: colors.text }}>horas de lectura</Text>
            </View>
          </View>
          {/* Columna del número total de palabras */}
          <View style={stylesAcercaDe.columna}>
          <FontAwesomeIcon icon={faFileWord} style={[stylesAcercaDe.icono, { color: colors.text }]} />
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text style={{ color: colors.text }}>{libro.num_palabras}</Text>
              <Text style={{ color: colors.text }}>total de palabras</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]} />

      {/* Valoraciones del libro */}
      <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Valoraciones del libro:</Text>
        <TouchableOpacity 
          style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
          onPress={handleAñadirValoracion}
        >
          <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Añadir valoración</Text>
        </TouchableOpacity>
      </View>

      <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]} />

      {/* Todas las reseñas del libro */}
      <View>
        <View>
          <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Todas las reseñas del libro:</Text>
        {/* Poner aquí el botón desplegable de ordenar por */}
        </View>
        <View>
            {/* Poner aquí las reseñas */}
        </View>
      </View>

      {/* Modal para seleccionar la lista */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={stylesGeneral.modalContainer}>
          <View style={[stylesGeneral.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[stylesGeneral.modalTitle, { color: colors.text }]}>Selecciona una lista</Text>
            <FlatList
              data={listasUsuario}
              //keyExtractor={(item) => item.id_lista.toString()}
              keyExtractor={(item, index) => (item.id_lista ? item.id_lista.toString() : index.toString())}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[stylesGeneral.boton, { backgroundColor: colors.button }]}
                  onPress={() => añadirLibroALista(item.id_lista)}
                >
                  <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={stylesGeneral.botonCerrar} onPress={() => setModalVisible(false)}>
              <Text style={{ color: colors.buttonText }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



    </ScrollView>
  );
}

const stylesAcercaDe = StyleSheet.create({
  columnas3: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: '100%',
  },
  columna: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  subcolumna: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '10',
  },
  textoSubcolumna: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icono: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
});

const stylesGeneral = StyleSheet.create({
  container: {
    flexGrow: 1, // Asegura que el ScrollView no se expanda de más
    padding: 16,
  },
  linea: {
    width: '80%',
    height: 1,
    backgroundColor: '#000', // Color: Negro
  },
  titulo: {
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
  },

  boton: {
    backgroundColor: '#333333',  // Color: Gris oscuro
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  textoBoton: {
    color: 'white',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  corazon: {
    marginHorizontal: 15,
  },
  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: { width: '80%', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  botonCerrar: {
    backgroundColor: '#999', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center',
  },
});
