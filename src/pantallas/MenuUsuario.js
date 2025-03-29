// MenuUsuario.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";

export default function MenuUsuario({ setCorreoUsuario }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  const colors = useThemeColors();

  // Configuramos la cabecera con el título y la flecha de volver
  useEffect(() => {
    navigation.setOptions({
      title: "Menú de usuario",
      headerBackTitle: "Atrás", // Texto opcional para la flecha
    });
  }, [navigation]);


  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>¡Bienvenido a Bookly!</Text>

      <TouchableOpacity 
        style={[styles.boton, { backgroundColor: colors.buttonDark }]}
        onPress={() => navigation.navigate("IniciarSesion")}
      >
        <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.boton, styles.botonSecundario, { backgroundColor: colors.buttonDark }]}
        onPress={() => navigation.navigate("Registrarse")}
      >
        <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    boton: {
      width: '80%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
      marginBottom: 10,
    },
    botonSecundario: {
      
    },
    textoBoton: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
