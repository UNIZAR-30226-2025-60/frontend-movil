// /**
//  * Archivo: DetallesLibro.js
//  * Descripción: Pantalla de detalles de un libro.
//  * Contenido:
//  *  - Muestra información detallada de un libro (portada, sinopsis, autor, etc.)
//  *  - Permite al usuario marcar el libro como favorito
//  *  - Posibilita añadir el libro a listas personalizadas
//  *  - Muestra valoraciones y otros libros del mismo autor
//  */

// // 📌 Importaciones necesarias
// import React, { useState, useEffect, useRef } from 'react';
// import { StyleSheet, ScrollView, Text, TextInput, Switch, Image, View, TouchableOpacity, Alert, FlatList } from 'react-native';
// import Modal from 'react-native-modal';
// import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
// import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
// import { Ionicons } from 'react-native-vector-icons'
// import { useNavigation } from '@react-navigation/native';
// import { useThemeColors } from "../componentes/Tema";
// import { API_URL } from "../../config";

// // NECESITA QUE LE PASES EL LIBRO COMPLETO (enlace, sinopsis, autor, nombre, etc)
// // 📌 Componente principal
// export default function DetallesLibro({ route, correoUsuario }) {
//   const { libro } = route.params;
//   const navigation = useNavigation();
//   const colors = useThemeColors();

//   // 📌 Estados para manejo de la UI y datos
//   const [esFavorito, setEsFavorito] = useState(false);
//   const [listasUsuario, setListasUsuario] = useState([]);
//   const [librosDelAutor, setLibrosDelAutor] = useState([]);
//   const [mostrarResumenCompleto, setMostrarResumenCompleto] = useState(false);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [listasSeleccionadas, setListasSeleccionadas] = useState(new Set());
//   const [showCrearListaModal, setShowCrearListaModal] = useState(false);
//   const [valoraciones, setValoraciones] = useState([]);
//   const [promedio, setPromedio] = useState(null);
//   const [conteo, setConteo] = useState([]);
//   const [totalValoraciones, setTotalValoraciones] = useState(null);
//   const estrellasLlenas = Math.floor(promedio);
//   const estrellasVacías = 5 - estrellasLlenas;

//   // Datos del formulario para crear una lista rápidamente
//   const [nombreNuevaLista, setNombreNuevaLista] = useState("");
//   const [descripcionNuevaLista, setDescripcionNuevaLista] = useState("");
//   const [publicaNuevaLista, setPublicaNuevaLista] = useState(false);

//   //  📌 Variables para mostrar la sinopsis del libro
//   const MAX_LINES = 6;  
//   const MAX_CHARACTERS = 250;
//   const esResumenCorto = libro.resumen.length <= MAX_CHARACTERS;


//   // 📌 Efectos para cargar datos al montar el componente
//   useEffect(() => {
//     if (libro.autor !== "Anónimo") { obtenerMasLibrosDelAutor(); }
//     obtenerValoraciones();
//     if (correoUsuario) {
//       obtenerListasUsuario();
//       verificarSiEsFavorito();
//       obtenerListasDondeEstaLibro();
//     }
//   }, []);
  
//   // 📌 Efecto para actualizar valoraciones al reenfocar la pantalla
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       obtenerValoraciones();
//     });
//     return unsubscribe;
//   }, [navigation]);

//   // 📌 Efecto para calcular estadísticas de valoraciones
//   useEffect(() => {
//     const conteoAux = valoraciones.reduce((acc, valoracion) => {
//       acc[valoracion.valor] = (acc[valoracion.valor] || 0) + 1;
//       return acc;
//     }, {});

//     setConteo(conteoAux);
//     const totalValoracionesAux = valoraciones.length;
//     setTotalValoraciones(totalValoracionesAux);
//     const sumaValores = valoraciones.reduce((sum, valoracion) => sum + valoracion.valor, 0);
//     const promedioAux = totalValoracionesAux > 0 ? (sumaValores / totalValoracionesAux).toFixed(1) : "0.0";
//     setPromedio(promedioAux);
//   }, [valoraciones]);

//   // 📌 Función para obtener más libros del mismo autor
//   const obtenerMasLibrosDelAutor = async () => {
//     try {
//       const response = await fetch(`${API_URL}/libros/autor/${libro.autor}`);

//       if (!response.ok) {
//         throw new Error("Error al obtener libros del autor " + libro.autor + ": " + response.error);
//       }
//       const data = await response.json();
//       setLibrosDelAutor(data);
//     } catch(error) {
//       console.error(error);
//     }
//   }

