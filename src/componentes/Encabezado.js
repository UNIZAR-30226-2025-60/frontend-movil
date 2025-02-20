// Encabezado.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useThemeColors } from "./Tema";
import { Menu, Divider } from "react-native-paper";

// export default function Encabezado() { // <-- Recibir setCorreoUsuario
//   const navigation = useNavigation();
//   const route = useRoute(); 
//   const colors = useThemeColors();
//   const [menuVisible, setMenuVisible] = useState(false);

//   const pantallasConTitulo = ["Mis Favoritos", "Mis Listas", "Foro", "Leídos"];

//   return (
//     <SafeAreaView style={{ backgroundColor: colors.backgroundHeader }}>
//       <View style={[styles.header, { backgroundColor: colors.backgroundHeader }]}>
        
//         {/* Botón de Menú */}
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//           <Ionicons name="menu" size={30} color={colors.icon} />
//         </TouchableOpacity>

//         {/* Título */}
//         <Text style={[styles.title, { color: colors.text }]}>BOOKLY</Text>

//         {/* Icono de Usuario con Menú */}
//         <Menu
//           visible={menuVisible}
//           onDismiss={() => setMenuVisible(false)}
//           anchor={
//             <TouchableOpacity onPress={() => setMenuVisible(true)}>
//               <Ionicons name="person-circle-outline" size={30} color={colors.icon} />
//             </TouchableOpacity>
//           }
//         >
//           {/* Opción de Iniciar Sesión */}
//           <Menu.Item 
//             onPress={() => {
//               setMenuVisible(false);
//               setCorreoUsuario(null); // <-- Resetear correo antes de ir a Iniciar Sesión
//               navigation.navigate("IniciarSesion"); // <-- Navegar a Iniciar Sesión
//             }} 
//             title="Iniciar Sesión" 
//           />
//           <Divider />
//           {/* Opción de Registrarse */}
//           <Menu.Item 
//             onPress={() => {
//               setMenuVisible(false);
//               navigation.navigate("Registrarse");
//             }} 
//             title="Registrarse" 
//           />
//         </Menu>
//       </View>

//       {/* Mostrar subtítulo solo en ciertas pantallas */}
//       {pantallasConTitulo.includes(route.name) && (
//         <View style={styles.subtituloContainer}>
//           <Text style={[styles.subtitulo, { color: colors.text }]}>{titulo}</Text>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

export default function Encabezado({ setCorreoUsuario }) { // 👈 Recibir setCorreoUsuario
  const navigation = useNavigation();
  const route = useRoute(); 
  const colors = useThemeColors();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={{ backgroundColor: colors.backgroundHeader }}>
      <View style={[styles.header, { backgroundColor: colors.backgroundHeader }]}>
        
        {/* Botón de Menú */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color={colors.icon} />
        </TouchableOpacity>

        {/* Título */}
        <Text style={[styles.title, { color: colors.text }]}>BOOKLY</Text>

        {/* Icono de Usuario con Menú */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="person-circle-outline" size={30} color={colors.icon} />
            </TouchableOpacity>
          }
        >
          {/* Opción de Iniciar Sesión */}
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              setCorreoUsuario(null); // ✅ Ahora sí existe y funciona
              navigation.navigate("IniciarSesion");
            }} 
            title="Iniciar Sesión" 
          />
          <Divider />
          {/* Opción de Registrarse */}
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate("Registrarse");
            }} 
            title="Registrarse" 
          />
        </Menu>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtituloContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
