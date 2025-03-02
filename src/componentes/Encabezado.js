// Encabezado.js
import React, { use } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useThemeColors } from "./Tema";

export default function Encabezado({ titulo, correoUsuario }) {
  const navigation = useNavigation();
  const route = useRoute(); // Detecta la pantalla actual
  const colors = useThemeColors();

  // Define pantallas donde quiero que se muestre el subtítulo
  const pantallasConTitulo = ["Mis Favoritos", "Mis Listas", "Foro", "Leídos"];

  const manejarNavegacionUsuario = () => {
    if (correoUsuario) {
      navigation.navigate("MenuPerfil", { correoUsuario });
    } else {
      navigation.navigate("MenuUsuario");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.backgroundHeader }}>
      <View style={[styles.header, { backgroundColor: colors.backgroundHeader }]}>
        {/* Botón de Menú */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color={colors.icon} />
        </TouchableOpacity>

        {/* Título */}
        <Text style={[styles.title, { color: colors.text }]}>{ "BOOKLY" }</Text>

        {/* Icono de Usuario */}
        {/* <TouchableOpacity onPress={() => navigation.navigate("IniciarSesion")}> */}
        <TouchableOpacity onPress={manejarNavegacionUsuario}>
        <Ionicons name="person-circle-outline" size={30} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Mostrar título solo si la pantalla está en la lista */}
      {pantallasConTitulo.includes(route.name) && (
        <View style={styles.subtituloContainer}>
          <Text style={[styles.subtitulo, { color: colors.text }]}>{titulo}</Text>
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