//   // 📌 Función para obtener valoraciones del libro
//   const obtenerValoraciones = async () => {
//     try {
//       const enlaceCodificado = encodeURIComponent(libro.enlace);
//       const response = await fetch(`${API_URL}/opiniones/${enlaceCodificado}`);

//       if (!response.ok) {
//         throw new Error("Error al obtener las valoraciones del libro " + libro.nombre + ": " + response.error);
//       }
//       const data = await response.json();
//       // Transformar fecha eliminando lo sobrante
//       const dataTransformada = data.map(item => ({
//         ...item,
//         fecha: item.fecha?.split("T")[0] || item.fecha,
//       }));
//       setValoraciones(dataTransformada);
//     } catch(error) {
//       console.error(error);
//     }
//   }

//   // 📌 Función para obtener listas personalizadas del usuario
//   const obtenerListasUsuario = async () => {
//     try {
//       const respuesta = await fetch(`${API_URL}/listas/${correoUsuario}`);

//       if (!respuesta.ok) {
//         // Manejo de error: podría ser 404 si no hay listas, etc.
//         throw new Error('No se pudieron obtener las listas del usuario');
//       }
//       const datos = await respuesta.json();
//       setListasUsuario(datos);
//     } catch (error) {
//       console.error('Error al obtener listas del usuario:', error);
//     }
//   };

//   // 📌 Obtener las listas que YA contienen este libro
//   const obtenerListasDondeEstaLibro = async () => {
//     try {
//       const enlaceCodificado = encodeURIComponent(libro.enlace);
//       const respuesta = await fetch(`${API_URL}/listas/${correoUsuario}/${enlaceCodificado}/listas`);

//       if (respuesta.status === 404) {
//         // No pasa nada: simplemente no está en ninguna lista
//         setListasSeleccionadas(new Set());
//         return;
//       }
  
//       if (!respuesta.ok) {
//         throw new Error('Error real del servidor');
//       }

//       const datos = await respuesta.json(); // datos será un array de objetos { nombre_lista, descripcion, publica, ... }

//       // De esos objetos, extraemos nombre_lista para guardar en un Set
//       const nombresListas = datos.map(item => item.nombre_lista);

//       // Almacenamos en listasSeleccionadas (que es un Set) los nombres de listas que ya lo tienen
//       setListasSeleccionadas(new Set(nombresListas));
//     } catch (error) {
//       console.error('Error al obtener las listas que ya tienen este libro:', error);
//     }
//   };

//   // 📌 Función para verificar si el libro está marcado como favorito
//   const verificarSiEsFavorito = async () => {
//     try {
//       const respuesta = await fetch(`${API_URL}/listas/favoritos/${correoUsuario}`);
//       const textoRespuesta = await respuesta.text(); // 📌 Leer como texto primero

//       // 📌 Verificar si la respuesta es JSON antes de intentar parsearla
//       if (textoRespuesta.startsWith("{") || textoRespuesta.startsWith("[")) {
//         const favoritos = JSON.parse(textoRespuesta); // Convertir en JSON si es válido
//         const encontrado = Array.isArray(favoritos) && favoritos.some(fav => fav.enlace_libro === libro.enlace);
//         setEsFavorito(encontrado);
//       } else {
//         //console.warn("El backend devolvió texto en lugar de JSON:", textoRespuesta);
//         setEsFavorito(false); // Si no es JSON, asumimos que no hay favoritos
//       }
//     } catch (error) {
//       console.error('Error al verificar favoritos:', error);
//       setEsFavorito(false); // En caso de fallo, asumimos que no es favorito
//     }
//   };

//   // 📌 Función para añadir libro a favoritos
//   const añadirAFavoritos = async () => {
//     try {
//       const respuesta = await fetch(`${API_URL}/listas/favoritos`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           usuario_id: correoUsuario,
//           enlace_libro: libro.enlace,
//         }),
//       });
//       if (respuesta.ok) {
//         setEsFavorito(true);
//         Alert.alert('Añadido', 'El libro se ha añadido a tus favoritos');
//       } else {
//         Alert.alert('Error', 'No se pudo añadir el libro a favoritos');
//       }
//     } catch (error) {
//       console.error('Error al añadir a favoritos:', error);
//     }
//   };

//   // 📌 Función para eliminar libro de favoritos
//   const eliminarDeFavoritos = async () => {
//     try {
//       const respuesta = await fetch(`${API_URL}/listas/favoritos`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           usuario_id: correoUsuario,
//           enlace_libro: libro.enlace,
//         }),
//       });
//       if (respuesta.ok) {
//         setEsFavorito(false);
//         Alert.alert('Eliminado', 'El libro se ha eliminado de tus favoritos');
//       } else {
//         Alert.alert('Error', 'No se pudo eliminar el libro de favoritos');
//       }
//     } catch (error) {
//       console.error('Error al eliminar de favoritos:', error);
//     }
//   };

