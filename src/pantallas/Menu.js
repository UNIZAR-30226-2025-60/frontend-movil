// Menu.js
import { useEffect, useState } from "react";
import { View, StyleSheet } from 'react-native';
import ListadoLibros from '../componentes/ListadoLibros';
import Encabezado from '../componentes/Encabezado';
import BuscadorLibros from "../componentes/BuscadorLibros";
import FiltroCategorias from "../componentes/FiltroCategorias";
import { useThemeColors } from "../componentes/Tema";

export default function Menu({ correoUsuario }) {
  const [resultados, setResultados] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Encabezado correoUsuario={correoUsuario} />
      <View style={[styles.container2, { backgroundColor: colors.backgroundSubtitle }]}>
        <BuscadorLibros setResultados={setResultados} categoria={categoriaSeleccionada} />

        <View style={{ marginTop: 10 }}>
          <FiltroCategorias onSelectCategoria={setCategoriaSeleccionada} />
        </View>
        
      </View>
      <View style={[styles.container2]}>
        <ListadoLibros libros={resultados} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    paddingVertical: 7,
  },
});
