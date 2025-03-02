import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from "./Tema";

export default function VisualizarPerfil({ usuario }) {
  const navigation = useNavigation();
  const colors = useThemeColors();

  // Comentar el código de carga (pantalla de carga)
  // if (!usuario) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       {/* Mostramos un indicador de carga mientras el usuario se carga */}
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Foto de perfil */}
      <Image 
        source={{ uri: usuario.foto_perfil }} 
        style={styles.profileImage} 
      />
      
      {/* Titulo y bienvenido */}
      <Text style={[styles.welcomeText, { color: colors.text }]}>Bienvenido</Text>
      <Text style={[styles.nombre, { color: colors.text }]}>{usuario.nombre}</Text>
      <Text style={[styles.emailText, { color: colors.textSecondary }]}>{usuario.correo}</Text>
      
      {/* Botones para editar */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("CambioContrasenya", { correoUsuario: usuario.correo })}
      >
        <Ionicons name="pencil" size={20} color="white" />
        <Text style={styles.buttonText}>Editar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("CambioNombre", { correoUsuario: usuario.correo })}
      >
        <Ionicons name="pencil" size={20} color="white" />
        <Text style={styles.buttonText}>Cambiar Nombre</Text>
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
  // Comentar la vista de carga
  // loadingContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nombre: {
    fontSize: 24,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});