//   // 📌 Función para alternar estado de favorito
//   const handleCorazonPress = () => {
//     esFavorito ? eliminarDeFavoritos() : añadirAFavoritos();
//   };

//   // 📌 Función para añadir un libro a una lista personalizada del usuario
//   const añadirLibroAListaPorNombre = async (nombreLista) => {
//     try {
//       const url = `${API_URL}/listas/${encodeURIComponent(nombreLista)}`;
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           usuario_id: correoUsuario,    // el correo del usuario
//           libro_id: libro.enlace       // el enlace del libro que el backend espera en "libro_id"
//         }),
//       });

//       if (!response.ok) {
//         // Por ejemplo, si el libro ya existe en esa lista, tu backend retorna 409
//         if (response.status === 409) {
//           const msg = await response.text();
//           Alert.alert('Aviso', msg); 
//         } else {
//           throw new Error('Error al añadir el libro a la lista');
//         }
//       }

//       // Recargar listas para que se refleje el cambio
//       obtenerListasDondeEstaLibro();
  
//     } catch (error) {
//       console.error('Error al añadir libro a la lista:', error);
//       Alert.alert('Error', 'No se pudo añadir el libro a la lista');
//     }
//   };

//   // 📌 Crea la función para eliminar de una lista:
//   const eliminarLibroDeListaPorNombre = async (nombreLista) => {
//     try {
//       const url = `${API_URL}/listas/${encodeURIComponent(correoUsuario)}/${encodeURIComponent(nombreLista)}`;
//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           usuario_id: correoUsuario,
//           libro_id: libro.enlace,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Error al eliminar el libro de la lista');
//       }
//     } catch (error) {
//       console.error('Error al eliminar libro de la lista:', error);
//       Alert.alert('Error', 'No se pudo eliminar el libro de la lista');
//     }
//   };

//   // Función para alternar la selección de una lista EN EL MOMENTO
//   const toggleListaSeleccionada = async (nombreLista) => {
//     setListasSeleccionadas((prevSeleccionadas) => {
//       const nuevoSet = new Set(prevSeleccionadas);
//       if (nuevoSet.has(nombreLista)) {
//         // Estaba marcado => desmarcamos => ELIMINAR
//         nuevoSet.delete(nombreLista);
//         eliminarLibroDeListaPorNombre(nombreLista); 
//       }
//       else {
//         // No estaba => marcamos => AÑADIR
//         nuevoSet.add(nombreLista);
//         añadirLibroAListaPorNombre(nombreLista); 
//       }
//       return nuevoSet;
//     });
//   };

//   // 📌 Función para guardar el libro en múltiples listas seleccionadas
//   const handleGuardarEnListas = async () => {
//     try {
//       // Recorres cada nombre de lista que el usuario marcó
//       for (const nombreLista of listasSeleccionadas) {
//         await añadirLibroAListaPorNombre(nombreLista);
//       }
//       Alert.alert('Guardado', 'El libro ha sido añadido a las listas seleccionadas.');
//     } catch (error) {
//       console.error('Error al guardar en listas:', error);
//       Alert.alert('Error', 'No se pudo guardar el libro en las listas seleccionadas.');
//     } finally {
//       // Cerrar modal y limpiar selección
//       setModalVisible(false);
//       setListasSeleccionadas(new Set());
//     }
//   };

//   // 📌 Navegar a la pantalla de lectura del libro
//   const handleLeer = () => {
//     navigation.navigate("LeerLibro", { libro, correoUsuario });
//   };

//   // 📌 Navegar a la pantalla para añadir una valoración al libro
//   const handleAñadirValoracion = () => {
//     navigation.navigate("AñadirValoracion", { libro, correoUsuario });
//   };

//   const handleCrearLista = async () => {
//     if (!nombreNuevaLista.trim()) {
//       Alert.alert("Error", "Por favor, ingresa un título para la lista");
//       return;
//     }
  
//     try {
//       const resp = await fetch(`${API_URL}/listas`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           usuario_id: correoUsuario,
//           nombre: nombreNuevaLista,
//           descripcion: descripcionNuevaLista,
//           publica: publicaNuevaLista,
//           portada: null
//         }),
//       });

//       const data = await resp.json();

//       if (!resp.ok) {
//         throw new Error(data?.error || 'Error al crear la lista');
//       }

