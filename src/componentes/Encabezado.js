/**
 * Archivo: Encabezado.js
 * Descripción: Componente de encabezado para la app.
 * Contenido:
 *  - Muestra el nombre de la app y un botón de menú lateral
 *  - Incluye un icono para acceder al perfil del usuario
 *  - Muestra un subtítulo en ciertas pantallas
 */

import React, { use } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useThemeColors } from "./Tema";

export default function Encabezado({ titulo, correoUsuario }) {
  const navigation = useNavigation();
  const route = useRoute(); // Detecta la pantalla actual
  const colors = useThemeColors();

  const manejarNavegacionUsuario = () => {
    if (correoUsuario) {
      navigation.navigate("MenuPerfil", { correoUsuario });
    } else {
      navigation.navigate("MenuUsuario");
    }
  };

  const manejarNavegacionInicio = () => {
    navigation.navigate("Inicio");
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.backgroundHeader }}>
      <View style={[styles.header, { backgroundColor: colors.backgroundHeader }]}>

        {/* Botón de Menú */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color={colors.textHeader} />
        </TouchableOpacity>

        {/* Título principal */}
        <TouchableOpacity onPress={manejarNavegacionInicio}>
          <Text style={[styles.title, { color: colors.textHeader }]}>{ "BOOKLY" }</Text>
        </TouchableOpacity>

        {/* Icono de Usuario */}
        <TouchableOpacity onPress={manejarNavegacionUsuario} style={[{ flexDirection: 'row', alignItems: 'center' }]}>
          {/* <Ionicons name="person-circle-outline" size={30} color={colors.textHeader} /> */}
          <FontAwesomeIcon icon={faUser} size={20} color={colors.textHeader} />
          {/* <Text>Perfil</Text> */}
        </TouchableOpacity>
      </View>

      {/* Subtítulo, solo si 'titulo' está definido */}
      {titulo && (
        <View style={[styles.subtituloContainer, { backgroundColor: colors.backgroundSubtitle }]}>
          <Text style={[styles.subtitulo, { color: colors.subtitleText }]}>{titulo}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtituloContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
