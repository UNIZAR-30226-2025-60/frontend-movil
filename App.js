// App.js
import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider as PaperProvider } from "react-native-paper";
import { Text } from 'react-native'; // Asegúrate de importar Text

import Menu from './src/pantallas/Menu';
import DetallesLibro from './src/componentes/DetallesLibro';
import Foro from './src/pantallas/Foro';
import LeerLibro from './src/pantallas/LeerLibro';
import Favoritos from './src/pantallas/Favoritos';
import MisListas from './src/pantallas/MisListas';
import IniciarSesion from './src/pantallas/IniciarSesion';

import { useThemeColors } from './src/componentes/Tema';
import Encabezado from "./src/componentes/Encabezado";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ELIMINAR ESTO CUANDO ESTÉN LAS PANTALLAS
const Estadisticas = () => <Text>Estadísticas</Text>;
const Leidos = () => <Text>Leídos</Text>;
const EnProceso = () => <Text>En Proceso</Text>;
const Registrarse = () => <Text>Registrarse</Text>;
//

export default function App() {
  const [correoUsuario, setCorreoUsuario] = useState(() => null);

  return (
    <PaperProvider>
      <NavigationContainer>
        <RootStack correoUsuario={correoUsuario} setCorreoUsuario={setCorreoUsuario} />
      </NavigationContainer>
    </PaperProvider>
  );
}

function RootStack({ correoUsuario, setCorreoUsuario }) {
  const colors = useThemeColors();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer">
        {(props) => <DrawerNavigator {...props} correoUsuario={correoUsuario} setCorreoUsuario={setCorreoUsuario} />}
      </Stack.Screen>
      <Stack.Screen 
        name="IniciarSesion"
        options={{
          title: "Iniciar Sesión",
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.text,
        }}
      >
        {(props) => <IniciarSesion {...props} setCorreoUsuario={setCorreoUsuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// function DrawerNavigator({ correoUsuario, setCorreoUsuario }) {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen 
//         name="Inicio" 
//         options={{ headerShown: false }}
//         component={MenuStack}
//       />
//       <Drawer.Screen 
//         name="Foro" 
//         component={ForoStack} 
//         options={{ headerShown: false }}
//       />

//       {!correoUsuario ? (
//         <>
//           {/* <Drawer.Screen name="Iniciar Sesión">
//             {(props) => <IniciarSesion {...props} setCorreoUsuario={setCorreoUsuario} />}
//           </Drawer.Screen> */}
//           <Drawer.Screen 
//             name="Iniciar Sesión" 
//             component={IniciarSesion} 
//             options={{ headerShown: true }}
//           />
//           <Drawer.Screen name="Registrarse" component={Registrarse} />
//         </>
//       ) : (
//         <>
//           <Drawer.Screen name="Mis Listas" component={MisListasStack} />
//           <Drawer.Screen name="Mis Favoritos" component={FavoritosStack} />

//           <Drawer.Screen 
//             name="Cerrar Sesión"
//             component={() => {
//               setCorreoUsuario(null);
//               return null;
//             }}
//           />
//         </>
//       )}
//     </Drawer.Navigator>
//   );
// }

function DrawerNavigator({ correoUsuario, setCorreoUsuario }) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name="Inicio" 
        options={{ headerShown: false }}
        component={MenuStack}
      />
      <Drawer.Screen 
        name="Foro" 
        component={ForoStack} 
        options={{ headerShown: false }}
      />

      {!correoUsuario ? (
        <>
          <Drawer.Screen 
            name="Iniciar Sesión"
            options={{ headerShown: true }}
          >
            {(props) => <IniciarSesion {...props} setCorreoUsuario={setCorreoUsuario} />}
          </Drawer.Screen>
          <Drawer.Screen name="Registrarse" component={Registrarse} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Mis Listas" component={MisListasStack} />
          <Drawer.Screen name="Mis Favoritos" component={FavoritosStack} />
          <Drawer.Screen 
            name="Cerrar Sesión"
            component={() => {
              setCorreoUsuario(null);
              return null;
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}



function MenuStack() {
  const colors = useThemeColors();
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Menu" 
        component={Menu}
        options={{ 
          headerShown: false 
        }}
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

function ForoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Foro Bookly" component={Foro} />
    </Stack.Navigator>
  );
}

function EstadisticasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Estadísticas" component={Estadisticas} />
    </Stack.Navigator>
  );
}

function FavoritosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mis libros favoritos" component={Favoritos} />
      <Stack.Screen name="DetallesLibro" component={DetallesLibro} />
    </Stack.Navigator>
  );
}

function LeidosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Leídos" component={Leidos} />
    </Stack.Navigator>
  );
}

function EnProcesoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="En Proceso" component={EnProceso} />
    </Stack.Navigator>
  );
}

function MisListasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mis Listas" component={MisListas} />
    </Stack.Navigator>
  );
}
