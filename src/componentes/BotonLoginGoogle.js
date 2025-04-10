// BotonLoginGoogle.js
import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import logoGoogle from "../../assets/logo_google.png";
import cargandoGif from "../../assets/animacion_cargando.gif";
import { API_URL } from "../../config";

import * as Google from 'expo-auth-session/providers/google';

export default function BotonLoginGoogle({ setCorreoUsuario }) {
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para el modal
  const navigation = useNavigation();
  const colors = useThemeColors();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '197878322753-432ne8o85i4212s80th9gshbi1cat054.apps.googleusercontent.com',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (response?.type === 'success') {
        setMostrarModal(true);

        const { accessToken } = response.authentication;

        try {
          const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const userInfo = await userInfoResponse.json();

          const backendResponse = await fetch(`${API_URL}/usuarios/usuario/${userInfo.email}`);

          if (backendResponse.ok) {
            setCorreoUsuario(userInfo.email);
            navigation.navigate("Drawer");
          } else {
            const registroResponse = await fetch(`${API_URL}/usuarios/registroM`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombre: userInfo.name,
                correo: userInfo.email,
                contrasena: null,
              }),
            });

            if (registroResponse.ok) {
              setCorreoUsuario(userInfo.email);
              navigation.navigate("Drawer");
            } else {
              Alert.alert("⚠️ Error", "No se pudo registrar al usuario.");
            }
          }
        } catch (error) {
          console.error("Error al obtener información del usuario:", error);
        } finally {
          setMostrarModal(false);
        }
      }
    };
    fetchUserInfo();
  }, [response]);

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity
        style={[styles.boton, { backgroundColor: colors.buttonDarkTerciary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
        // onPress={() => {
        //   promptAsync().catch((e) => console.error("Error al iniciar sesión:", e));
        // }}
        onPress={async () => {
          setMostrarModal(true); // Mostrar modal justo al pulsar el botón
          try {
            await promptAsync();
          } catch (e) {
            console.error("Error al iniciar sesión:", e);
            setMostrarModal(false);
          }
        }}
        disabled={cargando}
      >
        <View style={styles.logoContainer}>
          <Image source={logoGoogle} style={styles.logo} />
        </View>
        <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>{cargando ? "Cargando..." : "Continuar con Google"}</Text>
      </TouchableOpacity>

      {/* Pantalla Cargando... mientras se gestionan datos del login */}
      <Modal visible={mostrarModal} transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>Cargando...</Text>
          <Image source={cargandoGif} style={styles.loadingImage}/>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  boton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  logoContainer: {
    backgroundColor: "#f8f7f3",
    padding: 5,
    borderRadius: 22,
  },
  logo: {
    width: 20,
    height: 20,
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  loadingImage: {
    width: 160,
    height: 160,
  },
});
