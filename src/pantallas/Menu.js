// Menu.js
import { View, ScrollView, StyleSheet } from 'react-native';
import ListadoLibros from '../componentes/ListadoLibros';
import Encabezado from '../componentes/Encabezado';

export default function Menu() {
  return (
    <View style={{ flex: 1 }}>
      <Encabezado />
      <ScrollView contentContainerStyle={styles.container}>
        <ListadoLibros />
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
