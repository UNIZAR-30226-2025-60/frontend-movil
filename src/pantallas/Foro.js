// Foro.js
import { View, ScrollView, StyleSheet } from 'react-native';
import Encabezado from '../componentes/Encabezado';
import ListadoPreguntasForo from '../componentes/ListadoPreguntasForo';

export default function Foro() {
  return (
    <View style={{ flex: 1 }}>
      <Encabezado />
      <ScrollView contentContainerStyle={styles.container}>
        <ListadoPreguntasForo />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
});
