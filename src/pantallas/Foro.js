// Foro.js

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Encabezado from '../componentes/Encabezado';
import ListadoPreguntasForo from '../componentes/ListadoPreguntasForo';

export default function Foro({ correoUsuario }) {
  return (
    <View style={{ flex: 1 }}>
      <Encabezado titulo="Foro"/>
      {/* ScrollView con tu ListadoPreguntasForo */}
      <ScrollView>
        <ListadoPreguntasForo correoUsuario={correoUsuario} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10
  }
});
