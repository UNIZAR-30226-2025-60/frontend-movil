// MenuUsuario.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function MenuUsuario({ setCorreoUsuario }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();

  // Configuramos la cabecera con el título y la flecha de volver
  useEffect(() => {
    navigation.setOptions({
      title: "Menú de usuario",
      headerBackTitle: "Atrás", // Texto opcional para la flecha
    });
  }, [navigation]);


  
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Bienvenido a Bookly!</Text>

      <TouchableOpacity 
        style={styles.boton} 
        // onPress={() => navigation.navigate("IniciarSesion")}
        onPress={() => navigation.navigate("MenuUsuarioStack", { screen: "IniciarSesion" })}
      >
        <Text style={styles.textoBoton}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.boton, styles.botonSecundario]} 
        onPress={() => navigation.navigate("Registrarse")}
      >
        <Text style={styles.textoBoton}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    boton: {
      width: '80%',
      height: 50,
      backgroundColor: '#007bff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 10,
    },
    botonSecundario: {
      backgroundColor: '#28a745', // Verde para diferenciarlo
    },
    textoBoton: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });