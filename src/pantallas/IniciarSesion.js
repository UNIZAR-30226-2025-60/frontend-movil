// IniciarSesión.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";


export default function IniciarSesion({ setCorreoUsuario }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  const colors = useThemeColors();

  // Configuramos la cabecera con el título y la flecha de volver
  useEffect(() => {
    navigation.setOptions({
      title: "Iniciar Sesión",
      headerStyle: { backgroundColor: colors.backgroundHeader },
      headerTintColor: colors.text,
      headerBackTitle: "Atrás",
    });
  }, [navigation, colors]);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.titulo, { color: colors.text }]}>Iniciar Sesión</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundHeader, color: colors.text, borderColor: colors.icon }]}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.text}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundHeader, color: colors.text, borderColor: colors.icon }]}
        placeholder="Contraseña"
        placeholderTextColor={colors.text}
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <TouchableOpacity style={[styles.boton, { backgroundColor: colors.button }]} onPress={handleLogin} disabled={cargando}>
        <Text style={[styles.textoBoton, { color: colors.buttonText }]}>{cargando ? "Cargando..." : "Continuar"}</Text>
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
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});
