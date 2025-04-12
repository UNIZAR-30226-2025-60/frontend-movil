// RespuestasForo.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useThemeColors } from '../componentes/Tema';
import { API_URL } from '../../config';

export default function RespuestasForo({ route, correoUsuario }) {
  // Se espera que la pantalla reciba el id de la pregunta y opcionalmente el texto de la misma
  const colors = useThemeColors();

  const { preguntaId, cuestion } = route.params;
  const [respuestas, setRespuestas] = useState([]);
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [expandedRespuestas, setExpandedRespuestas] = useState({});
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);

  useEffect(() => {
    cargarRespuestas();
  }, []);

  // Función para cargar las respuestas de la pregunta usando el endpoint definido
  const cargarRespuestas = async () => {
    try {
      const response = await fetch(`${API_URL}/obtenerRespuestas?preguntaId=${preguntaId}`);
      if (!response.ok) {
        throw new Error('Error al obtener respuestas');
      }
      const data = await response.json();
      setRespuestas(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Función para enviar una nueva respuesta
  const handleEnviarRespuesta = async () => {
    if (!nuevaRespuesta.trim()) return;

    try {
      const response = await fetch(`${API_URL}/agregarRespuesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pregunta_id: preguntaId,
          usuario_respuesta: correoUsuario,
          mensaje_respuesta: nuevaRespuesta
        })
      });
      if (!response.ok) {
        throw new Error('Error al enviar respuesta');
      }
      // Limpiar el campo y recargar las respuestas para ver el nuevo mensaje
      setNuevaRespuesta('');
      cargarRespuestas();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpandedRespuesta = (id) => {
    setExpandedRespuestas((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const mostrarMenu = (respuestaId) => {
    setRespuestaSeleccionada(respuestaId);
  };

  const handleEliminarRespuesta = (respuestaId) => {
    Alert.alert(
      'Eliminar respuesta',
      '¿Estás seguro de que deseas eliminar esta respuesta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Llama al endpoint correcto del backend
              const response = await fetch(`${API_URL}/BorroRespuestas/${respuestaId}`, {
                method: 'DELETE',
              });

              if (!response.ok) throw new Error('No se pudo eliminar la respuesta');
              cargarRespuestas(); // Recarga las respuestas después de eliminar
            } catch (error) {
              console.error('Error al eliminar la respuesta:', error);
            }
          },
        },
      ]
    );
  };

  const handleChangeRespuesta = (texto) => {
    if (texto.length > 350) {
      alert("La respuesta no puede tener más de 350 caracteres.");
      return;
    }
    setNuevaRespuesta(texto);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setRespuestaSeleccionada(null)}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>

        <View style={[styles.headerPregunta, { backgroundColor: colors.backgroundSubtitle }]}>
          <Text style={[styles.titulo, { color: colors.text }]}>Pregunta:</Text>
          {/* <Text style={[styles.cuestion, { color: colors.text }]}>{cuestion}</Text> */}
          <Text style={[styles.cuestion, { color: colors.text }]}>
            {expanded || cuestion.length <= 63
              ? cuestion
              : `${cuestion.substring(0, 63)}...`}
          </Text>

          {cuestion.length > 63 && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text style={[{ color: colors.text, fontSize: 14, marginTop: 5 }]}>
                {expanded ? 'Ver menos' : 'Ver más'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Mostrar el título o enunciado de la pregunta */}
          <Text style={[styles.titulo, { color: colors.text }]}>Respuestas:</Text>
          {respuestas.length > 0 ? (
            respuestas.map((respuesta) => (
              <View key={respuesta.id} style={[styles.card,
              {
                backgroundColor: colors.backgroundSecondary,
                zIndex: respuestaSeleccionada === respuesta.id ? 100 : 0
              }
              ]}>
                <Text style={[styles.mensaje, { color: colors.textDark }]}>
                  {expandedRespuestas[respuesta.id] || respuesta.mensaje_respuesta.length <= 63
                    ? respuesta.mensaje_respuesta
                    : `${respuesta.mensaje_respuesta.substring(0, 63)}...`}
                </Text>

                {respuesta.mensaje_respuesta.length > 63 && (
                  <TouchableOpacity onPress={() => toggleExpandedRespuesta(respuesta.id)}>
                    <Text style={[{ color: colors.textDark, fontSize: 14, marginTop: 5 }]}>
                      {expandedRespuestas[respuesta.id] ? 'Ver menos' : 'Ver más'}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={[styles.mismaFila, { flexWrap: 'wrap' }]}>
                  <Text style={[styles.usuario, { color: colors.textDarkSecondary }]}>Por: {respuesta.usuario_respuesta}   </Text>
                  <Text style={[styles.usuario, { color: colors.textDarkSecondary }]}>Fecha: {new Date(respuesta.fecha).toLocaleDateString()}</Text>
                </View>

                {respuesta.usuario_respuesta === correoUsuario && (
                  <View style={{ position: 'absolute', top: 10, right: 10 }}>
                    <TouchableOpacity
                      onPress={() =>
                        setRespuestaSeleccionada(
                          respuestaSeleccionada === respuesta.id ? null : respuesta.id
                        )
                      }
                      style={styles.botonMenu}
                    >
                      <Ionicons name="ellipsis-vertical" size={20} color={colors.textDark} />
                    </TouchableOpacity>

                    {respuestaSeleccionada === respuesta.id && (
                      <View style={[styles.menuOpciones, { backgroundColor: colors.background }]}>
                        <TouchableOpacity
                          style={styles.opcionMenu}
                          onPress={() => {
                            setRespuestaSeleccionada(null);
                            handleEliminarRespuesta(respuesta.id);
                          }}
                        >
                          <Ionicons name="trash-outline" size={18} color="red" />
                          <Text style={[styles.textoOpcion, { color: "red" }]}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  </View>
                )}

              </View>
            ))
          ) : (
            <Text style={[styles.sinRespuestas, { color: colors.text }]}>Aún no hay respuestas.</Text>
          )}

        </ScrollView>


        {correoUsuario ? (
          <View style={[{ borderTopWidth: 1, padding: 10, borderColor: colors.border, backgroundColor: colors.backgroundForo }]}>
            <Text style={[styles.tituloCampo, { color: colors.textDark }]}>Mensaje:</Text>
            <View style={[styles.formContainer]}>
              <View style={[styles.input, { flex: 1, backgroundColor: colors.backgroundFormulario, borderColor: colors.border }]}>
                <TextInput
                  style={[{ color: colors.textDark, height: 30, }]}
                  placeholder="Escribe tu respuesta..."
                  placeholderTextColor={colors.textFormulario}
                  value={nuevaRespuesta}
                  onChangeText={handleChangeRespuesta}
                />

                <Text style={{ color: colors.textDark, textAlign: 'right', marginRight: 8, fontSize: 12 }}>
                  {nuevaRespuesta.length}/350 caracteres
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.button, borderRadius: 22 }]}
                onPress={handleEnviarRespuesta}
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={[styles.aviso, { color: colors.buttonSec }]}>Debes iniciar sesión para responder</Text>
        )}

      </View>
    </TouchableWithoutFeedback >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
  },
  headerPregunta: {
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 12,
    borderRadius: 8,
  },
  cuestion: {
    fontSize: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'relative',
    overflow: 'visible',
  },
  usuario: {
    marginBottom: 5,
  },
  mensaje: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: 30,
  },
  sinRespuestas: {
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
  },
  aviso: {
    textAlign: 'center',
    padding: 10,
  },
  button: {
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  mismaFila: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opcionMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuOpciones: {
    position: 'absolute',
    top: 35,
    right: 5,
    borderRadius: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  textoOpcion: {
    marginLeft: 8,
    fontSize: 14,
  },
  botonMenu: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
});
