// DetallesLibro.js
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faBook, faFileWord } from '@fortawesome/free-solid-svg-icons';

import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-native-paper';

export default function DetallesLibro({ route }) {
  const { libro } = route.params;
  const navigation = useNavigation();
  const [ reseñas, setReseñas ] = useState([]);
  
  useEffect(() => {
    obtenerReseñas();
  }, [libro.enlace]);

  const obtenerReseñas = async () => {
    try {
      const enlaceCodificado = encodeURIComponent(libro.enlace);
      const response = await fetch(`http://10.0.2.2:3000/api/opiniones/${enlaceCodificado}`);
        if (!response.ok) {
          throw new Error("Error al obtener las reseñas");
        }
        const data = await response.json();
        setReseñas(data);
    } catch(error) {
      console.error("Error al obtener las reseñas:", error);
    }
  };
  // const obtenerReseñas = async () => {
  //   try {
  //     const enlaceCodificado = encodeURIComponent(libro.enlace);
  //     const response = await fetch(`http://10.0.2.2:3000/api/opiniones/${enlaceCodificado}`);
  //     if (!response.ok) {
  //       throw new Error("Error al obtener las reseñas");
  //     }
  //     const data = await response.json();
  //     if (JSON.stringify(data) !== JSON.stringify(reseñas)) {
  //       setReseñas(data);
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener las reseñas:", error);
  //   }
  // };
  

  const calcularProgreso = (cantidad, total) => {
    return total > 0 ? cantidad / total : 0;
  };

  

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
        {(() => {
          const conteo = reseñas.reduce((acc, reseña) => {
            acc[reseña.valor] = (acc[reseña.valor] || 0) + 1;
            return acc;
          }, {});

          const totalReseñas = reseñas.length;
          const sumaValores = reseñas.reduce((sum, reseña) => sum + reseña.valor, 0);
          const promedio = totalReseñas > 0 ? (sumaValores / totalReseñas).toFixed(1) : "0.0";

          return (
            <View style={{ padding: 10 }}>
              {/* Promedio general */}
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Valoración general</Text>
              <Text style={{ fontSize: 16 }}>{promedio} de 5</Text>

              {/* Estrellas (simples con emojis, puedes reemplazar con iconos si prefieres) */}
              <Text style={{ fontSize: 20 }}>⭐️⭐️⭐️⭐️☆ ({totalReseñas})</Text>

              {/* Barras de progreso */}
              {[5, 4, 3, 2, 1].map((num) => {
                const porcentaje = Math.min(1, totalReseñas > 0 ? (conteo[num] || 0) / totalReseñas : 0);
                console.log("Conteo de valoraciones:", conteo);
                console.log("Total de reseñas:", totalReseñas);
                // const porcentaje = totalReseñas > 0 ? (conteo[num] || 0) / totalReseñas : 0;
                return (
                  <View key={num} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
                    <Text style={{ width: 50 }}>{num} ESTRELLA</Text>
                    <ProgressBar progress={porcentaje} color="#FFD700" style={{ flex: 1, height: 8, marginLeft: 5 }} />
                    <Text style={{ marginLeft: 5 }}>{conteo[num] || 0}</Text>
                  </View>
                );
              })}
            </View>
          );
        })()}


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
            {reseñas.length === 0 ? (
              <Text>No hay reseñas todavía.</Text>
            ) : (
              reseñas.map((reseña, index) => (
                <View key={index}>
                  <Text>{reseña.usuario_id}</Text>
                  <Text>{reseña.mensaje}</Text>
                </View>
              ))
            )}
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
