import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text } from 'react-native'; // Asegúrate de importar Text

import Menu from './src/pantallas/Menu';
import DetallesLibro from './src/componentes/DetallesLibro';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Función del stack para el menú principal y detalles
function MenuStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Menu" 
        component={Menu} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Detalles" 
        component={DetallesLibro} 
        options={{ title: "Detalles del libro" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <Drawer.Navigator>
        {/* La pantalla del menú debe usar MenuStack */}
        <Drawer.Screen name="Inicio" component={MenuStack} options={{ headerShown: false }}/>
        {/* Resto de pantallas en el Drawer */}
        <Drawer.Screen name="Foro" component={() => <Text>Foro</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="Estadísticas" component={() => <Text>Estadísticas</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="Mis Favoritos" component={() => <Text>Mis Favoritos</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="Leídos" component={() => <Text>Leídos</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="En Proceso" component={() => <Text>En Proceso</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="Mis Listas" component={() => <Text>Mis Listas</Text>} options={{ headerShown: false }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
