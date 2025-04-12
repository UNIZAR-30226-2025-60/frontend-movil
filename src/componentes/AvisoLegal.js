// AvisoLegal.js
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../componentes/Tema';
import Encabezado from '../componentes/Encabezado';

export default function AvisoLegal({ navigation, correoUsuario }) {
   const colors = useThemeColors();

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
         <Encabezado titulo="Aviso Legal" correoUsuario={correoUsuario} />

         <ScrollView contentContainerStyle={[styles.container]}>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Información General</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`El presente aviso legal regula el uso del sitio web Bookly, estableciendo los términos y condiciones de utilización.`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Identificación del Titular</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Razón Social: Bookly S.L. 
CIF: B-12345678
Correo electrónico: contacto@bookly.com`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Condiciones de Uso</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`El usuario se compromete a utilizar el sitio web de conformidad con la ley, la moral, las buenas costumbres y el orden público.`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Propiedad Intelectual</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Todos los contenidos de este sitio web son propiedad de Bookly S.L. y están protegidos por derechos de propiedad intelectual.`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Limitación de Responsabilidad</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Bookly S.L. no se hace responsable de los daños y perjuicios derivados del uso del sitio web.`}
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
   },
   subtitulo: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 10,
   },
   texto: {
      fontSize: 15,
      textAlign: 'justify',
      marginBottom: 8,
   },
});
