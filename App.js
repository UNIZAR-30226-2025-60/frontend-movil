/**
 * Archivo: App.js
 * Descripción: Configuración de la navegación principal de la app.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useThemeColors } from './src/componentes/Tema';
import { useColorScheme } from 'react-native';
import { useUsuario } from './UsuarioContext'; 
import { UsuarioProvider } from './UsuarioContext';
import { StatusBar } from 'react-native';


// Componentes
import AñadirValoracion from './src/componentes/AñadirValoracion';
import AvisoLegal from './src/componentes/AvisoLegal';
import Contacto from './src/componentes/Contacto';
import FooterDrawer from './src/componentes/FooterDrawer';
import LibrosDeLista from './src/componentes/LibrosDeLista';
import PoliticaPrivacidad from './src/componentes/PoliticaPrivacidad';

// Pantallas
import CambioContrasena from './src/pantallas/CambioContrasena';
import CambioNombre from './src/pantallas/CambioNombre';
import CrearLista from './src/pantallas/CrearLista';
import DetallesLibro from './src/pantallas/DetallesLibro';
import EditarLista from './src/pantallas/EditarLista';
import EnProceso from './src/pantallas/EnProceso';
import Estadisticas from './src/pantallas/Estadisticas';
import Favoritos from './src/pantallas/Favoritos';
import Foro from './src/pantallas/Foro';
import IniciarSesion from './src/pantallas/IniciarSesion';
import Leidos from './src/pantallas/Leidos';
import LeerLibro from './src/pantallas/LeerLibro';
import ListasPublicas from './src/pantallas/ListasPublicas';
import Menu from './src/pantallas/Menu';
import MenuPerfil from './src/pantallas/MenuPerfil';
import MenuUsuario from "./src/pantallas/MenuUsuario";
import MisListas from './src/pantallas/MisListas';
import Registrarse from "./src/pantallas/Registrarse";
import RespuestasForo from './src/pantallas/RespuestasForo';

// Navegadores
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * 📌 Componente principal App
 */
export default function App() {
   const colors = useThemeColors();
   const theme = useColorScheme();

   return (
      <UsuarioProvider>
         <StatusBar
            barStyle={theme === "dark" ? "light-content" : "dark-content"}
            backgroundColor={colors.background}
         />
         <NavigationContainer>
            <RootStack />
         </NavigationContainer>
      </UsuarioProvider>
   );
}

/**
 * Estilos de header para pantallas auth y detalles
 */
function authHeaderOptions(title, colors) {
   return {
      title,
      headerShown: true,
      headerStyle: { backgroundColor: colors.backgroundHeader },
      headerTintColor: colors.textHeader,
   };
}

/**
 * 📌 RootStack: Pila principal que incluye Drawer y pantallas de auth
 */
function RootStack() {
   const { correoUsuario, setCorreoUsuario } = useUsuario();
   const colors = useThemeColors();

   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Drawer" >
            {(props) => <DrawerNavigator {...props} correoUsuario={correoUsuario} />}
         </Stack.Screen>

         {/* Pantallas de autenticación */}
         <Stack.Screen name="IniciarSesion" options={authHeaderOptions("Iniciar Sesion", colors)}>
            {(props) => <IniciarSesion {...props} setCorreoUsuario={setCorreoUsuario} />}
         </Stack.Screen>

         <Stack.Screen name="Registrarse" options={authHeaderOptions("Registrarse", colors)}>
            {(props) => <Registrarse {...props} setCorreoUsuario={setCorreoUsuario} />}
         </Stack.Screen>

         {/* Pantallas de usuario */}
         <Stack.Screen name="MenuUsuario" component={MenuUsuario} options={authHeaderOptions("Menú de Usuario", colors)} />
         <Stack.Screen name="MenuPerfil" component={MenuPerfil} /*initialParams={{ correoUsuario, setCorreoUsuario }}*/ options={authHeaderOptions("Mi Perfil", colors)} />
         <Stack.Screen name="CambioContrasena" component={CambioContrasena} initialParams={{ correoUsuario }} options={authHeaderOptions("Editar contraseña", colors)} />
         <Stack.Screen name="CambioNombre" component={CambioNombre} initialParams={{ correoUsuario }} options={authHeaderOptions("Editar nombre", colors)} />

         {/* Detalles de libro */}
         <Stack.Screen name="Detalles" options={authHeaderOptions("Detalles del libro", colors)}>
            {(props) => <DetallesLibro {...props} correoUsuario={correoUsuario} />}
         </Stack.Screen>

      </Stack.Navigator>
   );
}

