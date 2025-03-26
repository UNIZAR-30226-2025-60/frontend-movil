// ListadoPreguntasForo.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';

export default function ListadoPreguntasForo({ correoUsuario }) {
  const navigation = useNavigation();
  const [misPreguntas, setMisPreguntas] = useState([]);
  const [todasPreguntas, setTodasPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState('');

  const [selectedTab, setSelectedTab] = useState('all');  // Estado para controlar la vista actual: "all" o "mine"

  // Al montar el componente, cargamos ambas listas
  useEffect(() => {
    if (correoUsuario) {
      cargarMisPreguntas();
    }
    cargarTodasPreguntas();
  }, [correoUsuario]);

  // Carga solo las preguntas del usuario logueado
  const cargarMisPreguntas = async () => {
    try {
      // Llamamos a /preguntas con el query param usuarioCorreo
      const response = await fetch(`${API_URL}/preguntas?usuarioCorreo=${correoUsuario}`);
      if (!response.ok) {
        throw new Error("Error al obtener tus preguntas");
      }
      const data = await response.json();
      setMisPreguntas(data);
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
      setTodasPreguntas(data);
    } catch (error) {
      console.error(error);
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
      console.log(data.mensaje); // "Pregunta agregada con éxito"
      
      setNuevaPregunta('');
      // Recarga las preguntas después de agregar una nueva
      cargarPreguntas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Si hay usuario logueado, permitimos publicar */}
      {correoUsuario ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu pregunta..."
            value={nuevaPregunta}
            onChangeText={setNuevaPregunta}
          />
          <Button title="Preguntar" onPress={handleEnviarPregunta} />
        </View>
      ) : (
        <Text style={styles.aviso}>Debes iniciar sesión para publicar en el foro</Text>
      )}

      {/* 
        Botones tipo "segmented control" para alternar entre 
        "Mis preguntas" y "Todas" 
      */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'mine' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('mine')}
        >
          <Text style={[styles.tabText, selectedTab === 'mine' && styles.tabTextActive]}>
            Mis preguntas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'all' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Renderizado condicional según el tab seleccionado */}
      {selectedTab === 'mine'
        ? (
          // Sección: Mis preguntas
          <View style={styles.section}>
            {misPreguntas.map((pregunta) => (
              <View key={pregunta.id} style={styles.card}>
                <Text style={styles.usuario}>{pregunta.usuario}</Text>
                <Text style={styles.pregunta}>{pregunta.cuestion}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('RespuestasForo', {
                      preguntaId: pregunta.id,
                      cuestion: pregunta.cuestion
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Ver respuestas</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )
        : (
          // Sección: Todas las preguntas
          <View style={styles.section}>
            {todasPreguntas.map((pregunta) => (
              <View key={pregunta.id} style={styles.card}>
                <Text style={styles.usuario}>{pregunta.usuario}</Text>
                <Text style={styles.pregunta}>{pregunta.cuestion}</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('RespuestasForo', {
                      preguntaId: pregunta.id,
                      cuestion: pregunta.cuestion
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Ver respuestas</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f2f2f2'
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1
  },
  aviso: {
    padding: 10,
    color: 'red',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2 // Sombra en Android
  },
  usuario: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5
  },
  pregunta: {
    fontSize: 16,
    marginBottom: 8
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 12
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
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#007bff',
  },
  tabText: {
    color: '#333',
    fontWeight: '600'
  },
  tabTextActive: {
    color: '#fff'
  }
});