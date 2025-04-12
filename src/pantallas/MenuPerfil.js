import React, { useCallback, useState } from "react";
import { useThemeColors } from "../componentes/Tema";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import cargandoGif from "../../assets/animacion_cargando.gif";
import { API_URL } from "../../config";

export default function MenuPerfil({ route, navig }) {
  const { correoUsuario, setCorreoUsuario } = route.params;
  const [usuario, setUsuario] = useState(null);
  const [esUsuarioGoogle, setEsUsuarioGoogle] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagenes, setImagenes] = useState([]);

  const colors = useThemeColors();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      obtenerDatosUsuario();
    }, [])
  );

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

      obtenerFotosPerfil();

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
            navigation.navigate("Drawer", { screen: "Inicio" });
          }
        }
      ]
    );
  };

  const obtenerFotosPerfil = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios/fotos-perfil`);
      if (!response.ok) throw new Error("Error al obtener las fotos de perfil");
      const data = await response.json();
      setImagenes(data.map(item => item.url));
    } catch (error) {
      console.error("Error al obtener las fotos de perfil:", error);
    }
  };

  const cambiarImagenPerfil = async (nuevaImagen) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/usuario/cambiar-foto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correoUsuario, // Correo del usuario
          foto_perfil: nuevaImagen, // Nueva URL de la imagen
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cambiar la imagen");
      }
      const data = await response.json();

      // Actualizar el estado con la nueva imagen
      setUsuario((prev) => ({ ...prev, foto_perfil: transformarURLGoogleDrive(nuevaImagen) }));
      setModalVisible(false);
      Alert.alert("Éxito", "Imagen de perfil actualizada correctamente.");
    } catch (error) {
      console.error("Error al cambiar la imagen:", error);
      Alert.alert("Error", error.message || "No se pudo cambiar la imagen.");
    }
  };

  if (usuario === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image source={cargandoGif} style={styles.loadingImage} />
        <Text style={{ color: colors.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: usuario.foto_perfil }}
          style={[styles.profileImage, { borderColor: colors.icon }]}
          onError={(e) => console.log("Error al cargar la imagen:", e.nativeEvent.error)}
        />
        <View style={[styles.editIconContainer, { backgroundColor: colors.icon, borderColor: colors.background }]}>
          <Ionicons name="pencil" size={20} color={colors.background} />
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Selecciona una nueva imagen</Text>
            <FlatList
              data={imagenes}
              keyExtractor={(item) => item}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => cambiarImagenPerfil(item)}>
                  <Image source={{ uri: transformarURLGoogleDrive(item) }} style={[styles.imageOption, { borderColor: colors.icon }]} />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.buttonDark }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: colors.buttonTextDark }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={[styles.welcomeText, { color: colors.text }]}>¡Bienvenid@ {usuario.nombre}!</Text>
      {/* <Text style={[styles.nombre, { color: colors.text }]}></Text> */}
      <Text style={[styles.emailText, { color: colors.textSecondary }]}>{usuario.correo}</Text>


      {!esUsuarioGoogle && (
        <>
          {/* Botón Cambiar contraseña */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.buttonDarkSecondary }]}
            onPress={() => navigation.navigate("CambioContrasena", { usuario: usuario })}
          >
            <Ionicons name="pencil" size={20} color={colors.buttonTextDark} />
            <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>Editar Contraseña</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Botón Cambiar nombre */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonDarkSecondary }]}
        onPress={() => navigation.navigate("CambioNombre", { usuario: usuario })}
      >
        <Ionicons name="pencil" size={20} color={colors.buttonTextDark} />
        <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>Editar Nombre</Text>
      </TouchableOpacity>

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity
        style={[styles.secondButton, { backgroundColor: colors.buttonDark }]}
        onPress={cerrarSesion}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.buttonTextDark} />
        <Text style={[styles.buttonText, { color: colors.buttonTextDark }]}>Cerrar Sesión</Text>
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
    borderWidth: 2,
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
    borderRadius: 22,
    marginTop: 15,
    width: '65%',
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
    borderRadius: 22,
    marginTop: 15,
    width: '80%',
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageOption: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 60,
    borderWidth: 2,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: "bold",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
  },
});
