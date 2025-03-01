// Menu.js
import { useEffect,useState } from "react";
import { View, StyleSheet } from 'react-native';
import ListadoLibros from '../componentes/ListadoLibros';
import Encabezado from '../componentes/Encabezado';
import BuscadorLibros from "../componentes/BuscadorLibros";
import { useThemeColors } from "../componentes/Tema";

export default function Menu() {
  const [resultados, setResultados] = useState(null);

  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Encabezado />
      <BuscadorLibros setResultados={setResultados} />
      <ListadoLibros libros={resultados} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
