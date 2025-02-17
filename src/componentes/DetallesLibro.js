// DetallesLibro.js
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faBook, faFileWord } from '@fortawesome/free-solid-svg-icons';

import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DetallesLibro({ route }) {
  const { libro } = route.params;
  const navigation = useNavigation();

  const handleAñadirALista = () => {

  };

  const handleAñadirValoracion = () => {

  };

  const handleLeer = () => {
    navigation.navigate("LeerLibro", { libro });
  };

  return (
    <ScrollView contentContainerStyle={stylesGeneral.container}>

      {/* Botón de leer */}
      <TouchableOpacity 
        style={stylesGeneral.boton} 
        onPress={handleLeer}
      >
        <Text style={stylesGeneral.textoBoton}>Leer</Text>
      </TouchableOpacity>


      {/* Título */}
      <View>
        <Text style={stylesGeneral.titulo}>{libro.nombre}</Text>
        <Text style={stylesGeneral.titulo}>de: {libro.autor}</Text>
        <TouchableOpacity 
          style={stylesGeneral.boton} 
          onPress={handleAñadirALista}
        >
          <Text style={stylesGeneral.textoBoton}>Añadir a lista</Text>
        </TouchableOpacity>
      </View>

      <View style={stylesGeneral.linea}/>

      {/* Más libros del autor */}
      {libro.autor !== "Anónimo" && (
        <View>
          <Text style={stylesGeneral.titulo}>Más de {libro.autor}</Text>
            {/* Añadir más libros de ese autor */}
        </View>
      )}

      <View style={stylesGeneral.linea}/>

      {/* Sinopsis */}
      <View>
        <Text style={stylesGeneral.titulo}>Sinopsis</Text>
        <Text>{libro.resumen}</Text>
      </View>

      <View style={stylesGeneral.linea}/>

      {/* Acerca de este libro */}
      <View>
        <Text style={stylesGeneral.titulo}>Acerca de este libro</Text>
        <View style={stylesAcercaDe.columnas3}>
          {/* Columna del número de páginas */}
          <View style={stylesAcercaDe.columna}>
            <FontAwesomeIcon icon={faBook} style={stylesAcercaDe.icono} />
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text>{libro.num_paginas}</Text>
              <Text>páginas</Text>
            </View>
          </View>
          {/* Columna del número de horas de lectura */}
          <View style={stylesAcercaDe.columna}>
            <FontAwesomeIcon icon={faClock} style={stylesAcercaDe.icono}/>
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text>{libro.horas_lectura}</Text>
              <Text>horas de lectura</Text>
            </View>
          </View>
          {/* Columna del número total de palabras */}
          <View style={stylesAcercaDe.columna}>
            <FontAwesomeIcon icon={faFileWord} style={stylesAcercaDe.icono}/>
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text>{libro.num_palabras}</Text>
              <Text>total de palabras</Text>
            </View>
          </View>

        </View>
      </View>

      <View style={stylesGeneral.linea}/>

      {/* Valoraciones del libro */}
      <View>
        <Text style={stylesGeneral.titulo}>Valoraciones del libro:</Text>
        <TouchableOpacity 
          style={stylesGeneral.boton} 
          onPress={handleAñadirValoracion}
        >
          <Text style={stylesGeneral.textoBoton}>Añadir valoración</Text>
        </TouchableOpacity>
      </View>

      <View style={stylesGeneral.linea}/>

      {/* Todas las reseñas del libro */}
      <View>
        <View>
          <Text style={stylesGeneral.titulo}>Todas las reseñas del libro:</Text>
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
