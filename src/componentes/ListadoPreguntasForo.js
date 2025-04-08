// ListadoPreguntasForo.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Switch, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import { Ionicons } from 'react-native-vector-icons';
import { API_URL } from '../../config';


export default function ListadoPreguntasForo({ correoUsuario }) {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const [misPreguntas, setMisPreguntas] = useState([]);
  const [todasPreguntas, setTodasPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [verMisPreguntas, setVerMisPreguntas] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState({});

  const [todasPreguntasOrdenadas, setTodasPreguntasOrdenadas] = useState([]);
  const [misPreguntasOrdenadas, setMisPreguntasOrdenadas] = useState([]);

  const opcionesOrden = [
    { id: 'antigua', label: 'más antiguas' },
    { id: 'reciente', label: 'más recientes' },
    { id: 'más respuestas', label: 'más respuestas' },
    { id: 'menos respuestas', label: 'menos respuestas' },
    { id: 'ninguno', label: 'ninguno' },
  ];
  const [modalOrdenarVisible, setModalOrdenarVisible] = useState(false);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('ninguno');


  // Al montar el componente, cargamos ambas listas
  useEffect(() => {
    cargarTodasPreguntas();
    if (correoUsuario) {
      cargarMisPreguntas();
    }
  }, [correoUsuario]);

  useEffect(() => {
    setTodasPreguntasOrdenadas(todasPreguntas);
  }, [todasPreguntas]);

  useEffect(() => {
    setMisPreguntasOrdenadas(misPreguntas);
  }, [misPreguntas]);

  // Carga solo las preguntas del usuario logueado
  const cargarMisPreguntas = async () => {
    try {
      // Llamamos a /preguntas con el query param usuarioCorreo
      const response = await fetch(`${API_URL}/preguntas?usuarioCorreo=${correoUsuario}`);
      if (!response.ok) {
        throw new Error("Error al obtener tus preguntas");
      }
      const data = await response.json();
      
      // Obtener número de respuestas para cada pregunta
      const preguntasConRespuestas = await Promise.all(
        data.map(async (pregunta) => ({
          ...pregunta,
          numRespuestas: await obtenerNumeroRespuestas(pregunta.id)
        }))
      );
      setMisPreguntas(preguntasConRespuestas);
    } catch (error) {
      console.error(error);
    }
  };

  // Carga todas las preguntas del foro
  const cargarTodasPreguntas = async () => {
    try {
      // Llamamos a /preguntas sin query param
      const response = await fetch(`${API_URL}/preguntas`);
      if (!response.ok) {
        throw new Error("Error al obtener todas las preguntas");
      }
      const data = await response.json();

      // Obtener número de respuestas para cada pregunta
      const preguntasConRespuestas = await Promise.all(
        data.map(async (pregunta) => ({
          ...pregunta,
          numRespuestas: await obtenerNumeroRespuestas(pregunta.id)
        }))
      );
      setTodasPreguntas(preguntasConRespuestas);
    } catch (error) {
      console.error(error);
    }
  };

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
        throw new Error("Error al enviar la pregunta");
      }
      const data = await response.json();
      
      setNuevaPregunta('');
      // Recarga las preguntas después de agregar una nueva
      cargarTodasPreguntas();
      cargarMisPreguntas();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSwitch = () => {
    setVerMisPreguntas(!verMisPreguntas);
  };

  const toggleExpand = (id) => {
    setExpandedQuestion((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };



  const seleccionarOrden = (opcion) => {
    setOrdenSeleccionado(opcion.label);
    setModalOrdenarVisible(false);

    let preg = [...todasPreguntas];
    let misPreg = [...misPreguntas];

    switch (opcion.id) {
      case 'más respuestas':
        preg.sort((a, b) => b.numRespuestas - a.numRespuestas);
        misPreg.sort((a, b) => b.numRespuestas - a.numRespuestas);
        break;
      case 'menos respuestas':
        preg.sort((a, b) => a.numRespuestas - b.numRespuestas);
        misPreg.sort((a, b) => a.numRespuestas - b.numRespuestas);
        break;
      case 'antigua':
        preg.sort((a, b) => new Date(a.fecha_mensaje) - new Date(b.fecha_mensaje));
        misPreg.sort((a, b) => new Date(a.fecha_mensaje) - new Date(b.fecha_mensaje));
        break;
      case 'reciente':
        preg.sort((a, b) => new Date(b.fecha_mensaje) - new Date(a.fecha_mensaje));
        misPreg.sort((a, b) => new Date(b.fecha_mensaje) - new Date(a.fecha_mensaje));
        break;
      case 'ninguno':
      default:
        preg = [...todasPreguntas]; // Restaurar sin ordenar
        misPreg = [...misPreguntas]; // Restaurar sin ordenar
        break;
    }

    setTodasPreguntasOrdenadas(preg);
    setMisPreguntasOrdenadas(misPreg);
  };

  const handleOrdenarPor = async () => {
    setModalOrdenarVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Si hay usuario logueado, permitimos publicar */}
      {correoUsuario && (
        <View style={[{ padding: 10, borderRadius: 10, backgroundColor: colors.backgroundForo }]}>
          <Text style={[styles.tituloCampo, { color: colors.textDark }]}>¿Quieres preguntar algo?</Text>
          <View style={[styles.formContainer]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.backgroundFormulario,
                  borderColor: colors.border,
                  color: colors.textDark
                }
              ]}
              placeholder="Escribe tu pregunta..."
              placeholderTextColor={colors.textDark}
              value={nuevaPregunta}
              onChangeText={setNuevaPregunta}
            />
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
          <View style={[{ flexDirection: 'row', alignItems: 'center', flex: 1, marginTop: 7 }]}>
            <Switch
              onValueChange={toggleSwitch}
              value={verMisPreguntas}
            />
            <Text style={[{ color: colors.text }]}>Ver mis preguntas</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.boton, { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.buttonDark }]} 
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
      </View>
      
          
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


      {verMisPreguntas ? (
        // Sección: Mis preguntas
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

              
              <View style={[styles.mismaFila, { fontSize: 10, marginBottom: 10 }]}>
                <Text style={[{ color: colors.textDarkSecondary }]}>Por: {pregunta.usuario}    </Text>
                <Text style={[{ color: colors.textDarkSecondary }]}>Fecha: {new Date(pregunta.fecha_mensaje).toISOString().split('T')[0]}</Text>
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
                  style={[styles.button, { backgroundColor: colors.buttonDarkSecondary, alignSelf: 'flex-start' }]} // Ajusta el ancho al texto
                  onPress={() =>
                    navigation.navigate('RespuestasForo', {
                      preguntaId: pregunta.id,
                      cuestion: pregunta.cuestion,
                    })
                  }
                >
                  <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>Ver respuestas</Text>
                </TouchableOpacity>
              </View> 
            </View>
          ))}
        </View>
      ) : (
        // Sección: Todas las preguntas
        <View style={styles.section}>
          {todasPreguntasOrdenadas.map((pregunta) => (
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
              
              <View style={[styles.mismaFila, { fontSize: 10, marginBottom: 10, marginTop:10 }]}>
                <Text style={[{ color: colors.textDarkSecondary }]}>Por: {pregunta.usuario}    </Text>
                <Text style={[{ color: colors.textDarkSecondary }]}>Fecha: {new Date(pregunta.fecha_mensaje).toISOString().split('T')[0]}</Text>
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
                  style={[styles.button, { backgroundColor: colors.buttonDarkSecondary, alignSelf: 'flex-start' }]} // Ajusta el ancho al texto
                  onPress={() =>
                    navigation.navigate('RespuestasForo', {
                      preguntaId: pregunta.id,
                      cuestion: pregunta.cuestion,
                    })
                  }
                >
                  <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>{pregunta.numRespuestas > 0 ? 'Ver respuestas' : 'Ver respuestas'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 1
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
    elevation: 2 // Sombra en Android
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
});