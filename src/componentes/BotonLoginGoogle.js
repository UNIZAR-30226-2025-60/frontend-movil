// BotonLoginGoogle.js
import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import logoGoogle from "../../assets/logo_google.png";
import { API_URL } from "../../config";

import * as Google from 'expo-auth-session/providers/google';


export default function BotonLoginGoogle({ setCorreoUsuario }) {
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  const colors = useThemeColors();

  const [ request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '197878322753-432ne8o85i4212s80th9gshbi1cat054.apps.googleusercontent.com',
  })


  useEffect(() => {
    const fetchUserInfo = async () => {
        if (response?.type === 'success') {
          const { accessToken } = response.authentication;
  
          try {
            // Hacemos una solicitud a la API de Google para obtener los datos del usuario
            const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            const userInfo = await userInfoResponse.json();
            
            console.log("Correo del usuario:", userInfo.email);
            console.log("Nombre:", userInfo.name);
            console.log("Foto de perfil:", userInfo.picture);

            // Comprobamos si el usuario ya tenía cuenta en bookly
            const backendResponse = await fetch(`${API_URL}/usuarios/usuario/${userInfo.email}`);
            
            if (backendResponse.ok) {
              const data = await backendResponse.json();
              console.log("El usuario ya tenía cuenta en bookly");

              setCorreoUsuario(userInfo.email); // Guarda el correo del usuario
              navigation.navigate("Drawer"); // Redirige al menú principal

            } else {
              console.log("El usuario no tenía cuenta en bookly");

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
                console.log("Usuario registrado exitosamente.");
                setCorreoUsuario(userInfo.email);
                navigation.navigate("Drawer");
              } else {
                console.error("Error al registrar el usuario.", registroResponse.error);
                Alert.alert("⚠️ Error", "No se pudo registrar al usuario.");
              }
            }


          } catch (error) {
            console.error("Error al obtener información del usuario:", error);
          }
        }
      };
      fetchUserInfo();
  }, [response]);

  return (
    <View>
      <TouchableOpacity 
        style={[styles.boton, { backgroundColor: colors.button, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} 
        onPress={() => promptAsync().catch((e) => {
            console.error("Error al iniciar sesión:", e);
        })} 
        disabled={cargando}
      >
        <Image source={logoGoogle} style={{ width: 20, height: 20, marginRight: 10 }} />
        <Text style={[styles.textoBoton, { color: colors.buttonText }]}>{cargando ? "Cargando..." : "Continuar con Google"}</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  boton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});