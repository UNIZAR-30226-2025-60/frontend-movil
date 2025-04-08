// RespuestasForo.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../componentes/Tema';
import { API_URL } from '../../config';

export default function RespuestasForo({ route, navigation, correoUsuario }) {
  // Se espera que la pantalla reciba el id de la pregunta y opcionalmente el texto de la misma
  const colors = useThemeColors();

  const { preguntaId, cuestion } = route.params;  
  const [respuestas, setRespuestas] = useState([]);
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [expandedRespuestas, setExpandedRespuestas] = useState({});

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
      const data = await response.json();
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

  return (
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
            {/* {respuestas.length > 0 ? (
              respuestas.map((respuesta) => (
                <View key={respuesta.id} style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.mensaje, { color: colors.text }]}>
                    {expandedRespuesta || respuesta.mensaje_respuesta.length <= 63
                      ? respuesta.mensaje_respuesta
                      : `${respuesta.mensaje_respuesta.substring(0, 63)}...`}
                  </Text>

                  {respuesta.mensaje_respuesta.length > 63 && (
                    <TouchableOpacity onPress={() => setExpandedRespuesta(!expandedRespuesta)}>
                      <Text style={[{ color: colors.text, fontSize: 14, marginTop: 5 }]}>
                        {expandedRespuesta ? 'Ver menos' : 'Ver más'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <View style={[styles.mismaFila]}>
                    <Text style={[styles.usuario, { color: colors.textSecondary }]}>Por: {respuesta.usuario_respuesta}    </Text>
                    <Text style={[styles.usuario, { color: colors.textSecondary }]}>Fecha: {new Date(respuesta.fecha).toLocaleDateString()}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.sinRespuestas, { color: colors.textSecondary }]}>Aún no hay respuestas.</Text>
            )} */}
            {respuestas.length > 0 ? (
              respuestas.map((respuesta) => (
                <View key={respuesta.id} style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}>
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

                  <View style={[styles.mismaFila]}>
                    <Text style={[styles.usuario, { color: colors.textDarkSecondary }]}>Por: {respuesta.usuario_respuesta}</Text>
                    <Text style={[styles.usuario, { color: colors.textDarkSecondary }]}>Fecha: {new Date(respuesta.fecha).toLocaleDateString()}</Text>
                  </View>
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
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      color: colors.textDark,
                      backgroundColor: colors.backgroundFormulario
                    }
                  ]}
                  placeholder="Escribe tu respuesta..."
                  placeholderTextColor={colors.textFormulario}
                  value={nuevaRespuesta}
                  onChangeText={setNuevaRespuesta}
                />
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
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10
  },
  headerPregunta: {
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 12,
    borderRadius: 8
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6
  },
  cuestion: {
    fontSize: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  usuario: {
    marginBottom: 5
  },
  mensaje: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  fecha: {
    fontSize: 12,
  },
  sinRespuestas: {
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic'
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 10,
    // borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10
  },
  aviso: {
    textAlign: 'center',
    padding: 10
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
});
