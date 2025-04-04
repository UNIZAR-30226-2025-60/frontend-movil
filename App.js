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

// Importación de pantallas principales
import DetallesLibro from './src/pantallas/DetallesLibro';
import LibrosDeLista from './src/componentes/LibrosDeLista';

import MenuUsuario from "./src/pantallas/MenuUsuario";
import IniciarSesion from './src/pantallas/IniciarSesion';
import Registrarse from "./src/pantallas/Registrarse";
import MenuPerfil from './src/pantallas/MenuPerfil';
import CambioContrasena from './src/pantallas/CambioContrasena';
import CambioNombre from './src/pantallas/CambioNombre';
import Menu from './src/pantallas/Menu';
import LeerLibro from './src/pantallas/LeerLibro';
import Foro from './src/pantallas/Foro';
import RespuestasForo from './src/pantallas/RespuestasForo';
import Estadisticas from './src/pantallas/Estadisticas';
import Favoritos from './src/pantallas/Favoritos';
import Leidos from './src/pantallas/Leidos';
import EnProceso from './src/pantallas/EnProceso';
import MisListas from './src/pantallas/MisListas';
import ListasPublicas from './src/pantallas/ListasPublicas';
import CrearLista from './src/pantallas/CrearLista';
import EditarLista from './src/pantallas/EditarLista';
import AñadirValoracion from './src/componentes/AñadirValoracion';

// Importación del tema de colores
import { useThemeColors } from './src/componentes/Tema';

// Creación de navegadores
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
          headerTintColor: colors.textHeader,
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
          headerTintColor: colors.textHeader,
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
          headerTintColor: colors.textHeader,
        }}
      />

      <Stack.Screen
        name="MenuPerfil"
        component={MenuPerfil}
        initialParams={{ correoUsuario, setCorreoUsuario }}
        options={{ 
          headerShown: true, 
          title: "Mi Perfil",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader, }}
      />

      <Stack.Screen
        name="CambioContrasena"
        component={CambioContrasena}
        initialParams={{ correoUsuario }}
        options={{ 
          headerShown: true, 
          title: "Editar contraseña",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader, }}
      />

      <Stack.Screen
        name="CambioNombre"
        component={CambioNombre}
        initialParams={{ correoUsuario }}
        options={{ 
          headerShown: true, 
          title: "Editar nombre",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader, }}
      />
    </Stack.Navigator>
  );
}

/**
 * 📌 DrawerNavigator: Menú lateral de la app
 *  - Muestra opciones según si el usuario está autenticado o no.
 */
