// Registrarse.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import { API_URL } from "../../config";

export default function Registrarse({ setCorreoUsuario }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaRepetida, setContrasenaRepetida] = useState("");

  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  const colors = useThemeColors();

  // Configuramos la cabecera con el título y la flecha de volver
  useEffect(() => {
    navigation.setOptions({
      title: "Registrarse",
      headerStyle: { backgroundColor: colors.backgroundHeader },
      headerTintColor: colors.text,
      headerBackTitle: "Atrás",
    });
  }, [navigation, colors]);

  const handleLogin = async () => {
    if (!nombre || !correo || !contrasena || !contrasenaRepetida) {
      Alert.alert("⚠️ Error", "Por favor, completa todos los campos");
      return;
    }
    if (contrasena != contrasenaRepetida) {
      Alert.alert("⚠️ Error", "Las contraseñas no son iguales. Por favor, introduzca la misma contraseña");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      if (!respuesta.ok) throw new Error("Error en el registro");

      const data = await respuesta.json();
      Alert.alert("✅ Registro exitoso", `Bienvenido, ${data.usuario.nombre}`);

      setCorreoUsuario(data.usuario.correo); // ✅ Guarda el correo del usuario
      navigation.navigate("Drawer"); // ✅ Redirige al menú principal

    } catch (error) {
      Alert.alert("⚠️ Error", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.titulo, { color: colors.text }]}>Registrarse</Text>

      <View style={styles.contenedorCampo}>
        <Text style={[styles.tituloCampo, { color: colors.text }]}>Nombre y apellidos</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.backgroundHeader, color: colors.text, borderColor: colors.icon }]}
          placeholder="miNombre"
          placeholderTextColor={colors.text}
          value={nombre}
          onChangeText={setNombre}
          keyboardType="default"
        />
      </View>

      <View style={styles.contenedorCampo}>
        <Text style={[styles.tituloCampo, { color: colors.text }]}>Correo electrónico</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.backgroundHeader, color: colors.text, borderColor: colors.icon }]}
          placeholder="ejemplo@ejemplo.com"
          placeholderTextColor={colors.text}
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.contenedorCampo}>
        <Text style={[styles.tituloCampo, { color: colors.text }]}>Contraseña</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.backgroundHeader, color: colors.text, borderColor: colors.icon }]}
          placeholder="1234abc@"
          placeholderTextColor={colors.text}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />
      </View>

      <View style={styles.contenedorCampo}>
        <Text style={[styles.tituloCampo, { color: colors.text }]}>Repetir contraseña</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.backgroundHeader, color: colors.text, borderColor: colors.icon }]}
          placeholder="1234abc@"
          placeholderTextColor={colors.text}
          value={contrasenaRepetida}
          onChangeText={setContrasenaRepetida}
          secureTextEntry
        />
      </View>

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
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  boton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contenedorCampo: {
    alignItems: 'flex-start',
    width: '100%',
  },
  tituloCampo: {
    textAlign: 'left',
    marginBottom: 5,
  },
});
