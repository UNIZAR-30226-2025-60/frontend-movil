// IniciarSesión.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import BotonLoginGoogle from "../componentes/BotonLoginGoogle";
import { API_URL } from "../../config";


export default function IniciarSesion({ setCorreoUsuario }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  const colors = useThemeColors();

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("⚠️ Error", "Por favor, completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/usuarios/loginM`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!respuesta.ok) throw new Error(respuesta.error);

      const usuario = await respuesta.json();
      Alert.alert("✅ Inicio de sesión exitoso", `Bienvenido, ${usuario.nombre}`);

      setCorreoUsuario(usuario.correo); // Guarda el correo del usuario
      navigation.navigate("Drawer"); // Redirige al menú principal

    } catch (error) {
      Alert.alert("⚠️ Error", error.message);
    } finally {
      setCargando(false);
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.titulo, { color: colors.text }]}>Iniciar sesión</Text>
      <Text style={[styles.tituloCampo, { color: colors.text }]}>Correo electrónico:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundFormulario, color: colors.textDark, borderColor: colors.borderFormulario }]}
        placeholder="ejemplo@ejemplo.com"
        placeholderTextColor={colors.textDark}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={[styles.tituloCampo, { color: colors.text }]}>Contraseña:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.backgroundFormulario, color: colors.textDark, borderColor: colors.borderFormulario }]}
        placeholder="1234abc@"
        placeholderTextColor={colors.textDark}
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <TouchableOpacity style={[styles.boton, { backgroundColor: colors.buttonDark }]} onPress={handleLogin} disabled={cargando}>
        <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>{cargando ? "Cargando..." : "Confirmar"}</Text>
      </TouchableOpacity>

      <BotonLoginGoogle setCorreoUsuario={setCorreoUsuario} />
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 15,
    fontSize: 16,
  },
  boton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginTop: 10,
    marginBottom: 10,
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