//       // Añadir el libro a la nueva lista recién creada
//       await añadirLibroAListaPorNombre(nombreNuevaLista);
//       Alert.alert("Éxito", `Lista "${data.nombre}" creada.`);
//       // Agregar la lista al estado para que se vea reflejada en la UI
//       setListasUsuario(prev => [...prev, data]);

//       // Cierro modal y limpio
//       setShowCrearListaModal(false);
//       setNombreNuevaLista("");
//       setDescripcionNuevaLista("");
//       setPublicaNuevaLista(false);
      
//     } catch (error) {
//       console.error("Error al crear lista:", error);
//       Alert.alert("Error", "Hubo un problema al crear la lista");
//     }
//   };
  
//   const handleCerrarModal = () => {
//     setModalVisible(false);
//     obtenerListasDondeEstaLibro(); // 📌 Recargar listas al cerrar
//   };

//   // 📌 Renderización del componente
//   return (
//     <ScrollView contentContainerStyle={[stylesGeneral.container, { backgroundColor: colors.background }]}>

//       {/* SECCIÓN PRINCIPAL del libro: Portada + Información */}
//       <View style={stylesGeneral.containerPrincipio}>

//         {/* Portada del libro */}
//         <View style={stylesGeneral.columnaIzquierda}>
//           <Image 
//             source={{ uri: libro.imagen_portada }}
//             style={stylesGeneral.imagen_portada_libro} 
//           />
//         </View>

//         {/* Información del libro y botones */}
//         <View style={stylesGeneral.columnaDerecha}>

//           {/* Título y botón de favorito */}
//           <View style={stylesGeneral.fila}>
//             <View style={stylesGeneral.tituloContainer}>
//               <Text style={[stylesGeneral.titulo, { color: colors.text }]}>{libro.nombre}</Text>
//               <Text style={[stylesGeneral.titulo, { color: colors.text }]}>de: {libro.autor}</Text>
//             </View>
//             <View>
//               {correoUsuario && (
//                 <TouchableOpacity onPress={handleCorazonPress} style={stylesGeneral.corazon}>
//                   <Ionicons
//                     name={esFavorito ? 'heart' : 'heart-outline'}
//                     size={30}
//                     color={esFavorito ? 'red' : 'gray'}
//                   />
//                   {/* <FontAwesomeIcon
//                     icon={esFavorito ? faHeartSolid : faHeartRegular}
//                     size={30}
//                     color={esFavorito ? 'red' : 'gray'}
//                   /> */}
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
          
//           {/* Botones: Leer */}
//           <View style={stylesGeneral.fila}>
//             <TouchableOpacity 
//               style={[stylesGeneral.boton, { backgroundColor: colors.buttonDark }]} 
//               onPress={handleLeer}
//             >
//               <Text style={[stylesGeneral.textoBoton, { color: colors.buttonTextDark }]}>Leer</Text>
//             </TouchableOpacity>

//             {/* Botones: Añadir a lista */}
//             {correoUsuario && (
//               <TouchableOpacity 
//                 style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
//                 onPress={() => setModalVisible(true)}
//               >
//                 <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Añadir a lista</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>

//       <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

//       {/* Sinopsis del libro */}
//       <View>
//         <Text 
//           style={[stylesGeneral.titulo, { color: colors.text }]}
//         >
//           Sinopsis
//         </Text>
//         <Text 
//           style={[stylesGeneral.resumen, { color: colors.text }]}
//           numberOfLines={mostrarResumenCompleto ? undefined : MAX_LINES}
//           ellipsizeMode="tail"
//         >
//           {libro.resumen}
//         </Text>
//         {!esResumenCorto && (
//           <TouchableOpacity onPress={() => setMostrarResumenCompleto(!mostrarResumenCompleto)}>
//             <Text style={{ color: colors.button, fontWeight: 'bold', marginTop: 5, marginLeft: 10 }}>
//               {mostrarResumenCompleto ? "Ver menos" : "Ver más"}
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

//       {/* Sección de información adicional del libro */}
//       <View>
//         <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Acerca de este libro</Text>
//         <View style={stylesAcercaDe.columnas3}>
          
//           {/* Número de páginas */}
//           <View style={stylesAcercaDe.columna}>
//             <Ionicons name="book" size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} />
//             <View style={stylesAcercaDe.textoSubcolumna}>
//               <Text style={{ color: colors.text }}>{libro.num_paginas}</Text>
//               <Text style={{ color: colors.text }}>páginas</Text>
//             </View>
//           </View>
          
