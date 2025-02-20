// App.js
import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text } from 'react-native'; // Asegúrate de importar Text

import Menu from './src/pantallas/Menu';
import DetallesLibro from './src/componentes/DetallesLibro';
import Foro from './src/pantallas/Foro';
import LeerLibro from './src/pantallas/LeerLibro';
import Favoritos from './src/pantallas/Favoritos';
import MisListas from './src/pantallas/MisListas';
import IniciarSesion from './src/pantallas/IniciarSesion';

import { useThemeColors } from './src/componentes/Tema';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ELIMINAR ESTO CUANDO ESTÉN LAS PANTALLAS
const Estadisticas = () => <Text>Estadísticas</Text>;
const Leidos = () => <Text>Leídos</Text>;
const EnProceso = () => <Text>En Proceso</Text>;
//

export default function App() {
  const [correoUsuario, setCorreoUsuario] = useState(null);
  const colors = useThemeColors();

  return (
    <NavigationContainer>
      <RootStack correoUsuario={correoUsuario} setCorreoUsuario={setCorreoUsuario} />
    </NavigationContainer>
  );
}


function RootStack({ correoUsuario, setCorreoUsuario }) {
  const colors = useThemeColors();

  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Drawer"
      >
        {(props) => <DrawerNavigator {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="IniciarSesion"
        options={{
          title: "Iniciar Sesión",
          headerShown: true,
          headerStyle: { 
            backgroundColor: colors.backgroundHeader 
          },
          headerTintColor: colors.text,
        }}
      >
        {(props) => <IniciarSesion {...props} setCorreoUsuario={setCorreoUsuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}


function DrawerNavigator({ correoUsuario }) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name="Inicio" 
        component={MenuStack}
        options={{ headerShown: false }}
      />
      <Drawer.Screen 
        name="Foro" 
        component={ForoStack} 
        options={{ headerShown: false }}
      />
      
      {correoUsuario && (
        <>
          <Drawer.Screen name="Mis Listas" component={MisListasStack} />
          <Drawer.Screen name="Mis favoritos" component={FavoritosStack} />
        </>
      )}
    </Drawer.Navigator>
  );
}




// Función del stack para el menú principal y detalles
function MenuStack() {
  const colors = useThemeColors();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
      <Stack.Screen name="Detalles" component={DetallesLibro} 
        options={{
          title: "Detalles del libro",
          headerStyle: {
            backgroundColor: colors.backgroundHeader, // Fondo oscuro o claro del encabezado
          },
          headerTintColor: colors.text, // Color del texto del título
        }}
      />
      <Stack.Screen name="MisListasScreen" component={MisListas} options={{ title: "Mis Listas" }} />
      <Stack.Screen name="LeerLibro" component={LeerLibro} 
        options={{ title: "Leyendo...",
          headerStyle: {
            backgroundColor: colors.backgroundHeader, // Fondo oscuro o claro del encabezado
          },
          headerTintColor: colors.text, // Color del texto del título
        }}
      />
      {/* <Stack.Screen 
        name="IniciarSesion" 
        component={IniciarSesion} 
        options={{
          title: "Iniciar Sesión",
          headerStyle: { 
            backgroundColor: colors.backgroundHeader 
          },
          headerTintColor: colors.text,
        }}
      /> */}
    </Stack.Navigator>
  );
}

function ForoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ForoScreen" component={Foro} />
    </Stack.Navigator>
  );
}

function EstadisticasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EstadisticasScreen" component={Estadisticas} />
    </Stack.Navigator>
  );
}

function FavoritosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritosScreen" component={Favoritos} />
      <Stack.Screen name="DetallesLibro" component={DetallesLibro} />
    </Stack.Navigator>
  );
}

function LeidosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeidosScreen" component={Leidos} />
    </Stack.Navigator>
  );
}

function EnProcesoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EnProcesoScreen" component={EnProceso} />
    </Stack.Navigator>
  );
}

function MisListasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MisListasScreen" component={MisListas} />
    </Stack.Navigator>
  );
}