/**
 * 📌 DrawerNavigator: Menú lateral de la app
 */
function DrawerNavigator({ correoUsuario }) {
   const colors = useThemeColors();

   return (
      <Drawer.Navigator
         drawerContent={(props) => <FooterDrawer {...props} />}
         screenOptions={{
            drawerStyle: { backgroundColor: colors.backgroundMenu },
            drawerLabelStyle: { color: colors.text },
            drawerActiveTintColor: colors.textDark,
            drawerActiveBackgroundColor: colors.switchFondoNoSeleccionado, // Fondo activo
            headerShown: false,
         }}
      >

         {/* Siempre visibles */}
         <Drawer.Screen name="Inicio">{(props) => <MenuStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>
         <Drawer.Screen name="Foro">{props => <ForoStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>
         <Drawer.Screen name="Estadísticas">{(props) => <EstadisticasStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>
         <Drawer.Screen name="Listas públicas">{(props) => <ListasPublicasStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>

         {/* Solo si hay usuario logueado */}
         {correoUsuario && (
            <>
               <Drawer.Screen name="Mis Listas">{(props) => <MisListasStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>
               <Drawer.Screen name="Mis favoritos">{props => <FavoritosStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>
               <Drawer.Screen name="Leídos">{(props) => <LeidosStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>
               <Drawer.Screen name="En Proceso">{(props) => <EnProcesoStack {...props} correoUsuario={correoUsuario} />}</Drawer.Screen>
            </>
         )}

         {/* Se deben definir las pantallas de AvisoLegal, PoliticaPrivacidad y Contacto, aunque no se muestren en la lista principal del Drawer (la navegación se realiza desde el FooterDrawer) */}
         {['AvisoLegal', 'PoliticaPrivacidad', 'Contacto'].map(screen => (
            <Drawer.Screen
               key={screen}
               name={screen}
               options={{ headerShown: false, drawerItemStyle: { display: 'none' } }}
               component={{ AvisoLegal, PoliticaPrivacidad, Contacto }[screen]}
            />
         ))}

      </Drawer.Navigator>
   );
}

/**
 * Función auxiliar para obtener las opciones comunes del encabezado.
 */
const getHeaderOptions = (colors, title, showHeader = true) => ({
   headerShown: showHeader,
   title,
   headerStyle: { backgroundColor: colors.backgroundHeader },
   headerTintColor: colors.textHeader,
});

/**
 * Función auxiliar para renderizar una pantalla.
 * Recibe la configuración de la ruta, los colores del tema y el correoUsuario.
 */
const renderScreen = (route, colors, correoUsuario) => {
   // Si se suministra un título se asume que se debe mostrar el header, sino se oculta
   const options = route.title
      ? getHeaderOptions(colors, route.title)
      : { headerShown: false };
   return (
      <Stack.Screen key={route.name} name={route.name} options={route.options ? { ...options, ...route.options } : options}>
         {props => <route.Component {...props} correoUsuario={correoUsuario} />}
      </Stack.Screen>
   );
};

/* 📌 MenuStack: Pila de navegación del menú principal */
function MenuStack({ correoUsuario }) {
   const colors = useThemeColors();
   const routes = [
      { name: "Menu", Component: Menu, options: { headerShown: false } },
      { name: "Detalles", Component: DetallesLibro, title: "Detalles del libro" },
      { name: "MisListasScreen", Component: MisListas, title: "Mis Listas" },
      { name: "LeerLibro", Component: LeerLibro, title: "Leyendo..." },
      { name: "AñadirValoracion", Component: AñadirValoracion, title: "Nueva valoración" },
      { name: "CrearLista", Component: CrearLista, title: "Crear Lista" },
   ];
   return (
      <Stack.Navigator>
         {routes.map(route => renderScreen(route, colors, correoUsuario))}
      </Stack.Navigator>
   );
}

/* 📌 ForoStack: Pila de navegación del foro */
function ForoStack({ correoUsuario }) {
   const colors = useThemeColors();
   const routes = [
      { name: "ForoScreen", Component: Foro, options: { headerShown: false } },
      { name: "RespuestasForo", Component: RespuestasForo, title: "Respuestas", options: { headerTitleStyle: { fontWeight: 'bold' } } },
   ];
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {routes.map(route => renderScreen(route, colors, correoUsuario))}
      </Stack.Navigator>
   );
}

/* 📌 EstadisticasStack: Pila de navegación para la sección de estadísticas */
function EstadisticasStack({ correoUsuario }) {
   const routes = [
      { name: "EstadisticasScreen", Component: Estadisticas, options: { headerShown: false } },
   ];
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {routes.map(route => renderScreen(route, {}, correoUsuario))}
      </Stack.Navigator>
   );
}

/* 📌 FavoritosStack: Pila de navegación para la sección de favoritos */
function FavoritosStack({ correoUsuario }) {
   const colors = useThemeColors();
   const routes = [
      { name: "FavoritosScreen", Component: Favoritos, options: { headerShown: false } },
      { name: "Detalles", Component: DetallesLibro, title: "Detalles del libro" },
      { name: "LeerLibro", Component: LeerLibro, title: "Leyendo..." },
      { name: "AñadirValoracion", Component: AñadirValoracion, title: "Nueva valoración" },
   ];
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {routes.map(route => renderScreen(route, colors, correoUsuario))}
      </Stack.Navigator>
   );
}

/* 📌 LeidosStack: Pila de navegación para la sección de leídos */
function LeidosStack({ correoUsuario }) {
   const colors = useThemeColors();
   const routes = [
      { name: "LeidosScreen", Component: Leidos, options: { headerShown: false } },
      { name: "Detalles", Component: DetallesLibro, title: "Detalles del libro" },
      { name: "LeerLibro", Component: LeerLibro, title: "Leyendo..." },
      { name: "AñadirValoracion", Component: AñadirValoracion, title: "Nueva valoración" },
   ];
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {routes.map(route => renderScreen(route, colors, correoUsuario))}
      </Stack.Navigator>
   );
}

/* 📌 EnProcesoStack: Pila de navegación para la sección en proceso */
function EnProcesoStack({ correoUsuario }) {
   const colors = useThemeColors();
   const routes = [
      { name: "EnProcesoScreen", Component: EnProceso, options: { headerShown: false } },
      { name: "Detalles", Component: DetallesLibro, title: "Detalles del libro" },
      { name: "LeerLibro", Component: LeerLibro, title: "Leyendo..." },
      { name: "AñadirValoracion", Component: AñadirValoracion, title: "Nueva valoración" },
   ];
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {routes.map(route => renderScreen(route, colors, correoUsuario))}
      </Stack.Navigator>
   );
}

/* 📌 MisListasStack: Pila de navegación para las listas de usuario */
function MisListasStack({ correoUsuario }) {
   const colors = useThemeColors();
   const routes = [
      { name: "MisListasScreen", Component: MisListas, options: { headerShown: false } },
      { name: "CrearLista", Component: CrearLista, title: "Crear Lista" },
      { name: "EditarLista", Component: EditarLista, title: "Editar Lista" },
      { name: "MisFavoritosScreen", Component: Favoritos, options: { headerShown: false } },
      { name: "LibrosDeListaScreen", Component: LibrosDeLista, title: "Mis Listas" },
      { name: "Detalles", Component: DetallesLibro, title: "Detalles del libro" },
      { name: "LeerLibro", Component: LeerLibro, title: "Leyendo..." },
      { name: "AñadirValoracion", Component: AñadirValoracion, title: "Nueva valoración" },
   ];
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {routes.map(route => renderScreen(route, colors, correoUsuario))}
      </Stack.Navigator>
   );
}

/* 📌 ListasPublicasStack: Pila de navegación para listas públicas */
function ListasPublicasStack({ correoUsuario }) {
   const colors = useThemeColors();
   const routes = [
      { name: "ListasPublicasScreen", Component: ListasPublicas, options: { headerShown: false } },
      { name: "LibrosDeListaScreen", Component: LibrosDeLista, title: "Libros de la lista" },
      { name: "Detalles", Component: DetallesLibro, title: "Detalles del libro" },
      { name: "CrearLista", Component: CrearLista, title: "Crear Lista" },
      { name: "LeerLibro", Component: LeerLibro, title: "Leyendo..." },
      { name: "AñadirValoracion", Component: AñadirValoracion, title: "Nueva valoración" },
   ];
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         {routes.map(route => renderScreen(route, colors, correoUsuario))}
      </Stack.Navigator>
   );
}