//           {/* Tiempo estimado de lectura */}
//           <View style={stylesAcercaDe.columna}>
//             <Ionicons name="time" size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} />
//             <View style={stylesAcercaDe.textoSubcolumna}>
//               <Text style={{ color: colors.text }}>{libro.horas_lectura}</Text>
//               <Text style={{ color: colors.text }}>horas de lectura</Text>
//             </View>
//           </View>
          
//           {/* Cantidad total de palabras */}
//           <View style={stylesAcercaDe.columna}>
//             <Ionicons name="text" size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} />
//             <View style={stylesAcercaDe.textoSubcolumna}>
//               <Text style={{ color: colors.text }}>{libro.num_palabras}</Text>
//               <Text style={{ color: colors.text }}>palabras</Text>
//             </View>
//           </View>
//         </View>
//       </View>

//       <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

//       {/* Más libros del autor */}
//       {libro.autor !== "Anónimo" && librosDelAutor.length > 1 && (
//         <View>
//           <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Más de {libro.autor}</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {librosDelAutor
//               .filter((item) => item.nombre !== libro.nombre)
//               .map((item) => (
//               <TouchableOpacity
//                 key={item.enlace}
//                 onPress={() => navigation.push("Detalles", { libro: item })}
//                 style={{ marginRight: 10, alignItems: "center" }}
//               >
//                 <Image
//                   source={{ uri: item.imagen_portada }}
//                   style={{ width: 100, height: 150, borderRadius: 5 }}
//                 />
//                 <Text
//                   style={{ width: 100, textAlign: "center", color: colors.text }}
//                   numberOfLines={2}
//                 >
//                   {item.nombre}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />
        
//         </View>
//       )}

//       {/* Sección de valoraciones */}
//       <View>
//         <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Valoraciones del libro:</Text>
//         <View>
//           <Text style={[{color: colors.text}]}>Valoración general</Text>
//           <Text style={{ fontSize: 16 }}>{promedio} de 5</Text>
//           <Text style={{ fontSize: 20, marginBottom: 7 }}>
//             {Array(estrellasLlenas).fill(<Ionicons name="star" size={24} color={colors.star} />)}
//             {Array(estrellasVacías).fill(<Ionicons name="star-outline" size={22} color={colors.border} />)}
//           </Text>
//         </View>
        
//         {/* Barras de progreso de valoraciones */}
//         {totalValoraciones > 0 && [5, 4, 3, 2, 1].map((num) => {
//           const porcentaje = ((conteo[num] || 0) / totalValoraciones) * 100; // Calcula el porcentaje
//           return (
//             <View key={num} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
//               <Text style={{ width: 100, color: colors.text }}>{num} ESTRELLA</Text>
//               <View style={{ flex: 1, height: 8, backgroundColor: colors.progressNotFilled, marginLeft: 5, borderRadius: 4 }}>
//                 <View style={{
//                   height: '100%',
//                   width: `${porcentaje}%`, // Ajusta el width dinámicamente
//                   backgroundColor: colors.progressFilled,
//                   borderRadius: 4
//                 }} />
//               </View>
//               <Text style={{ marginLeft: 5, color: colors.text }}>{conteo[num] || 0}</Text>
//             </View>
//           );
//         })}

//         {correoUsuario && (
//           <TouchableOpacity 
//             style={[stylesGeneral.boton, { backgroundColor: colors.button }]} 
//             onPress={handleAñadirValoracion}
//           >
//             <Text style={[stylesGeneral.textoBoton, { color: colors.buttonText }]}>Añadir valoración</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

//       {/* Todas las reseñas del libro */}
//       <View>
//         <View>
//           {valoraciones.length > 0 ? (
//             <View>
//               <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Todas las reseñas del libro:</Text>
//               {valoraciones.map((item) => (
//                 <View key={`${item.usuario_id}-${item.libro_id}-${item.titulo_resena}`}>
//                   <Text style={{ fontWeight: 'bold', color: colors.text }}>{item.titulo_resena}</Text>
//                   <Text style={{ color: colors.text }}>{item.mensaje}</Text>
//                   <Text style={{ color: colors.textTerciary }}>{item.usuario_id}  {item.fecha}</Text>

//                   <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 1 }]} />
//                 </View>
//               ))}
//             </View>
//           ) : (
//             <Text style={{ color: colors.text }}>Aún no hay valoraciones.</Text>
//           )}
//         </View>
//       </View>

//       <Modal
//         isVisible={isModalVisible}
//         onBackdropPress={() => setModalVisible(false)}
//         style={{ justifyContent: 'flex-end', margin: 0 }} // Coloca el modal en la parte inferior
//       >
//         <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '50%', }}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Guardar en...</Text>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={{ fontSize: 18, fontWeight: 'bold' }}>X</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={listasUsuario.filter((lista) => lista.nombre !== "Mis Favoritos")}
//             keyExtractor={(item) => item.nombre}
//             renderItem={({ item }) => {
//               const isSelected = listasSeleccionadas.has(item.nombre);

//               return (
//                 <TouchableOpacity
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     marginVertical: 10,
//                   }}
//                   onPress={() => toggleListaSeleccionada(item.nombre)}
//                 >
//                   {/* Caja visual para simular un checkbox */}
//                   <View
//                     style={{
//                       width: 24,
//                       height: 24,
//                       borderRadius: 4,
//                       borderWidth: 2,
//                       borderColor: colors.border,
//                       marginRight: 8,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       // Si está seleccionado, fondo azul, si no, transparente
//                       backgroundColor: isSelected ? colors.background : 'transparent',
//                     }}
//                   >
//                     {/* Si está seleccionado, muestra un check (puedes usar texto o un ícono) */}
//                     {isSelected && (
//                       <Text style={{ color: colors.text, fontWeight: 'bold' }}>✓</Text>
//                     )}
//                   </View>

//                   {/* Nombre de la lista */}
//                   <Text style={{ flex: 1 }}>{item.nombre}</Text>
                  
//                   {/* Mostrar candado si la lista es privada (según tu lógica) */}
//                   {!item.publica && <Text>🔒</Text>}
//                 </TouchableOpacity>
//               );
//             }}
//           />

//           <TouchableOpacity
//             style={{
//               marginTop: 10,
//               padding: 12,
//               backgroundColor: colors.background,
//               borderRadius: 6,
//               alignItems: 'center',
//             }}
//             onPress={() => setShowCrearListaModal(true)}
//           >
//             <Text style={{ color: colors.text, fontWeight: 'bold' }}>+ Nueva lista</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>

//       <Modal
//         isVisible={showCrearListaModal}
//         onBackdropPress={handleCerrarModal}
//         onModalHide={() => {
//           setNombreNuevaLista("");
//           setDescripcionNuevaLista("");
//           setPublicaNuevaLista(false);
//         }}
//       >
//         <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12 }}>
//           <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Nueva lista</Text>
          
//           <TextInput
//             placeholder="Elige un título"
//             value={nombreNuevaLista}
//             onChangeText={setNombreNuevaLista}
//             style={{
//               borderWidth: 1, 
//               borderColor: colors.border, 
//               marginVertical: 8,
//               padding: 8,
//               borderRadius: 6,
//             }}
//           />

//           <TextInput
//             placeholder="Descripción (opcional)"
//             value={descripcionNuevaLista}
//             onChangeText={setDescripcionNuevaLista}
//             style={{
//               borderWidth: 1, 
//               borderColor: colors.border, 
//               marginVertical: 8,
//               padding: 8,
//               borderRadius: 6,
//             }}
//           />

//           {/* Toggle para público/privado */}
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             {/* Texto "Privado" a la izquierda */}
//             <Text style={{ marginRight: 8 }}>Privado</Text>

//             <Switch
//               value={publicaNuevaLista}
//               onValueChange={(nuevoValor) => setPublicaNuevaLista(nuevoValor)}
//               trackColor={{ false: '#767577', true: '#81b0ff' }}
//               thumbColor={publicaNuevaLista ? '#f5dd4b' : '#f4f3f4'}
//             />

//             {/* Texto "Público" a la derecha */}
//             <Text style={{ marginLeft: 8 }}>Público</Text>
//           </View>

//           <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
//             <TouchableOpacity onPress={() => setShowCrearListaModal(false)}>
//               <Text style={{ marginRight: 16 }}>Cancelar</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleCrearLista}>
//               <Text style={{ fontWeight: 'bold' }}>Crear</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//     </ScrollView>
//   );
// }

// // 📌 Estilos para la sección "Acerca de este libro"
// const stylesAcercaDe = StyleSheet.create({
//   columnas3: {
//     flexDirection: 'row',
//   },
//   columna: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   subcolumna: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginBottom: '10',
//   },
//   textoSubcolumna: {
//     justifyContent: 'left',
//     alignItems: 'left',
//   },
//   icono: {
//     marginRight: 10,
//   },
// });

// // Estilos generales para el diseño principal de la pantalla
// const stylesGeneral = StyleSheet.create({
//   // Sección superior (Portada + Información)
//   containerPrincipio: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   columnaIzquierda: {
//     flex: 1,  // Ocupa 1 parte del espacio disponible
//     alignItems: 'center',
//   },
//   imagenPortada: {
//     width: 120,
//     height: 180,
//     resizeMode: 'cover',
//     borderRadius: 5,
//   },
//   columnaDerecha: {
//     flex: 2,  // Ocupa 2 partes del espacio disponible
//     paddingLeft: 16,
//   },

