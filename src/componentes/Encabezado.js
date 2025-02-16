// Encabezado.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Encabezado() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Botón de Menú */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>BOOKLY</Text>

      {/* Icono de Usuario */}
      <TouchableOpacity>
        <Ionicons name="person-circle-outline" size={30} color="black" />
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
