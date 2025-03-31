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
      console.log('Respuesta agregada:', data);
      // Limpiar el campo y recargar las respuestas para ver el nuevo mensaje
      setNuevaRespuesta('');
      cargarRespuestas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        
        <View style={[styles.headerPregunta, { backgroundColor: colors.backgroundSubtitle }]}>
          <Text style={[styles.titulo, { color: colors.text }]}>Pregunta</Text>
          <Text style={[styles.cuestion, { color: colors.text }]}>{cuestion}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Mostrar el título o enunciado de la pregunta */}
            <Text style={[styles.titulo, { color: colors.text }]}>Respuestas a: {cuestion}</Text>
            {respuestas.length > 0 ? (
            respuestas.map((respuesta) => (
              <View key={respuesta.id} style={[styles.card, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.usuario, { color: colors.text }]}>Usuario: {respuesta.usuario_respuesta}</Text>
                <Text style={[styles.mensaje, { color: colors.text }]}>{respuesta.mensaje_respuesta}</Text>
                <Text style={[styles.fecha, { color: colors.textSecondary }]}>{new Date(respuesta.fecha).toLocaleDateString()}</Text>
              </View>
            ))
            ) : (
              <Text style={[styles.sinRespuestas, { color: colors.textSecondary }]}>Aún no hay respuestas.</Text>
            )}
        </ScrollView>
        {correoUsuario ? (
            <View style={[styles.formContainer, { borderColor: colors.border }]}>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.backgroundFormulario
                  }
                ]}
                placeholder="Escribe tu respuesta..."
                placeholderTextColor={colors.textSecondary}
                value={nuevaRespuesta}
                onChangeText={setNuevaRespuesta}
              />
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.buttonDark, borderRadius: 22 }]}
                onPress={handleEnviarRespuesta}
              >
                <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>RESPONDER</Text>
              </TouchableOpacity>
            </View>
        ) : (
          <Text style={[styles.aviso, { color: colors.buttonSec }]}>Debes iniciar sesión para responder</Text>
        )}
        </View>
    );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     padding: 10
//   },
//   headerPregunta: {
//     padding: 16,
//     marginHorizontal: 8,
//     marginVertical: 12,
//     borderRadius: 8
//   },
//   titulo: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 6
//   },
//   cuestion: {
//     fontSize: 16,
//   },
//   titulo: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10
//   },
//   card: {
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5
//   },
//   usuario: {
//     fontWeight: 'bold',
//     marginBottom: 5
//   },
//   mensaje: {
//     fontSize: 16,
//     marginBottom: 5
//   },
//   fecha: {
//     fontSize: 12,
//   },
//   sinRespuestas: {
//     textAlign: 'center',
//     marginVertical: 20,
//     fontStyle: 'italic'
//   },
//   formContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderTopWidth: 1,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     marginRight: 10
//   },
//   aviso: {
//     textAlign: 'center',
//     padding: 10
//   },
//   button: {
//     borderRadius: 8,
//     marginLeft: 8
//   },
//   buttonText: {
//     fontSize: 13
//   },
// });
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
    fontWeight: 'bold',
    marginBottom: 5
  },
  mensaje: {
    fontSize: 16,
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
    padding: 10,
    borderTopWidth: 1,
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
});
