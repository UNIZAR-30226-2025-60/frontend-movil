import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useThemeColors } from "../componentes/Tema"; 
import { API_URL } from "../../config";

export default function CambioNombre({ route, navigation }) {
  const { usuario } = route.params;  // Recibimos el correo del usuario
  const colors = useThemeColors();

  const [ nuevoNombre, setNuevoNombre ] = useState("");

  const handleCambiarNombre = async () => {
    try {
          // Realizamos la petición al backend para cambiar la contraseña
          const response = await fetch(`${API_URL}/usuarios/usuario/cambiar-nombre`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              correo: usuario.correoUsuario,
              nombre: nuevoNombre,
            }),
          });
    
          const data = await response.json();
    
          // Verificamos si la respuesta fue exitosa
          if (!response.ok) throw new Error(data.message || "Error al cambiar el nombre");
    
          // Mostramos mensaje de éxito y navegamos hacia atrás
          Alert.alert("Éxito", "Nombre actualizado correctamente", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } catch (error) {
          // Manejamos los errores de la petición
          Alert.alert("Error", error.message);
        }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Nombre actual:</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.borderFormulario, backgroundColor: colors.backgroundFormulario, color: colors.text }]}
        value={usuario?.nombre || ""}
        editable={false}
      />

      <Text style={[styles.label, { color: colors.text }]}>Nuevo nombre:</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.borderFormulario, backgroundColor: colors.backgroundFormulario, color: colors.text }]}
        onChangeText={setNuevoNombre}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonDark }]} onPress={handleCambiarNombre}>
        <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 22,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
