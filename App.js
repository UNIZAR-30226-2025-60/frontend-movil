// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListadoLibros from './src/componentes/ListadoLibros';
import DetallesLibro from './src/componentes/DetallesLibro';  // Importa el nuevo componente

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="listado">
        <Stack.Screen name="listado" component={ListadoLibros} />
        <Stack.Screen name="detalles" component={DetallesLibro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
