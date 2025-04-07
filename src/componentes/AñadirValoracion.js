// AñadirValoracion.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "./Tema";
import { API_URL } from "../../config";


export default function AñadirValoracion({ route, correoUsuario }) {
  const { libro } = route.params;
  const navigation = useNavigation();
  const colors = useThemeColors();

  const [titulo, setTitulo] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [valoracion, setValoracion] = useState(1);
  const [cargando, setCargando] = useState(false);

  const handleEstrella = (estrella) => {
    setValoracion(estrella);
  };

  const handleGuardar = async () => {
    if (!titulo || !mensaje) {
      Alert.alert("⚠️ Error", "Por favor, completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/opiniones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          usuario_id: correoUsuario,
          libro_id: libro.enlace,
          titulo_resena: titulo,
          mensaje: mensaje,
          valor: valoracion,
        }),
      });

      if (!respuesta.ok) throw new Error(respuesta.error);

      Alert.alert("✅ Valoración añadida correctamente");
      navigation.goBack();

    } catch (error) {
      Alert.alert("⚠️ Error al añadir la valoración", error);
      navigation.goBack();

    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <Text style={[styles.titulo, { color: colors.text }]}>Nueva valoración</Text>     */}
        
      <Text style={[styles.tituloCampo, { color: colors.text }]}>Título:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundFormulario, color: colors.textFormulario, borderColor: colors.borderFormulario }]}
        placeholder="Introduce tu título"
        placeholderTextColor={colors.textFormulario}
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={[styles.tituloCampo, { color: colors.text }]}>Mensaje:</Text>
      <TextInput
        style={[styles.inputGrande, { backgroundColor: colors.backgroundFormulario, color: colors.textFormulario, borderColor: colors.borderFormulario }]}
        placeholder="Introduce tu valoración"
        placeholderTextColor={colors.textFormulario}
        value={mensaje}
        onChangeText={setMensaje}
      />

      <Text style={[styles.tituloCampo, { color: colors.text }]}>Puntuación del 1 al 5:</Text>
      <View style={styles.estrellasContainer}>
        {[1, 2, 3, 4, 5].map((estrella) => (
          <TouchableOpacity
            key={estrella}
            onPress={() => handleEstrella(estrella)}
            style={styles.estrella}
          >
            <Ionicons
              name={estrella <= valoracion ? 'star' : 'star-outline'} // Usar Ionicons para la estrella rellena o vacía
              size={30}
              color={estrella <= valoracion ? colors.star : colors.iconBorder}
            />
          </TouchableOpacity>
        ))}
      </View>


      <TouchableOpacity style={[styles.boton, { backgroundColor: colors.buttonDark }]} onPress={handleGuardar} disabled={cargando}>
        <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>{cargando ? "Cargando..." : "Enviar"}</Text>
      </TouchableOpacity>
    
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    //   alignItems: 'center',
      padding: 20,
    },
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    tituloCampo: {
      textAlign: 'left',
      marginBottom: 5,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingTop: 12,
      marginBottom: 15,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    inputGrande: {
      width: '100%',
      height: 150,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingTop: 12,
      marginBottom: 15,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    estrellasContainer: {
      width: "60%",
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    estrella: {
      padding: 5,
    },
    boton: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
    },
    textoBoton: {
      fontSize: 18,
      fontWeight: 'bold',
    },
});