function DrawerNavigator({ correoUsuario }) {
  const colors = useThemeColors();

  return (
    <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.backgroundMenu, // Color de fondo del Drawer
          },
          drawerLabelStyle: {
            color: colors.text, // Color del texto de las opciones
          },
          // Para cuando el item está seleccionado
          drawerActiveTintColor: colors.text, // El texto del ítem seleccionado será el color de fondo
          headerShown: false, // Oculta el header en todas las pantallas
        }}
    >
      <Drawer.Screen name="Inicio">
        {(props) => <MenuStack {...props} correoUsuario={correoUsuario} />}
      </Drawer.Screen>

      <Drawer.Screen name="Foro">
        {props => <ForoStack {...props} correoUsuario={correoUsuario} />}
      </Drawer.Screen>

      <Drawer.Screen name="Listas públicas">
        {(props) => <ListasPublicasStack {...props} correoUsuario={correoUsuario} />}
      </Drawer.Screen>
      
      {correoUsuario && (
        <>
          <Drawer.Screen name="Mis Listas">
            {(props) => <MisListasStack {...props} correoUsuario={correoUsuario} />}
          </Drawer.Screen>

          <Drawer.Screen name="Mis favoritos">
            {props => <FavoritosStack {...props} correoUsuario={correoUsuario} />}
          </Drawer.Screen>

          <Drawer.Screen name="Leídos">
            {(props) => <LeidosStack {...props} correoUsuario={correoUsuario} />}
          </Drawer.Screen>
          
          <Drawer.Screen name="En Proceso">
            {(props) => <EnProcesoStack {...props} correoUsuario={correoUsuario} />}
          </Drawer.Screen>

          <Drawer.Screen name="Estadísticas">
            {(props) => <EstadisticasStack {...props} />}
          </Drawer.Screen>
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
      <Stack.Screen name="Detalles"
        options={{ 
          title: "Detalles del libro",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <DetallesLibro {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
      <Stack.Screen name="MisListasScreen" component={MisListas} options={{ title: "Mis Listas" }} />
      <Stack.Screen name="LeerLibro"
        options={{ 
          title: "Leyendo...",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <LeerLibro {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>

      <Stack.Screen name="AñadirValoracion"
        options={{ 
          title: "Nueva valoración",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <AñadirValoracion {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
      
      <Stack.Screen name="CrearLista"
        options={({ route }) => ({
          headerShown: true,
          title: "Crear Lista",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        })}
      >
        {(props) => (<CrearLista {...props} correoUsuario={correoUsuario} />)}
      </Stack.Screen>

    </Stack.Navigator>
  );
}

/**
 * 📌 ForoStack: Pila de navegación del foro
 */
function ForoStack({ correoUsuario }) {
  const colors = useThemeColors();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ForoScreen"
        options={{ headerShown: false }}
      >
        {props => <Foro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen 
        name="RespuestasForo"
        options={{
          title: 'Respuestas',
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        {props => <RespuestasForo {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/**
 * 📌 EstadisticasStack: Pila de navegación para la sección de estadísticas
 */
function EstadisticasStack({ correoUsuario }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EstadisticasScreen">
        {props => <Estadisticas {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/**
 * 📌 FavoritosStack: Pila de navegación para la sección de favoritos
 */
function FavoritosStack({ correoUsuario }) {
  const colors = useThemeColors();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritosScreen">
        {(props) => (<Favoritos {...props} correoUsuario={correoUsuario} />)}
      </Stack.Screen>

      <Stack.Screen name="Detalles"
        options={{
          headerShown: true,
          title: "Detalles del libro",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >

        {(props) => <DetallesLibro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen name="LeerLibro"
        options={{ 
          title: "Leyendo...",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <LeerLibro {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>

      <Stack.Screen name="AñadirValoracion"
        options={{ 
          headerShown: true,
          title: "Nueva valoración",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <AñadirValoracion {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/**
 * 📌 LeidosStack
 */
function LeidosStack({ correoUsuario }) {
  const colors = useThemeColors();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeidosScreen">
        {(props) => <Leidos {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen
        name="Detalles"
        options={{
          headerShown: true,
          title: "Detalles del libro",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >
        {(props) => <DetallesLibro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen
        name="LeerLibro"
        options={{
          headerShown: true,
          title: "Leyendo...",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >
        {(props) => <LeerLibro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen name="AñadirValoracion"
        options={{ 
          headerShown: true,
          title: "Nueva valoración",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <AñadirValoracion {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/**
 * 📌 EnProcesoStack
 */
function EnProcesoStack({ correoUsuario }) {
  const colors = useThemeColors();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EnProcesoScreen">
        {(props) => <EnProceso {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen
        name="Detalles"
        options={{
          headerShown: true,
          title: "Detalles del libro",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >
        {(props) => <DetallesLibro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen
        name="LeerLibro"
        options={{
          headerShown: true,
          title: "Leyendo...",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >
        {(props) => <LeerLibro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen name="AñadirValoracion"
        options={{ 
          headerShown: true,
          title: "Nueva valoración",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <AñadirValoracion {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/**
 * 📌 MisListasStack: Pila de navegación para las listas de usuario
 */
function MisListasStack({ correoUsuario }) {
  const colors = useThemeColors();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MisListasScreen">
        {(props) => (<MisListas {...props} correoUsuario={correoUsuario} />)}
      </Stack.Screen>

      <Stack.Screen name="CrearLista"
        options={({ route }) => ({
          headerShown: true,
          title: "Crear Lista",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        })}
      >
        {(props) => (<CrearLista {...props} correoUsuario={correoUsuario} />)}
      </Stack.Screen>

      <Stack.Screen name="EditarLista" component={EditarLista}
        options={({ route }) => ({
          headerShown: true,
          title: "Crear Lista",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        })} 
      />

      <Stack.Screen name="MisFavoritosScreen" component={Favoritos} />

      <Stack.Screen name="LibrosDeListaScreen"
        options={({ route }) => ({
          headerShown: true,
          title: "Mis Listas",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        })}
      >
        {(props) => (<LibrosDeLista {...props} correoUsuario={correoUsuario} />)}
      </Stack.Screen>

      <Stack.Screen name="Detalles" 
        options={{
          headerShown: true,
          title: "Detalles del libro",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >
        {(props) => <DetallesLibro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen name="LeerLibro"
        options={{ 
          title: "Leyendo...",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <LeerLibro {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>

      <Stack.Screen name="AñadirValoracion"
        options={{ 
          headerShown: true,
          title: "Nueva valoración",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <AñadirValoracion {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
}

/**
 * 📌 ListasPublicasStack
 */
function ListasPublicasStack({ correoUsuario }) {
  const colors = useThemeColors();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="ListasPublicasScreen">
        {(props) => <ListasPublicas {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>
      
      <Stack.Screen
        name="LibrosDeListaScreen"
        options={{
          headerShown: true,
          title: "Libros de la lista",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >
        {(props) => <LibrosDeLista {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen
        name="Detalles"
        options={{
          headerShown: true,
          title: "Detalles del libro",
          headerStyle: { backgroundColor: colors.backgroundHeader },
          headerTintColor: colors.textHeader,
        }}
      >
        {(props) => <DetallesLibro {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>

      <Stack.Screen name="AñadirValoracion"
        options={{ 
          headerShown: true,
          title: "Nueva valoración",
          headerStyle: { backgroundColor: colors.backgroundHeader }, // Fondo oscuro o claro del encabezado
          headerTintColor: colors.textHeader, // Color del texto del título
        }}
      >
        {(props) => <AñadirValoracion {...props} correoUsuario={correoUsuario} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
}