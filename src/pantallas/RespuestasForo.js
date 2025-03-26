// RespuestasForo.js

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Button } from 'react-native';
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
    <View style={styles.container}>
        
        <View style={styles.headerPregunta}>
            <Text style={styles.titulo}>Pregunta</Text>
            <Text style={styles.cuestion}>{cuestion}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Mostrar el título o enunciado de la pregunta */}
            <Text style={styles.titulo}>Respuestas a: {cuestion}</Text>
            {respuestas.length > 0 ? (
            respuestas.map((respuesta) => (
                <View key={respuesta.id} style={styles.card}>
                <Text style={styles.usuario}>Usuario: {respuesta.usuario_respuesta}</Text>
                <Text style={styles.mensaje}>{respuesta.mensaje_respuesta}</Text>
                <Text style={styles.fecha}>{respuesta.fecha}</Text>
                </View>
            ))
            ) : (
            <Text style={styles.sinRespuestas}>Aún no hay respuestas.</Text>
            )}
        </ScrollView>
        {correoUsuario ? (
            <View style={styles.formContainer}>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu respuesta..."
                value={nuevaRespuesta}
                onChangeText={setNuevaRespuesta}
            />
            <Button title="Responder" onPress={handleEnviarRespuesta} />
            </View>
        ) : (
            <Text style={styles.aviso}>Debes iniciar sesión para responder</Text>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    padding: 10
  },
  headerPregunta: {
    backgroundColor: '#f2f2f2',
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
    color: '#333'
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    backgroundColor: '#f9f9f9',
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
    color: '#777'
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
    borderColor: '#ccc'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10
  },
  aviso: {
    textAlign: 'center',
    color: 'red',
    padding: 10
  }
});
