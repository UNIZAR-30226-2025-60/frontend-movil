// App.js
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text, View, StyleSheet } from 'react-native'; // Asegúrate de importar Text

import Menu from './src/pantallas/Menu';
import DetallesLibro from './src/componentes/DetallesLibro';
import Foro from './src/pantallas/Foro';
import LeerLibro from './src/pantallas/LeerLibro';
import Favoritos from './src/pantallas/Favoritos';

import { useThemeColors } from './src/componentes/Tema';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ELIMINAR ESTO CUANDO ESTÉN LAS PANTALLAS
const Estadisticas = () => <Text>Estadísticas</Text>;
const Leidos = () => <Text>Leídos</Text>;
const EnProceso = () => <Text>En Proceso</Text>;
const MisListas = () => <Text>Mis Listas</Text>;
//


// export default function App() {
//   return (
//     <NavigationContainer>
//       <StatusBar style='auto' />
//       <Drawer.Navigator>
//         <Drawer.Screen name="Inicio" component={MenuStack} options={{ headerShown: false }}/>
//         <Drawer.Screen name="Foro" component={Foro} options={{ headerShown: false }}/>
//         <Drawer.Screen name="Estadísticas" component={() => <Text>Estadísticas</Text>} options={{ headerShown: false }}/>
//         <Drawer.Screen name="Mis Favoritos" component={() => <Text>Mis Favoritos</Text>} options={{ headerShown: false }}/>
//         <Drawer.Screen name="Leídos" component={() => <Text>Leídos</Text>} options={{ headerShown: false }}/>
//         <Drawer.Screen name="En Proceso" component={() => <Text>En Proceso</Text>} options={{ headerShown: false }}/>
//         <Drawer.Screen name="Mis Listas" component={() => <Text>Mis Listas</Text>} options={{ headerShown: false }}/>
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// }

export default function App() {

  const colors = useThemeColors();

  return (
    <NavigationContainer>
      <StatusBar style={colors.text === '#ffffff' ? 'light' : 'dark'} />
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.background, // Fondo de la barra lateral
          },
          headerStyle: {
            backgroundColor: colors.backgroundHeader, // Fondo del encabezado
          },
          headerTintColor: colors.text, // Color del texto del encabezado
          drawerActiveTintColor: colors.text, // Color del texto activo en el drawer
          drawerInactiveTintColor: colors.text === '#ffffff' ? '#d1d1d1' : '#000000', // Color del texto inactivo
        }}
      >
        <Drawer.Screen name="Inicio" component={MenuStack} options={{ headerShown: false }} />
        <Drawer.Screen name="Foro" component={Foro} options={{ headerShown: false }} />
        <Drawer.Screen name="Estadísticas" component={Estadisticas} options={{ headerShown: false }} />
        <Drawer.Screen name="Mis Favoritos" component={Favoritos} options={{ headerShown: false }} />
        <Drawer.Screen name="Leídos" component={Leidos} options={{ headerShown: false }} />
        <Drawer.Screen name="En Proceso" component={EnProceso} options={{ headerShown: false }} />
        <Drawer.Screen name="Mis Listas" component={MisListas} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


// Función del stack para el menú principal y detalles
function MenuStack() {
  const colors = useThemeColors();
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
        options={{
          title: "Detalles del libro",
          headerStyle: {
            backgroundColor: colors.backgroundHeader, // Fondo oscuro o claro del encabezado
          },
          headerTintColor: colors.text, // Color del texto del título
        }}
      />
      <Stack.Screen 
        name="LeerLibro" 
        component={LeerLibro} 
        options={{ title: "Leyendo...",
          headerStyle: {
            backgroundColor: colors.backgroundHeader, // Fondo oscuro o claro del encabezado
          },
          headerTintColor: colors.text, // Color del texto del título
        }}
      />
    </Stack.Navigator>
  );
}