// IniciarSesión.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function IniciarSesion({ setCorreoUsuario }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();

  // Configuramos la cabecera con el título y la flecha de volver
  useEffect(() => {
    navigation.setOptions({
      title: "Iniciar Sesión",
      headerBackTitle: "Atrás", // Texto opcional para la flecha
    });
  }, [navigation]);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("⚠️ Error", "Por favor, completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch("http://10.0.2.2:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!respuesta.ok) throw new Error("Correo o contraseña incorrectos");

      const usuario = await respuesta.json();
      Alert.alert("✅ Inicio de sesión exitoso", `Bienvenido, ${usuario.nombre}`);

      setCorreoUsuario(usuario.correo); // ✅ Guarda el correo del usuario
      navigation.navigate("Drawer"); // ✅ Redirige al menú principal

    } catch (error) {
      Alert.alert("⚠️ Error", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin} disabled={cargando}>
        <Text style={styles.textoBoton}>{cargando ? "Cargando..." : "Continuar"}</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  boton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