//   // Diseño de las filas en la interfaz
//   fila: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   tituloContainer: {
//     flex: 1,  // Permite que el texto ocupe el espacio disponible
//   },

//   // Imagen de la portada en la sección de detalles del libro
//   imagen_portada_libro: {
//     width: 100,
//     height: 150,
//   },

//   // Contenedor general
//   container: {
//     flexGrow: 1, // Asegura que el ScrollView no se expanda de más
//     padding: 16,
//   },

//   // Línea divisoria entre secciones
//   linea: {
//     width: '100%',       // Ocupar todo el ancho disponible
//     marginVertical: 5,
//   },

//   // Estilo del título de las secciones
//   titulo: {
//     fontWeight: 'bold',
//     paddingTop: 10,
//     paddingBottom: 10,
//   },

//   // Texto de la sinopsis
//   resumen: {
//     textAlign: 'justify',
//     marginLeft: 10,
//     marginRight: 10,
//   },

//   // Botones generales (Leer, Añadir a lista, etc.)
//   boton: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 22,
//     alignItems: 'center',
//     marginVertical: 10,
//     alignSelf: 'flex-start',
//   },
//   textoBoton: {
//     color: 'white',
//   },
//   fila: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   // Icono de favorito (corazón)
//   corazon: {
//     marginHorizontal: 15,
//   },
// });

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
import { faClock, faBook, faFileWord } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
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
  const [valoraciones, setValoraciones] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [conteo, setConteo] = useState([]);
  const [totalValoraciones, setTotalValoraciones] = useState(null);
  const estrellasLlenas = Math.floor(promedio);
  const estrellasVacías = 5 - estrellasLlenas;

  // Datos del formulario para crear una lista rápidamente
  const [nombreNuevaLista, setNombreNuevaLista] = useState("");
  const [descripcionNuevaLista, setDescripcionNuevaLista] = useState("");
  const [publicaNuevaLista, setPublicaNuevaLista] = useState(false);

  //  📌 Variables para mostrar la sinopsis del libro
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

  // 📌 Función para obtener listas personalizadas del usuario
  const obtenerListasUsuario = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/listas/${correoUsuario}`);

      if (!respuesta.ok) {
        // Manejo de error: podría ser 404 si no hay listas, etc.
        throw new Error('No se pudieron obtener las listas del usuario');
      }
      const datos = await respuesta.json();
      setListasUsuario(datos);
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
      const url = `${API_URL}/listas/${encodeURIComponent(correoUsuario)}/${encodeURIComponent(nombreLista)}`;
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
                <TouchableOpacity onPress={handleCorazonPress} style={stylesGeneral.corazon}>
                  {/* <FontAwesomeIcon
                    icon={esFavorito ? faHeartSolid : faHeartRegular}
                    size={30}
                    color={esFavorito ? 'red' : 'gray'}
                  /> */}
                  <Ionicons
                    name={esFavorito ? 'heart' : 'heart-outline'}
                    size={30}
                    color={esFavorito ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* 📌 Botones: Leer */}
          <View style={stylesGeneral.fila}>
            <TouchableOpacity 
              style={[stylesGeneral.boton, { backgroundColor: colors.buttonDark }]} 
              onPress={handleLeer}
            >
              <Text style={[stylesGeneral.textoBoton, { color: colors.buttonTextDark }]}>Leer</Text>
            </TouchableOpacity>

            {/* 📌 Botones: Añadir a lista */}
            {correoUsuario && (
              <TouchableOpacity 
                style={[stylesGeneral.boton, { backgroundColor: colors.buttonDark }]} 
                onPress={() => setModalVisible(true)}
              >
                <Text style={[stylesGeneral.textoBoton, { color: colors.buttonTextDark }]}>Añadir a lista</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* 📌 Línea divisoria */}
      <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

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
            <Text style={{ color: colors.button, fontWeight: 'bold', marginTop: 5, marginLeft: 10 }}>
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
              <Text style={{ color: colors.text }}>horas de lectura</Text>
            </View>
          </View>
          
          {/* 📌 Cantidad total de palabras */}
          <View style={stylesAcercaDe.columna}>
          <Ionicons name="text" size={24} style={[stylesAcercaDe.icono, { color: colors.icon }]} />
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


      {/* 📌 Sección de valoraciones */}
      <View>
        <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Valoraciones del libro:</Text>
        <View>
          <Text style={[{color: colors.text}]}>Valoración general</Text>
          <Text style={{ fontSize: 16 }}>{promedio} de 5</Text>
          <Text style={{ fontSize: 20, marginBottom: 7 }}>
            {Array(estrellasLlenas).fill(<Ionicons name="star" size={24} color={colors.star} />)}
            {Array(estrellasVacías).fill(<Ionicons name="star-outline" size={24} color={colors.border} />)}
            {/* {'⭐️'.repeat(Math.floor(promedio)) + '☆'.repeat(5 - Math.floor(promedio))} */}
          </Text>
        </View>
        
        {/* 📌 Barras de progreso de valoraciones */}
        {totalValoraciones > 0 && [5, 4, 3, 2, 1].map((num) => {
          const porcentaje = ((conteo[num] || 0) / totalValoraciones) * 100; // Calcula el porcentaje
          return (
            <View key={num} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
              <Text style={{ width: 100, color: colors.text }}>{num} ESTRELLA</Text>
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
            style={[stylesGeneral.boton, { backgroundColor: colors.buttonDark }]} 
            onPress={handleAñadirValoracion}
          >
            <Text style={[stylesGeneral.textoBoton, { color: colors.buttonTextDark }]}>Añadir valoración</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 2.5 }]} />

      {/* 📌 Todas las reseñas del libro */}
      <View>
        <View>
          {valoraciones.length > 0 ? (
            <View>
              <Text style={[stylesGeneral.titulo, { color: colors.text }]}>Todas las reseñas del libro:</Text>
              {valoraciones.map((item) => (
                <View key={`${item.usuario_id}-${item.libro_id}-${item.titulo_resena}-${item.fecha}`}>
                  <Text style={{ fontWeight: 'bold', color: colors.text }}>{item.titulo_resena}</Text>
                  <Text style={{ color: colors.text }}>{item.mensaje}</Text>
                  <Text style={{ color: colors.textTerciary }}>{item.usuario_id}  {item.fecha}</Text>
                
                  <View style={[stylesGeneral.linea, { backgroundColor: colors.line, height: 1 }]} />
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: colors.text }}>Aún no hay valoraciones.</Text>
          )}
        </View>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }} // Coloca el modal en la parte inferior
      >
        <View style={{ backgroundColor: 'white', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '50%', }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Guardar en...</Text>
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
                      borderColor: colors.border,
                      marginRight: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // Si está seleccionado, fondo azul, si no, transparente
                      backgroundColor: isSelected ? colors.background : 'transparent',
                    }}
                  >
                    {/* Si está seleccionado, muestra un check (puedes usar texto o un ícono) */}
                    {isSelected && (
                      <Text style={{ color: colors.text, fontWeight: 'bold' }}>✓</Text>
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
              backgroundColor: colors.background,
              borderRadius: 6,
              alignItems: 'center',
            }}
            onPress={() => setShowCrearListaModal(true)}
          >
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>+ Nueva lista</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={showCrearListaModal}
        onBackdropPress={handleCerrarModal}
        onModalHide={() => {
          setNombreNuevaLista("");
          setDescripcionNuevaLista("");
          setPublicaNuevaLista(false);
        }}
      >
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Nueva lista</Text>
          
          <TextInput
            placeholder="Elige un título"
            value={nombreNuevaLista}
            onChangeText={setNombreNuevaLista}
            style={{
              borderWidth: 1, 
              borderColor: colors.border, 
              marginVertical: 8,
              padding: 8,
              borderRadius: 6,
            }}
          />

          <TextInput
            placeholder="Descripción (opcional)"
            value={descripcionNuevaLista}
            onChangeText={setDescripcionNuevaLista}
            style={{
              borderWidth: 1, 
              borderColor: colors.border, 
              marginVertical: 8,
              padding: 8,
              borderRadius: 6,
            }}
          />

          {/* Toggle para público/privado */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Texto "Privado" a la izquierda */}
            <Text style={{ marginRight: 8 }}>Privado</Text>

            <Switch
              value={publicaNuevaLista}
              onValueChange={(nuevoValor) => setPublicaNuevaLista(nuevoValor)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={publicaNuevaLista ? '#f5dd4b' : '#f4f3f4'}
            />

            {/* Texto "Público" a la derecha */}
            <Text style={{ marginLeft: 8 }}>Público</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={() => setShowCrearListaModal(false)}>
              <Text style={{ marginRight: 16 }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCrearLista}>
              <Text style={{ fontWeight: 'bold' }}>Crear</Text>
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
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