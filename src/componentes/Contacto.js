// Contacto.js
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../componentes/Tema';
import Encabezado from '../componentes/Encabezado';

export default function Contacto({ navigation, correoUsuario }) {
   const colors = useThemeColors();

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
         {/* Encabezado */}
         <Encabezado titulo="Contacto" correoUsuario={correoUsuario} />

         <ScrollView contentContainerStyle={[styles.container]}>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Información de Contacto</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Si tienes alguna duda o sugerencia, no dudes en contactarnos.`}
            </Text>

            <Text style={[styles.texto, { color: colors.text }]}>
               {`Correo electrónico: contacto@bookly.com`}
            </Text>

            <Text style={[styles.texto, { color: colors.text }]}>
               {`Teléfono: +123 456 789`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Propiedad Intelectual</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Dirección: Calle Viena, 123, España`}
            </Text>

            <Text style={[styles.texto, { color: colors.text }]}>
               {`Horario de atención: Lunes a Viernes de 9:00 a 18:00`}
            </Text>

         </ScrollView>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      padding: 16,
   },
   titulo: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
   },
   subtitulo: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 10,
   },
   texto: {
      fontSize: 15,
      marginBottom: 8,
   },
});
