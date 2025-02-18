// Menu.js
import { View, StyleSheet } from 'react-native';
import ListadoLibros from '../componentes/ListadoLibros';
import Encabezado from '../componentes/Encabezado';

export default function Menu() {
  return (
    <View style={styles.container}>
      <Encabezado />
      <ListadoLibros />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
