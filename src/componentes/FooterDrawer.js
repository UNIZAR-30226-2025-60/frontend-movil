// FooterDrawer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useThemeColors } from './Tema';

export default function FooterDrawer(props) {
   const colors = useThemeColors();

   // Ruta actual que se muestra en el Drawer
   const currentRouteName = props.state.routeNames[props.state.index];

   // Para cada ítem, verifica si está enfocada
   const isAvisoLegalFocused = currentRouteName === 'AvisoLegal';
   const isPoliticaFocused = currentRouteName === 'PoliticaPrivacidad';
   const isContactoFocused = currentRouteName === 'Contacto';

   return (
      <DrawerContentScrollView
         {...props}
         contentContainerStyle={[styles.container, { backgroundColor: colors.backgroundMenu }]}
      >
         {/* Área Principal con la lista de items */}
         <View style={styles.main}>
            <DrawerItemList {...props} />
         </View>

         {/* Footer con las opciones legales y de contacto */}
         <View style={styles.footer}>
            <DrawerItem
               label="Aviso Legal"
               labelStyle={{ color: isAvisoLegalFocused ? colors.textDark : colors.text }}
               focused={isAvisoLegalFocused}
               activeTintColor={colors.textDark}
               activeBackgroundColor={colors.switchFondoSeleccionado} // ¡mismo color!
               onPress={() => props.navigation.navigate('AvisoLegal')}
            />

            <DrawerItem
               label="Política de Privacidad"
               labelStyle={{ color: isPoliticaFocused ? colors.textDark : colors.text }}
               focused={isPoliticaFocused}
               activeTintColor={colors.textDark}
               activeBackgroundColor={colors.switchFondoSeleccionado}
               onPress={() => props.navigation.navigate('PoliticaPrivacidad')}
            />

            <DrawerItem
               label="Contacto"
               labelStyle={{ color: isContactoFocused ? colors.textDark : colors.text }}
               focused={isContactoFocused}
               activeTintColor={colors.textDark}
               activeBackgroundColor={colors.switchFondoSeleccionado}
               onPress={() => props.navigation.navigate('Contacto')}
            />
         </View>
      </DrawerContentScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'space-between',
   },
   main: {
      flexGrow: 1,
   },
   footer: {
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      paddingVertical: 10,
   },
});
