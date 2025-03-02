/**
 * Archivo: App.js
 * Descripción: Configuración de la navegación principal de la app.
 * Contenido:
 *  - Definición de navegadores (Stack, Drawer)
 *  - Manejo de autenticación con estado de usuario
 *  - Configuración del menú lateral (DrawerNavigator)
 *  - Pilas de navegación para cada sección de la app
 */

import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text } from 'react-native'; // Asegúrate de importar Text

// Importación de pantallas principales
import DetallesLibro from './src/componentes/DetallesLibro';
import LibrosDeLista from './src/componentes/LibrosDeLista';

import MenuUsuario from "./src/pantallas/MenuUsuario";
import IniciarSesion from './src/pantallas/IniciarSesion';
import Registrarse from "./src/pantallas/Registrarse";
import MenuPerfil from './src/pantallas/MenuPerfil';
import CambioContrasena from './src/pantallas/CambioContrasena';
import Menu from './src/pantallas/Menu';
import LeerLibro from './src/pantallas/LeerLibro';
import Foro from './src/pantallas/Foro';
import Favoritos from './src/pantallas/Favoritos';
import MisListas from './src/pantallas/MisListas';
import CrearLista from './src/pantallas/CrearLista';

// Importación del tema de colores
import { useThemeColors } from './src/componentes/Tema';

// Creación de navegadores
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ELIMINAR ESTO CUANDO ESTÉN LAS PANTALLAS
const Estadisticas = () => <Text>Estadísticas</Text>;
const Leidos = () => <Text>Leídos</Text>;
const EnProceso = () => <Text>En Proceso</Text>;

/**
 * 📌 Componente principal de la aplicación
 *  - Maneja el estado del usuario autenticado (`correoUsuario`)
 *  - Contiene `NavigationContainer` para envolver toda la navegación
 */
export default function App() {
  const [correoUsuario, setCorreoUsuario] = useState(null); // Estado para guardar el correo del usuario autenticado
  const colors = useThemeColors();

  return (
    <NavigationContainer>
      <RootStack correoUsuario={correoUsuario} setCorreoUsuario={setCorreoUsuario} />
    </NavigationContainer>
  );
}

/**
 * 📌 RootStack: Pila de navegación principal
 *  - Incluye el `DrawerNavigator` y las pantallas de autenticación.
 */
function RootStack({ correoUsuario, setCorreoUsuario }) {
  const colors = useThemeColors();
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" >
        {(props) => <DrawerNavigator {...props} correoUsuario={correoUsuario} />}
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

      <Stack.Screen 
        name="Registrarse"
        options={{
          title: "Registrarse",
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.text,
        }}
      >
        {(props) => <Registrarse {...props} setCorreoUsuario={setCorreoUsuario} />}
      </Stack.Screen>

      <Stack.Screen 
        name="MenuUsuario"
        component={MenuUsuario}
        options={{
          title: "Menú de Usuario",
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="MenuPerfil"
        component={MenuPerfil}
        initialParams={{ correoUsuario, setCorreoUsuario }}
        options={{ 
          headerShown: true, 
          title: "Perfil",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.text, }}
      />
      <Stack.Screen
        name="CambioContrasena"
        component={CambioContrasena}
        initialParams={{ correoUsuario }}
        options={{ 
          headerShown: true, 
          title: "Cambio contraseña",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.text, }}
      />
    </Stack.Navigator>
  );
}

/**
 * 📌 DrawerNavigator: Menú lateral de la app
 *  - Muestra opciones según si el usuario está autenticado o no.
 */
function DrawerNavigator({ correoUsuario }) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Inicio" options={{ headerShown: false }}>
        {(props) => <MenuStack {...props} correoUsuario={correoUsuario} />}
      </Drawer.Screen>
      <Drawer.Screen 
        name="Foro" 
        component={ForoStack} 
        options={{ headerShown: false }}
      />
      
      {correoUsuario && (
        <>
          <Drawer.Screen 
            name="Mis Listas" 
            component={MisListasStack}
            options={{
              headerShown: false,
              listeners: ({ navigation }) => ({
                drawerItemPress: (e) => {
                  e.preventDefault();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'MisListasScreen' }],
                  });
                },
              }),
            }}
          />
          <Drawer.Screen 
            name="Mis favoritos" 
            component={FavoritosStack}
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Drawer.Navigator>
  );
}

/**
 * 📌 MenuStack: Pila de navegación del menú principal
 * - Incluye la pantalla principal, detalles de libro y lector de libros.
 */
function MenuStack({ correoUsuario }) {
  const colors = useThemeColors();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Menu" options={{ headerShown: false }}>
        {(props) => <Menu {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
      <Stack.Screen name="Detalles" component={DetallesLibro} 
        options={{
          title: "Detalles del libro",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.text, // Color del texto del título
        }}
      />
      <Stack.Screen name="MisListasScreen" component={MisListas} options={{ title: "Mis Listas" }} />
      <Stack.Screen name="LeerLibro" component={LeerLibro} 
        options={{ title: "Leyendo...",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.text, // Color del texto del título
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * 📌 ForoStack: Pila de navegación del foro
 */
function ForoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ForoScreen" component={Foro} />
    </Stack.Navigator>
  );
}

/**
 * 📌 EstadisticasStack: Pila de navegación para la sección de estadísticas
 */
function EstadisticasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EstadisticasScreen" component={Estadisticas} />
    </Stack.Navigator>
  );
}

/**
 * 📌 FavoritosStack: Pila de navegación para la sección de favoritos
 */
function FavoritosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritosScreen" component={Favoritos} />
      <Stack.Screen name="DetallesLibro" component={DetallesLibro} />
    </Stack.Navigator>
  );
}

/**
 * 📌 LeidosStack
 */
function LeidosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeidosScreen" component={Leidos} />
    </Stack.Navigator>
  );
}

/**
 * 📌 EnProcesoStack
 */
function EnProcesoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EnProcesoScreen" component={EnProceso} />
    </Stack.Navigator>
  );
}

/**
 * 📌 MisListasStack: Pila de navegación para las listas de usuario
 */
function MisListasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MisListasScreen" component={MisListas} />
      <Stack.Screen name="CrearLista" component={CrearLista} />
      <Stack.Screen name="MisFavoritosScreen" component={Favoritos} />
      <Stack.Screen name="LibrosDeListaScreen" component={LibrosDeLista} />
    </Stack.Navigator>
  );
}

