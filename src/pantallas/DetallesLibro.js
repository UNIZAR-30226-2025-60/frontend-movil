/**
 * Archivo: DetallesLibro.js
 * Descripción: Pantalla de detalles de un libro.
 * Contenido:
 *  - Muestra información detallada de un libro (portada, sinopsis, autor, etc.)
 *  - Permite al usuario marcar el libro como favorito
 *  - Posibilita añadir el libro a listas personalizadas
 *  - Muestra valoraciones y otros libros del mismo autor
 */

// 📌 Importaciones necesarias
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Text, Image, View, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { Menu, Provider, ProgressBar } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock, faBook, faFileWord } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid, faHeart as faHeartRegular } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";

// NECESITA QUE LE PASES EL LIBRO COMPLETO (enlace, sinopsis, autor, nombre, etc)
// 📌 Componente principal
export default function DetallesLibro({ route, correoUsuario }) {
  const { libro } = route.params;
  const navigation = useNavigation();
  const colors = useThemeColors();

  // 📌 Estados
  const [esFavorito, setEsFavorito] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [listasUsuario, setListasUsuario] = useState([]);
  const [librosDelAutor, setLibrosDelAutor] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mostrarResumenCompleto, setMostrarResumenCompleto] = useState(false);

  const [valoraciones, setValoraciones] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [conteo, setConteo] = useState([]);
  const [totalValoraciones, setTotalValoraciones] = useState(null);

  // 📌 Variables generales
  // const usuarioCorreo = 'amador@gmail.com'; // Simulación, debería venir de autenticación
  const backendUrl = 'http://10.0.2.2:3000';

  //  📌 Variables para mostrar la sinopsis del libro
  const MAX_LINES = 6;  
  const MAX_CHARACTERS = 250;
  const esResumenCorto = libro.resumen.length <= MAX_CHARACTERS;


  // 📌 Efectos de carga
  useEffect(() => {
    if (libro.autor !== "Anónimo") {
      obtenerMasLibrosDelAutor();
    }
    obtenerValoraciones();
    if (correoUsuario) {
      obtenerListasUsuario();
      verificarSiEsFavorito();
    }
  }, []);
  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      obtenerValoraciones();
    });
    return unsubscribe;
  }, [navigation]);

  // 📌 Efecto para calcular estadísticas de valoraciones
  useEffect(() => {
    const conteoAux = valoraciones.reduce((acc, valoracion) => {
      acc[valoracion.valor] = (acc[valoracion.valor] || 0) + 1;
      return acc;
    }, {});

    setConteo(conteoAux);
    const totalValoracionesAux = valoraciones.length;
    setTotalValoraciones(totalValoracionesAux);
    const sumaValores = valoraciones.reduce((sum, valoracion) => sum + valoracion.valor, 0);
    const promedioAux = totalValoracionesAux > 0 ? (sumaValores / totalValoracionesAux).toFixed(1) : "0.0";
    setPromedio(promedioAux);
  }, [valoraciones]);

  // 📌 Funciones para obtener datos
  const obtenerMasLibrosDelAutor = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/libros/autor/${libro.autor}`);
      if (!response.ok) {
        throw new Error("Error al obtener libros del autor " + libro.autor + ": " + response.error);
      }
      const data = await response.json();
      setLibrosDelAutor(data);
    } catch(error) {
      console.error(error);
    }
  }

  const obtenerValoraciones = async () => {
    try {
      const enlaceCodificado = encodeURIComponent(libro.enlace);
      const response = await fetch(`${backendUrl}/api/opiniones/${enlaceCodificado}`);
      if (!response.ok) {
        throw new Error("Error al obtener las valoraciones del libro " + libro.nombre + ": " + response.error);
      }
      const data = await response.json();
      // Transformar fecha eliminando lo sobrante
      const dataTransformada = data.map(item => ({
        ...item,
        fecha: item.fecha?.split("T")[0] || item.fecha,
      }));
      setValoraciones(dataTransformada);
    } catch(error) {
      console.error(error);
    }
  }

  const obtenerListasUsuario = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/${correoUsuario}`);
      const datos = await respuesta.json();
      setListasUsuario(datos);
    } catch (error) {
      console.error('Error al obtener listas del usuario:', error);
    }
  };

  // 📌 Funciones para manejar favoritos
  const verificarSiEsFavorito = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/favoritos/${correoUsuario}`);
      const textoRespuesta = await respuesta.text(); // 📌 Leer como texto primero
  
      // 📌 Verificar si la respuesta es JSON antes de intentar parsearla
      if (textoRespuesta.startsWith("{") || textoRespuesta.startsWith("[")) {
        const favoritos = JSON.parse(textoRespuesta); // Convertir en JSON si es válido
        const encontrado = Array.isArray(favoritos) && favoritos.some(fav => fav.enlace_libro === libro.enlace);
        setEsFavorito(encontrado);
      } else {
        //console.warn("El backend devolvió texto en lugar de JSON:", textoRespuesta);
        setEsFavorito(false); // Si no es JSON, asumimos que no hay favoritos
      }
    } catch (error) {
      console.error('Error al verificar favoritos:', error);
      setEsFavorito(false); // En caso de fallo, asumimos que no es favorito
    }
  };

  const añadirAFavoritos = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/favoritos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: correoUsuario,
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

  const eliminarDeFavoritos = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/favoritos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: correoUsuario,
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

  const handleCorazonPress = () => {
    esFavorito ? eliminarDeFavoritos() : añadirAFavoritos();
  };

  // 📌 Funciones para manejar listas
  const añadirLibroALista = async (idLista) => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/${correoUsuario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: correoUsuario,
          id_lista: idLista,
          enlace_libro: libro.enlace,
        }),
      });
      const data = await respuesta.json(); // Obtener el cuerpo de la respuesta
      if (respuesta.ok) {
        Alert.alert('Añadido', 'El libro se ha añadido a la lista seleccionada');
        setMenuVisible(false);
      } else {
        Alert.alert('Error', 'No se pudo añadir el libro a la lista');
      }
    } catch (error) {
      console.error('Error al añadir libro a la lista:', error);
    }
  };

  const handleLeer = () => {
    navigation.navigate("LeerLibro", { libro, correoUsuario });
  };

  const handleAñadirValoracion = () => {
    navigation.navigate("AñadirValoracion", { libro, correoUsuario });
  };

  // 📌 Abrir modal y cargar listas si no están cargadas
  const handleAñadirALista = () => {
    {listasUsuario.length > 0 ? (
      listasUsuario.map((item) => (
        <Menu.Item 
          key={item.id_lista} // Asegúrate de que cada elemento tenga un "key" único
          onPress={() => añadirLibroALista(item.id_lista)} 
          title={item.nombre} 
        />
      ))
    ) : (
      <Menu.Item title="No tienes listas creadas" disabled />
    )}
  };

  // 📌 Renderización del componente
  return (
    <ScrollView contentContainerStyle={[stylesGeneral.container, { backgroundColor: colors.background }]}>
    {/* <View style={[stylesGeneral.container, { backgroundColor: colors.background }]}> */}
      <View style={stylesGeneral.containerPrincipio}>
        {/* Portada */}
        <View style={stylesGeneral.columnaIzquierda}>
          <Image 
            source={{ uri: libro.imagen_portada }}
            style={stylesGeneral.imagen_portada_libro} 
          />
        </View>

        {/* Título y botones: corazón, leer y añadir a lista */}
        <View style={stylesGeneral.columnaDerecha}>
          {/* Título y botón corazón */}
          <View style={stylesGeneral.fila}>
            <View style={stylesGeneral.tituloContainer}>
              <Text style={[stylesGeneral.titulo, { color: colors.text }]}>{libro.nombre}</Text>
              <Text style={[stylesGeneral.titulo, { color: colors.text }]}>de: {libro.autor}</Text>
            </View>
            <View>
              {correoUsuario && (
                <TouchableOpacity onPress={handleCorazonPress} style={stylesGeneral.corazon}>
                  <FontAwesomeIcon
                    icon={esFavorito ? faHeartSolid : faHeartRegular}
                    size={30}
                    color={esFavorito ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Botones leer y añadir a lista */}
          <View style={stylesGeneral.fila}>
            <TouchableOpacity 
              style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
              onPress={handleLeer}
            >
              <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Leer</Text>
            </TouchableOpacity>

            {correoUsuario && (
              <TouchableOpacity 
                style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
                onPress={handleAñadirALista}
              >
                <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Añadir a lista</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>


      <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]} />


      {/* Sinopsis */}
      <View>
        <Text 
          style={[stylesGeneral.titulo, { color: colors.text }]}
        >
          Sinopsis
        </Text>
        <Text 
          style={[stylesGeneral.resumen, { color: colors.text }]}
          numberOfLines={mostrarResumenCompleto ? undefined : MAX_LINES}
          ellipsizeMode="tail"
        >
          {libro.resumen}
        </Text>
        {!esResumenCorto && (
          <TouchableOpacity onPress={() => setMostrarResumenCompleto(!mostrarResumenCompleto)}>
            <Text style={{ color: colors.button, fontWeight: 'bold', marginTop: 5, marginLeft: 10 }}>
              {mostrarResumenCompleto ? "Ver menos" : "Ver más"}
            </Text>
          </TouchableOpacity>
        )}
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
              <Text style={{ color: colors.text }}>palabras</Text>
            </View>
          </View>
        </View>
      </View>


      <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]} />


      {/* Más libros del autor */}
      {libro.autor !== "Anónimo" && librosDelAutor.length > 1 && (
        <View>
          <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Más de {libro.autor}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {librosDelAutor
              .filter((item) => item.nombre !== libro.nombre)
              .map((item) => (
              <TouchableOpacity
                key={item.enlace}
                onPress={() => navigation.push("Detalles", { libro: item })}
                style={{ marginRight: 10, alignItems: "center" }}
              >
                <Image
                  source={{ uri: item.imagen_portada }}
                  style={{ width: 100, height: 150, borderRadius: 5 }}
                />
                <Text
                  style={{ width: 100, textAlign: "center", color: colors.text }}
                  numberOfLines={2}
                >
                  {item.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[stylesGeneral.linea, { backgroundColor: colors.text }]} />
        
        </View>
      )}


      {/* Valoraciones del libro */}
      <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Valoraciones del libro:</Text>
        <View>
          <Text style={{ fontSize: 16 }}>{promedio} de 5</Text>
          <Text style={{ fontSize: 20 }}>
            {'⭐️'.repeat(Math.floor(promedio)) + '☆'.repeat(5 - Math.floor(promedio))}
          </Text>
        </View>
        {/* Barras de progreso */}
        {totalValoraciones > 0 && [5, 4, 3, 2, 1].map((num) => {
          const porcentaje = ((conteo[num] || 0) / totalValoraciones) * 100; // Calcula el porcentaje
          return (
            <View key={num} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
              <Text style={{ width: 50, color: colors.text }}>{num} ESTRELLA</Text>
              <View style={{ flex: 1, height: 8, backgroundColor: '#ddd', marginLeft: 5, borderRadius: 4 }}>
                <View style={{
                  height: '100%',
                  width: `${porcentaje}%`, // Ajusta el width dinámicamente
                  backgroundColor: '#FFD700',
                  borderRadius: 4
                }} />
              </View>
              <Text style={{ marginLeft: 5, color: colors.text }}>{conteo[num] || 0}</Text>
            </View>
          );
        })}

        {correoUsuario && (
          <TouchableOpacity 
            style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
            onPress={handleAñadirValoracion}
          >
            <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Añadir valoración</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Todas las reseñas del libro */}
      <View>
        <View>
          {valoraciones.length > 0 ? (
            <View>
              <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Todas las reseñas del libro:</Text>
              {valoraciones.map((item) => (
                <View key={`${item.usuario_id}-${item.libro_id}-${item.titulo_resena}`}>
                  <Text style={{ fontWeight: 'bold', color: colors.text }}>{item.titulo_resena}</Text>
                  <Text style={{ color: colors.text }}>{item.mensaje}</Text>
                  <Text style={{ color: "gray" }}>{item.usuario_id}{item.fecha}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: colors.text }}>Aún no hay valoraciones.</Text>
          )}
        </View>
      </View>

      {/* Modal para seleccionar la lista */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={stylesGeneral.modalContainer}>
          <View style={[stylesGeneral.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[stylesGeneral.modalTitle, { color: colors.text }]}>Selecciona una lista</Text>
            <FlatList
              data={listasUsuario}
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

// 📌 Estilos para la sección "Acerca de este libro"
const stylesAcercaDe = StyleSheet.create({
  columnas3: {
    flexDirection: 'row',
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
    justifyContent: 'left',
    alignItems: 'left',
  },
  icono: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
});

// 📌 Estilos generales para el diseño principal de la pantalla
const stylesGeneral = StyleSheet.create({
  // 📌 Sección superior (Portada + Información)
  containerPrincipio: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  columnaIzquierda: {
    flex: 1,  // Ocupa 1 parte del espacio disponible
    alignItems: 'center',
  },
  imagenPortada: {
    width: 120,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  columnaDerecha: {
    flex: 2,  // Ocupa 2 partes del espacio disponible
    paddingLeft: 16,
  },

  // 📌 Diseño de las filas en la interfaz
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tituloContainer: {
    flex: 1,  // Permite que el texto ocupe el espacio disponible
  },

  // 📌 Imagen de la portada en la sección de detalles del libro
  imagen_portada_libro: {
    width: 100,
    height: 150,
  },

  // 📌 Contenedor general
  container: {
    flexGrow: 1, // Asegura que el ScrollView no se expanda de más
    padding: 16,
  },

  // 📌 Línea divisoria entre secciones
  linea: {
    width: '100%',       // Ocupar todo el ancho disponible
    height: 1,          // Altura de la línea
    backgroundColor: '#000', // Color de la línea
    marginVertical: 5,
  },

  // 📌 Estilo del título de las secciones
  titulo: {
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
  },

  // 📌 Texto de la sinopsis
  resumen: {
    textAlign: 'justify',
    marginLeft: 10,
    marginRight: 10,
  },

  // 📌 Botones generales (Leer, Añadir a lista, etc.)
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

  // 📌 Icono de favorito (corazón)
  corazon: {
    marginHorizontal: 15,
  },
});
