import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../componentes/Tema";
import cargandoGif from "../../assets/animacion_cargando.gif";
import { API_URL } from "../../config";


export default function MenuPerfil({ route, navigation }) {
  const { correoUsuario, setCorreoUsuario } = route.params;
  const [usuario, setUsuario] = useState(null);
  const [esUsuarioGoogle, setEsUsuarioGoogle] = useState(false);
  const colors = useThemeColors();

  useEffect(() => {
    obtenerDatosUsuario();
  }, [correoUsuario]);

  const obtenerDatosUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios/usuario/${encodeURIComponent(correoUsuario)}`);
      if (!response.ok) throw new Error("Usuario no autenticado");

      const data = await response.json();

      // Transformar la URL de la foto de perfil si es de Google Drive
      if (data.foto_perfil) {
        data.foto_perfil = transformarURLGoogleDrive(data.foto_perfil);
      }

      setUsuario(data);

      // Consultar si el usuario es de Google
      const googleResponse = await fetch(`${API_URL}/usuarios/usuario/esGoogle/${encodeURIComponent(correoUsuario)}`);
      if (!googleResponse.ok) throw new Error("Error al verificar si el usuario es de Google");

      const googleData = await googleResponse.json();
      setEsUsuarioGoogle(googleData.esGoogle);

    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  const transformarURLGoogleDrive = (url) => {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (match) {
      const id = match[1];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  };

  const cerrarSesion = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar sesión", 
          onPress: () => {
            setCorreoUsuario(null);
            navigation.navigate("Drawer", { screen: "Inicio" });}
        }
      ]
    );
  };

  if (usuario === null) {
    return (
      <View style={styles.container}>
        <Image source={cargandoGif} style={styles.loadingImage}/>
        <Text style={{ color: colors.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image 
        source={{ uri: usuario.foto_perfil }} 
        style={styles.profileImage} 
        onError={(e) => console.log("Error al cargar la imagen:", e.nativeEvent.error)}
      />

      <Text style={[styles.welcomeText, { color: colors.text }]}>Bienvenido</Text>
      <Text style={[styles.nombre, { color: colors.text }]}>{usuario.nombre}</Text>
      <Text style={[styles.emailText, { color: colors.textSecondary }]}>{usuario.correo}</Text>
      
      
      {!esUsuarioGoogle && (
        <>
          {/* Botón Cambiar contraseña */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.button }]}
            onPress={() => navigation.navigate("CambioContrasena", { usuario: usuario })}
          >
            <Ionicons name="pencil" size={20} color={colors.buttonText} />
            <Text style={[styles.buttonText, { color: colors.buttonText}]}>Editar Contraseña</Text>
          </TouchableOpacity>

          {/* Botón Cambiar nombre */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.button }]}
            onPress={() => navigation.navigate("CambioNombre", { usuario: usuario })}
          >
            <Ionicons name="pencil" size={20} color={colors.buttonText} />
            <Text style={[styles.buttonText, { color: colors.buttonText}]}>Cambiar Nombre</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity
        style={[styles.secondButton, { backgroundColor: colors.buttonOther }]}
        onPress={cerrarSesion}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.buttonOtherText} />
        <Text style={[styles.SecondButtonText, { color: colors.buttonOtherText }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
  },
  profileImage: {
    marginTop: 10,
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
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
    marginLeft: 10,
    fontSize: 16,
  },
  secondButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
    width: '50%',
    justifyContent: 'center',
  },
  secondButtonText: {
    marginLeft: 10,
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 30,
    width: '80%',
    justifyContent: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
    width: '80%',
    justifyContent: 'center',
    backgroundColor: "red",
  },
  loadingImage: {
    width: 160,
    height: 160,
  },
});
