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
import { StyleSheet, ScrollView, Text, TextInput, Switch, Image, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from 'react-native-vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFileWord } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import { API_URL } from "../../config";

// NECESITA QUE LE PASES EL LIBRO COMPLETO (enlace, sinopsis, autor, nombre, etc)
// 📌 Componente principal
export default function DetallesLibro({ route, correoUsuario }) {
  const { libro } = route.params;
  const navigation = useNavigation();
  const colors = useThemeColors();

  // 📌 Estados para manejo de la UI y datos
  const [esFavorito, setEsFavorito] = useState(false);
  const [listasUsuario, setListasUsuario] = useState([]);
  const [librosDelAutor, setLibrosDelAutor] = useState([]);
  const [mostrarResumenCompleto, setMostrarResumenCompleto] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [listasSeleccionadas, setListasSeleccionadas] = useState(new Set());
  const [showCrearListaModal, setShowCrearListaModal] = useState(false);

  // Datos del formulario para crear una lista rápidamente
  const [nombreNuevaLista, setNombreNuevaLista] = useState("");
  const [descripcionNuevaLista, setDescripcionNuevaLista] = useState("");
  const [publicaNuevaLista, setPublicaNuevaLista] = useState(false);

  // Variables para las valoraciones
  const opcionesOrden = [
    { id: 'alta', label: 'valoraciones más altas' },
    { id: 'baja', label: 'valoraciones más bajas' },
    { id: 'antigua', label: 'valoraciones más antiguas' },
    { id: 'reciente', label: 'valoraciones más recientes' },
    { id: 'ninguno', label: 'ninguno' },
  ];
  const [modalOrdenarVisible, setModalOrdenarVisible] = useState(false);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('ninguno');
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef(null);

  const [valoraciones, setValoraciones] = useState([]);
  const [valoracionesOrdenadas, setValoracionesOrdenadas] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [conteo, setConteo] = useState([]);
  const [totalValoraciones, setTotalValoraciones] = useState(null);
  const estrellasLlenas = Math.floor(promedio);
  const estrellasVacías = 5 - estrellasLlenas;

  // Constantes para la sinopsis
  const MAX_LINES = 6;  
  const MAX_CHARACTERS = 250;
  const esResumenCorto = libro.resumen.length <= MAX_CHARACTERS;


  // 📌 Efectos para cargar datos al montar el componente
  useEffect(() => {
    if (libro.autor !== "Anónimo") { obtenerMasLibrosDelAutor(); }
    obtenerValoraciones();
    if (correoUsuario) {
      obtenerListasUsuario();
      verificarSiEsFavorito();
      obtenerListasDondeEstaLibro();
    }
  }, []);
  
  // 📌 Efecto para actualizar valoraciones al reenfocar la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      obtenerValoraciones();
      if (correoUsuario) {
        obtenerListasUsuario();
      }
      
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

  // 📌 Función para obtener más libros del mismo autor
  const obtenerMasLibrosDelAutor = async () => {
    try {
      const response = await fetch(`${API_URL}/libros/autor/${libro.autor}`);

      if (!response.ok) {
        throw new Error("Error al obtener libros del autor " + libro.autor + ": " + response.error);
      }
      const data = await response.json();
      setLibrosDelAutor(data);
    } catch(error) {
      console.error(error);
    }
  }

  // 📌 Función para obtener valoraciones del libro
  const obtenerValoraciones = async () => {
    try {
      const enlaceCodificado = encodeURIComponent(libro.enlace);
      const response = await fetch(`${API_URL}/opiniones/${enlaceCodificado}`);

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
      const respuesta = await fetch(`${API_URL}/listas/${correoUsuario}`);
  
      if (!respuesta.ok) {
        throw new Error('No se pudieron obtener las listas del usuario');
      }
  
      const datos = await respuesta.json();
  
      // Filtrar listas para excluir "Leídos" y "En proceso"
      const listasFiltradas = datos.filter(lista => 
        lista.nombre !== "Leídos" && lista.nombre !== "En proceso"
      );
  
      setListasUsuario(listasFiltradas);
    } catch (error) {
      console.error('Error al obtener listas del usuario:', error);
    }
  };
  

  // 📌 Obtener las listas que YA contienen este libro
  const obtenerListasDondeEstaLibro = async () => {
    try {
      const enlaceCodificado = encodeURIComponent(libro.enlace);
      const respuesta = await fetch(`${API_URL}/listas/${correoUsuario}/${enlaceCodificado}/listas`);

      if (respuesta.status === 404) {
        // No pasa nada: simplemente no está en ninguna lista
        setListasSeleccionadas(new Set());
        return;
      }
  
      if (!respuesta.ok) {
        throw new Error('Error real del servidor');
      }

      const datos = await respuesta.json(); // datos será un array de objetos { nombre_lista, descripcion, publica, ... }

      // De esos objetos, extraemos nombre_lista para guardar en un Set
      const nombresListas = datos.map(item => item.nombre_lista);

      // Almacenamos en listasSeleccionadas (que es un Set) los nombres de listas que ya lo tienen
      setListasSeleccionadas(new Set(nombresListas));
    } catch (error) {
      console.error('Error al obtener las listas que ya tienen este libro:', error);
    }
  };

  // 📌 Función para verificar si el libro está marcado como favorito
  const verificarSiEsFavorito = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/listas/favoritos/${correoUsuario}`);
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

  // 📌 Función para añadir libro a favoritos
  const añadirAFavoritos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/listas/favoritos`, {
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

  // 📌 Función para eliminar libro de favoritos
  const eliminarDeFavoritos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/listas/favoritos`, {
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

  // 📌 Función para alternar estado de favorito
  const handleCorazonPress = () => {
    esFavorito ? eliminarDeFavoritos() : añadirAFavoritos();
  };

  // 📌 Función para añadir un libro a una lista personalizada del usuario
  const añadirLibroAListaPorNombre = async (nombreLista) => {
    try {
      const url = `${API_URL}/listas/${encodeURIComponent(nombreLista)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: correoUsuario,    // el correo del usuario
          libro_id: libro.enlace       // el enlace del libro que el backend espera en "libro_id"
        }),
      });

      if (!response.ok) {
        // Por ejemplo, si el libro ya existe en esa lista, tu backend retorna 409
        if (response.status === 409) {
          const msg = await response.text();
          Alert.alert('Aviso', msg); 
        } else {
          throw new Error('Error al añadir el libro a la lista');
        }
      }

      // Recargar listas para que se refleje el cambio
      obtenerListasDondeEstaLibro();
  
    } catch (error) {
      console.error('Error al añadir libro a la lista:', error);
      Alert.alert('Error', 'No se pudo añadir el libro a la lista');
    }
  };

  // 📌 Crea la función para eliminar de una lista:
  const eliminarLibroDeListaPorNombre = async (nombreLista) => {
    try {
      const url = `${API_URL}/listas/${encodeURIComponent(nombreLista)}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: correoUsuario,
          libro_id: libro.enlace,
        }),
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el libro de la lista');
      }
    } catch (error) {
      console.error('Error al eliminar libro de la lista:', error);
      Alert.alert('Error', 'No se pudo eliminar el libro de la lista');
    }
  };

  // 📌 Función para alternar la selección de una lista EN EL MOMENTO
  const toggleListaSeleccionada = async (nombreLista) => {
    setListasSeleccionadas((prevSeleccionadas) => {
      const nuevoSet = new Set(prevSeleccionadas);
      if (nuevoSet.has(nombreLista)) {
        // Estaba marcado => desmarcamos => ELIMINAR
        nuevoSet.delete(nombreLista);
        eliminarLibroDeListaPorNombre(nombreLista); 
      }
      else {
        // No estaba => marcamos => AÑADIR
        nuevoSet.add(nombreLista);
        añadirLibroAListaPorNombre(nombreLista); 
      }
      return nuevoSet;
    });
  };

  // 📌 Función para guardar el libro en múltiples listas seleccionadas
  const handleGuardarEnListas = async () => {
    try {
      // Recorres cada nombre de lista que el usuario marcó
      for (const nombreLista of listasSeleccionadas) {
        await añadirLibroAListaPorNombre(nombreLista);
      }
      Alert.alert('Guardado', 'El libro ha sido añadido a las listas seleccionadas.');
    } catch (error) {
      console.error('Error al guardar en listas:', error);
      Alert.alert('Error', 'No se pudo guardar el libro en las listas seleccionadas.');
    } finally {
      // Cerrar modal y limpiar selección
      setModalVisible(false);
      setListasSeleccionadas(new Set());
    }
  };

  // 📌 Navegar a la pantalla de lectura del libro
  const handleLeer = () => {
    navigation.navigate("LeerLibro", { libro, correoUsuario });
  };

  // 📌 Navegar a la pantalla para añadir una valoración al libro
  const handleAñadirValoracion = () => {
    navigation.navigate("AñadirValoracion", { libro, correoUsuario });
  };

  const handleCrearLista = async () => {
    if (!nombreNuevaLista.trim()) {
      Alert.alert("Error", "Por favor, ingresa un título para la lista");
      return;
    }
  
    try {
      const resp = await fetch(`${API_URL}/listas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: correoUsuario,
          nombre: nombreNuevaLista,
          descripcion: descripcionNuevaLista,
          publica: publicaNuevaLista,
          portada: null
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.error || 'Error al crear la lista');
      }

      // Añadir el libro a la nueva lista recién creada
      await añadirLibroAListaPorNombre(nombreNuevaLista);
      Alert.alert("Éxito", `Lista "${data.nombre}" creada.`);
      // Agregar la lista al estado para que se vea reflejada en la UI
      setListasUsuario(prev => [...prev, data]);

      // Cierro modal y limpio
      setShowCrearListaModal(false);
      setNombreNuevaLista("");
      setDescripcionNuevaLista("");
      setPublicaNuevaLista(false);
      
    } catch (error) {
      console.error("Error al crear lista:", error);
      Alert.alert("Error", "Hubo un problema al crear la lista");
    }
  };
  
  const handleCerrarModal = () => {
    setModalVisible(false);
    obtenerListasDondeEstaLibro(); // 📌 Recargar listas al cerrar
  };

  const handleOrdenarPor = () => {
    setModalOrdenarVisible(true);
  };

  useEffect(() => {
    setValoracionesOrdenadas(valoraciones);
  }, [valoraciones]);

  const seleccionarOrden = (opcion) => {
    setOrdenSeleccionado(opcion.label);
    setModalOrdenarVisible(false);

    let val = [...valoraciones];

    switch (opcion.id) {
      case 'alta':
        val.sort((a, b) => b.valor - a.valor);
        break;
      case 'baja':
        val.sort((a, b) => a.valor - b.valor);
        break;
      case 'antigua':
        val.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        break;
      case 'reciente':
        val.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        break;
      case 'ninguno':
      default:
        val = [...valoraciones]; // Restaurar sin ordenar
        break;
    }

    setValoracionesOrdenadas(val);
  };

  // 📌 Renderización del componente
  return (
    <ScrollView contentContainerStyle={[stylesGeneral.container, { backgroundColor: colors.background }]}>

      {/* 📌 SECCIÓN PRINCIPAL del libro: Portada + Información */}
      <View style={stylesGeneral.containerPrincipio}>

        {/* 📌 Portada del libro */}
        <View style={stylesGeneral.columnaIzquierda}>
          <Image 
            source={{ uri: libro.imagen_portada }}
            style={stylesGeneral.imagen_portada_libro} 
          />
        </View>

        {/* 📌 Información del libro y botones */}
        <View style={stylesGeneral.columnaDerecha}>

          {/* 📌 Título y botón de favorito */}
          <View style={stylesGeneral.fila}>
            <View style={stylesGeneral.tituloContainer}>
              <Text style={[stylesGeneral.titulo, { color: colors.text }]}>{libro.nombre}</Text>
              <Text style={[stylesGeneral.titulo, { color: colors.text }]}>de: {libro.autor}</Text>
            </View>
            <View>
              {correoUsuario && (
                <TouchableOpacity onPress={handleCorazonPress}>
                  <Ionicons
                    name={esFavorito ? 'heart' : 'heart-outline'}
                    size={30}
                    color={esFavorito ? 'red' : colors.iconBorder }
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* 📌 Botones: Leer */}
          <View style={[stylesGeneral.fila, { flexWrap: 'wrap' }]}>
            <TouchableOpacity 
              style={[stylesGeneral.boton, { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.buttonDark }]} 
              onPress={handleLeer}
            >
              <Ionicons
                name='book'
                size={15}
                color={ colors.buttonTextDark }
                style={{ marginRight: 5 }}
              />
              <Text style={[{ color: colors.buttonTextDark }]}>Leer</Text>
            </TouchableOpacity>

            {/* 📌 Botones: Añadir a lista */}
            {correoUsuario && (
              <TouchableOpacity 
                style={[stylesGeneral.boton, { marginLeft: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.buttonDark }]} 
                onPress={() => setModalVisible(true)}
              >
                <Ionicons
                  name='add'
                  size={17}
                  color={ colors.buttonTextDark }
                  style={{ marginRight: 5 }}
                />
                <Text style={[{ color: colors.buttonTextDark }]}>Añadir a lista</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 📌 Línea divisoria */}
      <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

      {/* 📌 Más libros del autor */}
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

          <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />
        
        </View>
      )}


      {/* 📌 Sinopsis del libro */}
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
            <Text style={{ color: colors.buttonTextLight, fontWeight: 'bold', marginTop: 5, marginLeft: 10 }}>
              {mostrarResumenCompleto ? "Ver menos" : "Ver más"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 📌 Línea divisoria */}
      <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]}/>

      {/* 📌 Sección de información adicional del libro */}
      <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Acerca de este libro</Text>
        <View style={stylesAcercaDe.columnas3}>
          
          {/* 📌 Número de páginas */}
          <View style={stylesAcercaDe.columna}>
            <Ionicons name="book" size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} />
            {/* <FontAwesomeIcon icon={faBook} style={[stylesAcercaDe.icono, { color: colors.text }]} /> */}
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text style={{ color: colors.text }}>{libro.num_paginas}</Text>
              <Text style={{ color: colors.text }}>páginas</Text>
            </View>
          </View>
          
          {/* 📌 Tiempo estimado de lectura */}
          <View style={stylesAcercaDe.columna}>
            <Ionicons name="time" size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} />
            {/* <FontAwesomeIcon icon={faClock} style={[stylesAcercaDe.icono, { color: colors.text }]} /> */}
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text style={{ color: colors.text }}>{libro.horas_lectura}</Text>
              <Text style={{ color: colors.text }}>horas</Text>
            </View>
          </View>
          
          {/* 📌 Cantidad total de palabras */}
          <View style={stylesAcercaDe.columna}>
            <FontAwesomeIcon icon={faFileWord} size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} />
            {/* <Ionicons name="text" size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} /> */}
            {/* <FontAwesomeIcon icon={faFileWord} style={[stylesAcercaDe.icono, { color: colors.text }]} /> */}
            <View style={stylesAcercaDe.textoSubcolumna}>
              <Text style={{ color: colors.text }}>{libro.num_palabras}</Text>
              <Text style={{ color: colors.text }}>palabras</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 📌 Línea divisoria */}
      <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

    
      {/* 📌 Sección de valoraciones */}
      <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Valoraciones del libro:</Text>
        <View>
          <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={[{ color: colors.text }]}>Valoración general:   </Text>
            <Text style={[{ fontSize: 16, color: colors.text }]}>{promedio} de 5</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
            {Array(estrellasLlenas).fill(<Ionicons name="star" size={20} color={colors.star} />)}
            {Array(estrellasVacías).fill(<Ionicons name="star-outline" size={20} color={colors.iconBorder} />)}
            <Text style={[{ color: colors.text, marginLeft: 5 }]}>({totalValoraciones})</Text>
            {/* {'⭐️'.repeat(Math.floor(promedio)) + '☆'.repeat(5 - Math.floor(promedio))} */}
          </View>
        </View>
        
        {/* 📌 Barras de progreso de valoraciones */}
        {totalValoraciones > 0 && [5, 4, 3, 2, 1].map((num) => {
          const porcentaje = ((conteo[num] || 0) / totalValoraciones) * 100; // Calcula el porcentaje
          return (
            <View key={num} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
              <Text style={{ width: 100, color: colors.text }}>{num} ESTRELLA{num !== 1 && 'S'}</Text>
              <View style={{ flex: 1, height: 8, backgroundColor: colors.progressNotFilled, marginLeft: 5, borderRadius: 4 }}>
                <View style={{
                  height: '100%',
                  width: `${porcentaje}%`, // Ajusta el width dinámicamente
                  backgroundColor: colors.progressFilled,
                  borderRadius: 4
                }} />
              </View>
              <Text style={{ marginLeft: 5, color: colors.text }}>{conteo[num] || 0}</Text>
            </View>
          );
        })}

        {correoUsuario && (
          <TouchableOpacity 
            style={[stylesGeneral.boton, { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.buttonDark }]} 
            onPress={handleAñadirValoracion}
          >
            <Ionicons
              name='add'
              size={17}
              color={ colors.buttonTextDark }
              style={{ marginRight: 5 }}
            />
            <Text style={[{ color: colors.buttonTextDark }]}>Añadir valoración</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

      {/* 📌 Todas las reseñas del libro */}
      <View>
        <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Todas las reseñas del libro:</Text>
          {valoraciones.length > 0 ? (
            <View>
              <TouchableOpacity 
                style={[stylesGeneral.boton, { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.buttonDark }]} 
                onPress={handleOrdenarPor}
              >
                <Text style={[{ color: colors.buttonTextDark }]}>{ordenSeleccionado === 'ninguno' ? 'Ordenar por:' : `Ordenado por: ${ordenSeleccionado}`}</Text>
                <Ionicons
                  name='caret-down'
                  size={15}
                  color={ colors.buttonTextDark }
                  style={{ marginLeft: 7 }}
                />
              </TouchableOpacity>

              {/* Modal que despliega las opciones de ordenación */}
              <Modal
                visible={modalOrdenarVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalOrdenarVisible(false)}
              >
                <TouchableOpacity
                  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => setModalOrdenarVisible(false)}
                >
                  <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, width: 250 }}>
                    <Text style={{ fontWeight: 'bold' }}>Ordenar por:</Text>
                    <FlatList
                      data={opcionesOrden}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={{ padding: 10 }}
                          onPress={() => seleccionarOrden(item)}
                        >
                          <Text>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>

              {valoracionesOrdenadas.map((item) => (
                <View key={`${item.usuario_id}-${item.libro_id}-${item.titulo_resena}-${item.fecha}`}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', color: colors.text }}>{item.titulo_resena} </Text>
                    {Array(item.valor).fill().map((_, index) => (
                      <Ionicons key={index} name="star" size={13} color={ colors.star } />
                    ))}
                  </View>
                  <Text style={{ color: colors.text }}>{item.mensaje}</Text>
                  <Text style={{ color: colors.textTerciary }}>Por {item.usuario_id} el {item.fecha}</Text>
                
                  <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 1 }]} />
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: colors.text }}>Aún no hay valoraciones</Text>
          )}
        </View>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }} // Coloca el modal en la parte inferior
      >
        <View style={{ backgroundColor: colors.backgroundModal, padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '50%', }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textDark }}>Guardar en...</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={listasUsuario.filter((lista) => lista.nombre !== "Mis Favoritos")}
            keyExtractor={(item) => item.nombre}
            renderItem={({ item }) => {
              const isSelected = listasSeleccionadas.has(item.nombre);

              return (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}
                  onPress={() => toggleListaSeleccionada(item.nombre)}
                >
                  {/* Caja visual para simular un checkbox */}
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: colors.textDark,
                      backgroundColor: colors.backgroundCheckbox,
                      marginRight: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {/* Si está seleccionado, muestra un check (puedes usar texto o un ícono) */}
                    {isSelected && (
                      <Text style={{ color: colors.textDark, fontWeight: 'bold' }}>✓</Text>
                    )}
                  </View>

                  {/* Nombre de la lista */}
                  <Text style={{ flex: 1 }}>{item.nombre}</Text>
                  
                  {/* Mostrar candado si la lista es privada (según tu lógica) */}
                  {!item.publica && <Text>🔒</Text>}
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            style={{
              marginTop: 10,
              padding: 12,
              backgroundColor: colors.button,
              borderRadius: 22,
              
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate("CrearLista")}
          >
            <Text style={{ color: colors.textLight, fontWeight: 'bold', fontSize: 15 }}>+ Nueva lista</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </ScrollView>
  );
}

// 📌 Estilos para la sección "Acerca de este libro"
const stylesAcercaDe = StyleSheet.create({
  columnas3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  columna: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  subcolumna: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '10',
  },
  textoSubcolumna: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  icono: {
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
  columnaDerecha: {
    flex: 2,  // Ocupa 2 partes del espacio disponible
    paddingLeft: 16,
  },

  // 📌 Diseño de las filas en la interfaz
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexGrow: 1,
    padding: 16,
  },

  // 📌 Línea divisoria entre secciones
  linea: {
    width: '100%',
    marginVertical: 5,
  },

  // 📌 Estilo del título de las secciones
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});