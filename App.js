// App.js
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text } from 'react-native'; // Asegúrate de importar Text

import Menu from './src/pantallas/Menu';
import DetallesLibro from './src/componentes/DetallesLibro';
import Foro from './src/pantallas/Foro';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style='auto' />
      <Drawer.Navigator>
        <Drawer.Screen name="Inicio" component={MenuStack} options={{ headerShown: false }}/>
        <Drawer.Screen name="Foro" component={Foro} options={{ headerShown: false }}/>
        <Drawer.Screen name="Estadísticas" component={() => <Text>Estadísticas</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="Mis Favoritos" component={() => <Text>Mis Favoritos</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="Leídos" component={() => <Text>Leídos</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="En Proceso" component={() => <Text>En Proceso</Text>} options={{ headerShown: false }}/>
        <Drawer.Screen name="Mis Listas" component={() => <Text>Mis Listas</Text>} options={{ headerShown: false }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

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