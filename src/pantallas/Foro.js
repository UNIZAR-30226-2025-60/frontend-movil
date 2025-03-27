// Foro.js

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Encabezado from '../componentes/Encabezado';
import ListadoPreguntasForo from '../componentes/ListadoPreguntasForo';
import { useThemeColors } from "../componentes/Tema";

export default function Foro({ route, correoUsuario: propCorreo }) {
  const colors = useThemeColors();
  const correoUsuario = route?.params?.correoUsuario || propCorreo;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Encabezado titulo="Foro" correoUsuario={correoUsuario} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ListadoPreguntasForo correoUsuario={correoUsuario} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10
  }
});
