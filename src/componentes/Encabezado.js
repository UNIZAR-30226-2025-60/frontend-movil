// Encabezado.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "./Tema";

export default function Encabezado() {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <View style={[styles.header, { backgroundColor: colors.backgroundHeader }]}>
      {/* Botón de Menú */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={30} color={colors.icon} />
      </TouchableOpacity>

      {/* Título */}
      <Text style={[styles.title, { color: colors.text }]}>BOOKLY</Text>

      {/* Icono de Usuario */}
      <TouchableOpacity>
      <Ionicons name="person-circle-outline" size={30} color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {

  },
});
