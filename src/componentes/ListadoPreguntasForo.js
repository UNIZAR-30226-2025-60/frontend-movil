// ListadoPreguntasForo.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Switch, Modal, FlatList } from 'react-native';
import { findNodeHandle, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import NombreUsuario from "../componentes/NombreUsuario";
import { Ionicons } from 'react-native-vector-icons';
import { API_URL } from '../../config';

// Componente reutilizable para mostrar una tarjeta de pregunta
const PreguntaCard = ({
  pregunta,
  correoUsuario,
  colors,
  expandedQuestion,
  toggleExpand,
  handleEliminarPregunta,
  preguntaSeleccionada,
  setPreguntaSeleccionada,
  navigation
}) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}>
      {pregunta.usuario === correoUsuario && (
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <TouchableOpacity
            onPress={() =>
              setPreguntaSeleccionada(preguntaSeleccionada === pregunta.id ? null : pregunta.id)
            }
            style={{ padding: 5 }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textDarkSecondary} />
          </TouchableOpacity>
          {preguntaSeleccionada === pregunta.id && (
            <View style={[styles.modalView, { backgroundColor: colors.backgroundModal }]}>
              <TouchableOpacity
                style={styles.menuOptionButton}
                onPress={() => {
                  setPreguntaSeleccionada(null);
                  handleEliminarPregunta(pregunta.id);
                }}
              >
                <Ionicons name="trash-outline" size={18} color="red" />
                <Text style={{ marginLeft: 6, fontSize: 14, color: 'red' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <Text style={[styles.pregunta, { color: colors.textDark }]}>
        {expandedQuestion[pregunta.id]
          ? pregunta.cuestion
          : pregunta.cuestion.length > 63
            ? `${pregunta.cuestion.substring(0, 63)}...`
            : pregunta.cuestion}
      </Text>

      {pregunta.cuestion.length > 63 && (
        <TouchableOpacity onPress={() => toggleExpand(pregunta.id)}>
          <Text style={[{ color: colors.textDark, fontSize: 14, marginTop: 5 }]}>
            {expandedQuestion[pregunta.id] ? 'Ver menos' : 'Ver más'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={[styles.mismaFila, { flexWrap: 'wrap', marginBottom: 10, marginTop: 10 }]}>
        <Text style={{ color: colors.textDarkSecondary }}>Por: </Text>
        <NombreUsuario correo={pregunta.usuario} />
        <Text style={{ color: colors.textDarkSecondary }}>
          {"   "}Fecha: {new Date(pregunta.fecha_mensaje).toISOString().split('T')[0]}
        </Text>
      </View>

      <View style={[styles.mismaFila]}>
        <Ionicons
          name="chatbubble"
          size={15}
          color={colors.textDarkSecondary}
          style={{ marginRight: 7 }}
        />
        <Text style={{ color: colors.textDarkSecondary }}>
          {pregunta.numRespuestas} respuestas
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button, alignSelf: 'flex-start' }]}
          onPress={() =>
            navigation.navigate('RespuestasForo', {
              preguntaId: pregunta.id,
              cuestion: pregunta.cuestion,
            })
          }
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Ver respuestas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ListadoPreguntasForo({ correoUsuario }) {
  const colors = useThemeColors();
  const navigation = useNavigation();

  // Estados principales
  const [misPreguntas, setMisPreguntas] = useState([]);
  const [todasPreguntas, setTodasPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [verMisPreguntas, setVerMisPreguntas] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState({});

  // Estados para las listas ordenadas y el menú de eliminación
  const [todasPreguntasOrdenadas, setTodasPreguntasOrdenadas] = useState([]);
  const [misPreguntasOrdenadas, setMisPreguntasOrdenadas] = useState([]);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);

  const [botonOrdenarLayout, setBotonOrdenarLayout] = useState(null);
  const botonOrdenarRef = React.useRef(null);

  // Estados para el modal de ordenación
  const opcionesOrden = [
    { id: 'antigua', label: 'más antiguas' },
    { id: 'reciente', label: 'más recientes' },
    { id: 'más respuestas', label: 'más respuestas' },
    { id: 'menos respuestas', label: 'menos respuestas' },
    { id: 'ninguno', label: 'ninguno' },
  ];
  const [modalOrdenarVisible, setModalOrdenarVisible] = useState(false);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('ninguno');

  const mostrarDropdown = () => {
    if (botonOrdenarRef.current) {
      // Usamos ref.measure en lugar de UIManager.measure
      botonOrdenarRef.current.measure((x, y, width, height, pageX, pageY) => {
        setBotonOrdenarLayout({ x: pageX, y: height + 10, width: 200 });
        setModalOrdenarVisible(true);
      });
    }
  };


  // Al montar el componente, cargamos ambas listas
  useEffect(() => {
    cargarTodasPreguntas();
    if (correoUsuario) {
      cargarMisPreguntas();
    }
  }, [correoUsuario]);

  // Actualizar las listas ordenadas cuando se actualicen las preguntas
  useEffect(() => {
    setTodasPreguntasOrdenadas(todasPreguntas);
    setMisPreguntasOrdenadas(misPreguntas);
  }, [todasPreguntas, misPreguntas]);

  // Función para cargar las preguntas del usuario
  const cargarMisPreguntas = async () => {
    try {
      const url = `${API_URL}/preguntas?usuarioCorreo=${correoUsuario}`;
      const response = await fetch(url);
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${text}`);
      }
      const data = JSON.parse(text);

      // Agregar número de respuestas a cada pregunta
      const preguntasConRespuestas = await Promise.all(
        data.map(async (pregunta) => ({
          ...pregunta,
          numRespuestas: await obtenerNumeroRespuestas(pregunta.id)
        }))
      );
      setMisPreguntas(preguntasConRespuestas);
    } catch (error) {
      console.error("Error en cargarMisPreguntas:", error);
    }
  };

  // Función para cargar todas las preguntas del foro
  const cargarTodasPreguntas = async () => {
    try {
      const response = await fetch(`${API_URL}/preguntas`);
      if (!response.ok) {
        throw new Error("Error al obtener todas las preguntas");
      }
      const data = await response.json();
      const preguntasConRespuestas = await Promise.all(
        data.map(async (pregunta) => ({
          ...pregunta,
          numRespuestas: await obtenerNumeroRespuestas(pregunta.id)
        }))
      );
      setTodasPreguntas(preguntasConRespuestas);
    } catch (error) {
      console.error("Error en cargarTodasPreguntas:", error);
    }
  };

  // Función para obtener el número de respuestas de una pregunta
  const obtenerNumeroRespuestas = async (preguntaId) => {
    try {
      const response = await fetch(`${API_URL}/obtenerNumeroRespuestas?preguntaId=${preguntaId}`);
      const data = await response.json();
      return data.numRespuestas;
    } catch (error) {
      console.error('Error al obtener el número de respuestas:', error);
      return 0;
    }
  };

  // Enviar nueva pregunta
  const handleEnviarPregunta = async () => {
    if (!nuevaPregunta.trim()) return;
    try {
      const response = await fetch(`${API_URL}/preguntas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioCorreo: correoUsuario,
          pregunta: nuevaPregunta
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      await response.json();
      setNuevaPregunta('');
      cargarTodasPreguntas();
      if (correoUsuario) cargarMisPreguntas();
    } catch (error) {
      console.error(error);
    }
  };

  // Alternar la vista de "mis preguntas"
  const toggleSwitch = () => {
    setVerMisPreguntas(!verMisPreguntas);
  };

  // Alternar la expansión de la pregunta para ver más/menos contenido
  const toggleExpand = (id) => {
    setExpandedQuestion(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  // Eliminar pregunta
  const handleEliminarPregunta = (idPregunta) => {
    Alert.alert(
      'Eliminar pregunta',
      '¿Estás seguro de que deseas eliminar esta pregunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/BorroPreguntas/${idPregunta}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error("Error al eliminar la pregunta");
              }
              await cargarMisPreguntas();
              await cargarTodasPreguntas();
            } catch (error) {
              console.error("Error eliminando pregunta:", error);
            }
          },
        },
      ]
    );
  };


  // Función para ordenar las preguntas según el criterio seleccionado
  const ordenarPreguntas = (preguntas, criterio) => {
    if (criterio === 'ninguno') return preguntas;
    const sorted = [...preguntas];
    switch (criterio) {
      case 'más respuestas':
        sorted.sort((a, b) => b.numRespuestas - a.numRespuestas);
        break;
      case 'menos respuestas':
        sorted.sort((a, b) => a.numRespuestas - b.numRespuestas);
        break;
      case 'antigua':
        sorted.sort((a, b) => new Date(a.fecha_mensaje) - new Date(b.fecha_mensaje));
        break;
      case 'reciente':
        sorted.sort((a, b) => new Date(b.fecha_mensaje) - new Date(a.fecha_mensaje));
        break;
      default:
        break;
    }
    return sorted;
  };

  // Seleccionar la opción de ordenación
  const seleccionarOrden = (opcion) => {
    setOrdenSeleccionado(opcion.label);
    setModalOrdenarVisible(false);
    setTodasPreguntasOrdenadas(ordenarPreguntas(todasPreguntas, opcion.id));
    setMisPreguntasOrdenadas(ordenarPreguntas(misPreguntas, opcion.id));
  };

  // Mostrar modal de ordenación
  const handleOrdenarPor = () => {
    setModalOrdenarVisible(true);
  };

  // Manejar el cambio en el input de la nueva pregunta
  const handleChangePregunta = (texto) => {
    if (texto.length > 350) {
      alert("La pregunta no puede tener más de 350 caracteres.");
      return;
    }
    setNuevaPregunta(texto);
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sección para publicar nueva pregunta si hay usuario logueado */}
      {correoUsuario && (
        <View style={{ padding: 10, borderRadius: 10, backgroundColor: colors.backgroundForo }}>
          <Text style={[styles.tituloCampo, { flexWrap: 'wrap', color: colors.textDark }]}>
            ¿Quieres preguntar algo?
          </Text>
          <View style={styles.formContainer}>
            <View style={[styles.textInput, { flex: 1, backgroundColor: colors.backgroundFormulario, borderColor: colors.border }]}>
              <TextInput
                style={{ color: colors.textDark, height: 30 }}
                placeholder="Escribe tu pregunta..."
                placeholderTextColor={colors.textDark}
                value={nuevaPregunta}
                onChangeText={handleChangePregunta}
              />
              <Text style={{ color: colors.textDark, textAlign: 'right', marginRight: 8, fontSize: 12 }}>
                {nuevaPregunta.length}/350 caracteres
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.button, borderRadius: 22 }]}
              onPress={handleEnviarPregunta}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Preguntar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View>
        {correoUsuario && (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginTop: 7 }}>
            <Switch
              onValueChange={toggleSwitch}
              value={verMisPreguntas}
              trackColor={{ false: colors.switchFondoNoSeleccionado, true: colors.switchFondoSeleccionado }}
              thumbColor={verMisPreguntas ? colors.switchBotonSeleeccionado : colors.switchBotonNoSeleeccionado}
            />
            <Text style={{ color: colors.text }}>Ver mis preguntas</Text>
          </View>
        )}

        {/* <TouchableOpacity
          style={[styles.boton, { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.buttonDark }]}
          onPress={handleOrdenarPor}
        >
          <Text style={{ color: colors.buttonTextDark }}>
            {ordenSeleccionado === 'ninguno' ? 'Ordenar por:' : `Ordenado por: ${ordenSeleccionado}`}
          </Text>
          <Ionicons
            name="caret-down"
            size={15}
            color={colors.buttonTextDark}
            style={{ marginLeft: 7 }}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          ref={botonOrdenarRef}
          onPress={mostrarDropdown}
          style={[styles.boton, { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.buttonDark }]}
        >
          <Text style={[{ color: colors.buttonTextDark }]}>
            {ordenSeleccionado === 'ninguno' ? 'Ordenar por:' : `Ordenado por: ${ordenSeleccionado}`}
          </Text>
          <Ionicons name='caret-down' size={15} color={colors.buttonTextDark} style={{ marginLeft: 7 }} />
        </TouchableOpacity>
      </View>


      {/* Modal que despliega las opciones de ordenación */}
      {/* <Modal
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
                <TouchableOpacity style={{ padding: 10 }} onPress={() => seleccionarOrden(item)}>
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal> */}
      {modalOrdenarVisible && botonOrdenarLayout && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: botonOrdenarLayout.y,
            left: botonOrdenarLayout.x,
            width: botonOrdenarLayout.width,
            backgroundColor: colors.backgroundModal,
            borderRadius: 10,
            padding: 10,
            elevation: 5,
            zIndex: 1000
          }}
          activeOpacity={1}
          onPressOut={() => setModalOrdenarVisible(false)}
        >
          {opcionesOrden.map(opcion => (
            <TouchableOpacity
              key={opcion.id}
              onPress={() => seleccionarOrden(opcion)}
              style={{ paddingVertical: 8 }}
            >
              <Text>{opcion.label}</Text>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      )}



      {verMisPreguntas ? (
        <View style={styles.section}>
          {misPreguntasOrdenadas.map((pregunta) => (
            <View key={pregunta.id} style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}>
              {/* <Text style={[styles.pregunta, { color: colors.text }]}>{pregunta.cuestion}</Text> */}
      <Text style={[styles.pregunta, { color: colors.textDark }]}>
        {expandedQuestion[pregunta.id]
          ? pregunta.cuestion
          : pregunta.cuestion.length > 63
            ? `${pregunta.cuestion.substring(0, 63)}...`
            : pregunta.cuestion}
      </Text>

      {/* Solo mostramos el botón 'Ver más' si la pregunta tiene más de 30 caracteres */}
      {pregunta.cuestion.length > 63 && (
        <TouchableOpacity onPress={() => toggleExpand(pregunta.id)}>
          <Text style={[{ color: colors.textDark, fontSize: 14, marginTop: 5 }]}>
            {expandedQuestion[pregunta.id] ? 'Ver menos' : 'Ver más'}
          </Text>
        </TouchableOpacity>
      )}


      <View style={[styles.mismaFila, { flexWrap: 'wrap', fontSize: 10, marginBottom: 10 }]}>
        {/* <Text style={[{ color: colors.textDarkSecondary }]}>Por: {pregunta.usuario}    </Text> */}
        <Text style={[{ color: colors.textDarkSecondary }]}>Por: </Text>
        <NombreUsuario correo={pregunta.usuario} />
        <Text style={[{ color: colors.textDarkSecondary }]}>   Fecha: {new Date(pregunta.fecha_mensaje).toISOString().split('T')[0]}</Text>
      </View>
      <View style={[styles.mismaFila]}>
        <Ionicons
          name='chatbubble'
          size={15}
          color={colors.textDarkSecondary}
          style={{ marginRight: 7 }}
        />
        <Text style={[{ color: colors.textDarkSecondary }]}>{pregunta.numRespuestas} respuestas</Text>


        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button, alignSelf: 'flex-start' }]} // Ajusta el ancho al texto
          onPress={() =>
            navigation.navigate('RespuestasForo', {
              preguntaId: pregunta.id,
              cuestion: pregunta.cuestion,
            })
          }
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Ver respuestas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red', alignSelf: 'flex-start' }]}
          onPress={() => handleEliminarPregunta(pregunta.id)}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))
}
        </View >
      ) : (
  <View style={styles.section}>
    {todasPreguntasOrdenadas.map((pregunta) => (
            <PreguntaCard
            key={pregunta.id}
            pregunta={pregunta}
            correoUsuario={correoUsuario}
            colors={colors}
            expandedQuestion={expandedQuestion}
            toggleExpand={toggleExpand}
            handleEliminarPregunta={handleEliminarPregunta}
            preguntaSeleccionada={preguntaSeleccionada}
            setPreguntaSeleccionada={setPreguntaSeleccionada}
            navigation={navigation}
          />
            <View key={pregunta.id} style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}>
              {/* <Text style={[styles.pregunta, { color: colors.text }]}>{pregunta.cuestion}</Text> */}
              <Text style={[styles.pregunta, { color: colors.textDark }]}>
                {expandedQuestion[pregunta.id]
                  ? pregunta.cuestion
                  : pregunta.cuestion.length > 63
                    ? `${pregunta.cuestion.substring(0, 63)}...`
                    : pregunta.cuestion}
              </Text>

              {/* Solo mostramos el botón 'Ver más' si la pregunta tiene más de 30 caracteres */}
              {pregunta.cuestion.length > 63 && (
                <TouchableOpacity onPress={() => toggleExpand(pregunta.id)}>
                  <Text style={[{ color: colors.textDark, fontSize: 14, marginTop: 5 }]}>
                    {expandedQuestion[pregunta.id] ? 'Ver menos' : 'Ver más'}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={[styles.mismaFila, { fontSize: 10, marginBottom: 10, marginTop: 10 }]}>
                <Text style={[{ color: colors.textDarkSecondary }]}>Por: </Text>
                <NombreUsuario correo={pregunta.usuario} />
                <Text style={[{ color: colors.textDarkSecondary }]}>   Fecha: {formatearFecha(pregunta.fecha_mensaje)}</Text>
              </View>
              <View style={[styles.mismaFila]}>
                <Ionicons
                  name='chatbubble'
                  size={15}
                  color={colors.textDarkSecondary}
                  style={{ marginRight: 7 }}
                />
                <Text style={[{ color: colors.textDarkSecondary }]}>{pregunta.numRespuestas} respuestas</Text>


                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.button, alignSelf: 'flex-start' }]} // Ajusta el ancho al texto
                  onPress={() =>
                    navigation.navigate('RespuestasForo', {
                      preguntaId: pregunta.id,
                      cuestion: pregunta.cuestion,
                    })
                  }
                >
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>{pregunta.numRespuestas > 0 ? 'Ver respuestas' : 'Ver respuestas'}</Text>
                </TouchableOpacity>

                {pregunta.usuario === correoUsuario && (
                  <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                      onPress={() =>
                        setPreguntaSeleccionada(preguntaSeleccionada === pregunta.id ? null : pregunta.id)
                      }
                      style={{
                        padding: 5,
                        marginLeft: 8,
                      }}
                    >
                      <Ionicons name="ellipsis-vertical" size={20} color={colors.textDarkSecondary} />
                    </TouchableOpacity>

                    {preguntaSeleccionada === pregunta.id && (
                      <View style={{
                        position: 'absolute',
                        top: 30,
                        right: 0,
                        backgroundColor: '#fff',
                        borderRadius: 6,
                        padding: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 6,
                        zIndex: 1000
                      }}>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                          onPress={() => {
                            setPreguntaSeleccionada(null);
                            handleEliminarPregunta(pregunta.id);
                          }}
                        >
                          <Ionicons name="trash-outline" size={18} color="red" />
                          <Text style={{ marginLeft: 6, fontSize: 14, color: 'red' }}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

              </View>
            </View>
    ))}
  </View>
)}
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    textAlignVertical: 'top',
  },
  aviso: {
    padding: 10,
    fontWeight: 'bold'
  },
  card: {
    borderRadius: 8,
    padding: 20,
    marginVertical: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  modalView: {
    position: 'absolute',
    top: 30,
    right: 0,
    borderRadius: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 1000,
  },
  menuOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 90,
  },
  pregunta: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    borderRadius: 22,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 13
  },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 10
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600'
  },
  mismaFila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tituloCampo: {
    textAlign: 'left',
    marginBottom: 5,
  },
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  menuIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10,
  },
  section: {
    marginTop: 10
  }
});
