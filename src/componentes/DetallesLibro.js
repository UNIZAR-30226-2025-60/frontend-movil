// DetallesLibro.js
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faBook, faFileWord } from '@fortawesome/free-solid-svg-icons';

import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "./Tema";

export default function DetallesLibro({ route }) {
  const { libro } = route.params;
  const navigation = useNavigation();
  const colors = useThemeColors();

  const handleAñadirALista = () => {

  };

  const handleAñadirValoracion = () => {

  };

  const handleLeer = () => {
    navigation.navigate("LeerLibro", { libro });
  };

  return (
    <ScrollView contentContainerStyle={[stylesGeneral.container, { backgroundColor: colors.background }]}>

      {/* Botón de leer */}
      <TouchableOpacity 
        style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
        onPress={handleLeer}
      >
        <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Leer</Text>
      </TouchableOpacity>


      {/* Título */}
      <View>
      <Text style={[stylesGeneral.titulo, { color: colors.text }]}>{libro.nombre}</Text>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>de: {libro.autor}</Text>
        <TouchableOpacity 
          style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
          onPress={handleAñadirALista}
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
});
