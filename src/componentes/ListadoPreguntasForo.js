// ListadoPreguntasForo.js
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from "react";
import { API_URL } from "../../config";

export default function ListadoPreguntasForo() {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    getPreguntas().then(setPreguntas);
  }, []);

  const getPreguntas = async () => {
    try {
      const response = await fetch(`${API_URL}/preguntas`);
      if (!response.ok) {
        throw new Error("Error al obtener las preguntas del foro" + response.error);
      }
      const data = await response.json();
      return data;
    } catch(error) {
      console.error(error);
      return [];
    }
  }


  return (
    <View style={styles.container}>
      {preguntas.map(pregunta => (
        <View key={pregunta.id}>
          <Text>{pregunta.usuario}</Text>
          <Text>{pregunta.cuestion}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});