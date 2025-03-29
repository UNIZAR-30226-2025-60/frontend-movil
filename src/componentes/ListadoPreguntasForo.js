// ListadoPreguntasForo.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import { useThemeColors } from "../componentes/Tema";

export default function ListadoPreguntasForo({ correoUsuario }) {
  const colors = useThemeColors();
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
      cargarTodasPreguntas();
      cargarMisPreguntas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Si hay usuario logueado, permitimos publicar */}
      {correoUsuario ? (
        <View style={[styles.formContainer, { backgroundColor: colors.backgroudSubtitle }]}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }
            ]}
            placeholder="Escribe tu pregunta..."
            placeholderTextColor={colors.textSecondary}
            value={nuevaPregunta}
            onChangeText={setNuevaPregunta}
          />
          <Button title="Preguntar" onPress={handleEnviarPregunta} color={colors.button} />
        </View>
      ) : (
        <Text style={[styles.aviso, { color: colors.buttonSec }]}>
          Debes iniciar sesión para publicar en el foro
        </Text>
      )}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'mine' && { backgroundColor: colors.button }]}
          onPress={() => setSelectedTab('mine')}
        >
          <Text style={[styles.tabText, selectedTab === 'mine' && { color: colors.buttonText }]}>
            Mis preguntas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'all' && { backgroundColor: colors.button }]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && { color: colors.buttonText }]}>
            Todas
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'mine' ? (
        // Sección: Mis preguntas
        <View style={styles.section}>
          {misPreguntas.map((pregunta) => (
            <View key={pregunta.id} style={[styles.card, { backgroundColor: colors.background }]}>
              <Text style={[styles.usuario, { color: colors.text }]}>{pregunta.usuario}</Text>
              <Text style={[styles.pregunta, { color: colors.textSecondary }]}>{pregunta.cuestion}</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.button }]}
                onPress={() =>
                  navigation.navigate('RespuestasForo', {
                    preguntaId: pregunta.id,
                    cuestion: pregunta.cuestion,
                  })
                }
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>Ver respuestas</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        // Sección: Todas las preguntas
        <View style={styles.section}>
          {todasPreguntas.map((pregunta) => (
            <View key={pregunta.id} style={[styles.card, { backgroundColor: colors.background }]}>
              <Text style={[styles.usuario, { color: colors.text }]}>{pregunta.usuario}</Text>
              <Text style={[styles.pregunta, { color: colors.textSecondary }]}>{pregunta.cuestion}</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.button }]}
                onPress={() =>
                  navigation.navigate('RespuestasForo', {
                    preguntaId: pregunta.id,
                    cuestion: pregunta.cuestion,
                  })
                }
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>Ver respuestas</Text>
              </TouchableOpacity>
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
    padding: 10,
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
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8
  },
  buttonText: {
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
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600'
  },
});