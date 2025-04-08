import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useThemeColors } from "../componentes/Tema"; 
import { API_URL } from "../../config";

export default function CambioContrasena({ route, navigation }) {
  const { correoUsuario } = route.params;  // Recibimos el correo del usuario
  const colors = useThemeColors();
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    // Validamos que todos los campos estén llenos
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    // Validamos que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las nuevas contraseñas no coinciden");
      return;
    }

    try {
      // Realizamos la petición al backend para cambiar la contraseña
      const response = await fetch(`${API_URL}/usuarios/usuario/cambiar-contrasena`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          correo: correoUsuario, // Enviamos el correo del usuario
          oldPassword: oldPassword,           // Enviamos la contraseña vieja
          newPassword: newPassword           // Enviamos la nueva contraseña
        }),
      });

      const data = await response.json();

      // Verificamos si la respuesta fue exitosa
      if (!response.ok) throw new Error(data.message || "Error al cambiar la contraseña");

      // Mostramos mensaje de éxito y navegamos hacia atrás
      Alert.alert("Éxito", "Contraseña actualizada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      // Manejamos los errores de la petición
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.label, { color: colors.text }]}>Contraseña actual:</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.borderFormulario, backgroundColor: colors.backgroundFormulario, color: colors.textDark }]}
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      
      <Text style={[styles.label, { color: colors.text }]}>Nueva contraseña:</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.borderFormulario, backgroundColor: colors.backgroundFormulario, color: colors.textDark }]}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={[styles.label, { color: colors.text }]}>Confirmar nueva contraseña:</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.borderFormulario, backgroundColor: colors.backgroundFormulario, color: colors.textDark }]}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonDark }]} onPress={handlePasswordChange}>
        <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

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
