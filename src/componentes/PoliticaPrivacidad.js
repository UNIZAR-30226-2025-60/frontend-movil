// PoliticaPrivacidad.js
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../componentes/Tema';
import Encabezado from '../componentes/Encabezado';

export default function PoliticaPrivacidad({ navigation, correoUsuario }) {
   const colors = useThemeColors();

   return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
         {/* Encabezado */}
         <Encabezado titulo="Política de Privacidad" correoUsuario={correoUsuario} />

         <ScrollView contentContainerStyle={[styles.container]}>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Información sobre Tratamiento de Datos</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`En Bookly, nos comprometemos a proteger la privacidad de nuestros usuarios y a cumplir con la normativa vigente de protección de datos.`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Responsable del Tratamiento</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Razón Social: Bookly S.L. 
CIF: B-12345678
Correo electrónico: privacidad@bookly.com`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Tipos de Datos Recogidos</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Recopilamos datos personales necesarios para la gestión de las cuentas y comunicación entre lectores.`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Finalidad del Tratamiento</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Los datos se utilizarán única y exclusivamente para la gestión de cuentas, comunicaciones relacionadas y mejora de nuestros servicios.`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Derechos del Usuario</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Los usuarios pueden ejercer sus derechos de acceso, rectificación, cancelación y oposición contactando con nosotros por los medios indicados.`}
            </Text>

            <Text style={[styles.subtitulo, { color: colors.textDark }]}>Seguridad de la Información</Text>
            <Text style={[styles.texto, { color: colors.text }]}>
               {`Implementamos medidas técnicas y organizativas para proteger la información personal de nuestros usuarios contra accesos no autorizados.`}
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
