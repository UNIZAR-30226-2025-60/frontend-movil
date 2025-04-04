// Podio.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../componentes/Tema';

/**
 * Función auxiliar para alinear el texto según el puesto.
 * El segundo lugar se alinea a la izquierda, el primero al centro
 * y el tercero a la derecha.
 */
function getTextAlignmentStyles(place) {
   switch (place) {
      case 1: return { textAlign: 'center' };
      case 2: return { textAlign: 'left' };
      case 3: return { textAlign: 'right' };
      default: return { textAlign: 'center' };
   }
}

/**
 * PodioColumna: renderiza una columna con el nombre/imagen
 * del usuario arriba y la base del podio abajo.
 */
function PodioColumna({ height, user, place }) {
   const colors = useThemeColors();

   // Selección de color según el puesto
   let baseColor = '#ccc';
   switch (place) {
      case 1: baseColor = '#FFD700'; break;
      case 2: baseColor = '#C0C0C0'; break;
      case 3: baseColor = '#CD7F32'; break;
      default: break;
   }

   // Determinar el nombre o recortar el correo
   const mostrarNombre = user.nombre
      ? user.nombre
      : (user.usuario_id.includes('@')
         ? user.usuario_id.split('@')[0]
         : user.usuario_id);

   return (
      <View style={styles.columnaContainer}>
         <Text style={[styles.userText, { color: colors.text }, getTextAlignmentStyles(place)]}>
            {mostrarNombre}
         </Text>
         <View style={[styles.basePodio, { backgroundColor: baseColor, height }]}>
            <Text style={[styles.placeText, { color: colors.text }]}>{place}</Text>
         </View>
      </View>
   );
}

/**
 * Podio: renderiza el contenedor con las 3 columnas (2º, 1º, 3º)
 */
export default function Podio({ data, titulo }) {
   const colors = useThemeColors();

   // Si no hay datos, mostramos placeholders
   if (!data || data.length === 0) {
      return (
         <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{titulo}</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>---</Text>
         </View>
      );
   }

   // Si hay menos de 3 elementos, rellenamos con placeholders
   const padded = [...data];
   while (padded.length < 3) {
      padded.push({ usuario_id: "---", libros_leidos: "---" });
   }

   // Asumimos que:
   // data[0] = primer lugar, data[1] = segundo, data[2] = tercero
   const firstPlace = padded[0];
   const secondPlace = padded[1];
   const thirdPlace = padded[2];

   return (
      <View style={[styles.sectionContainer, { backgroundColor: colors.backgroundSecondary }]}>
         <Text style={[styles.sectionTitle, { color: colors.text }]}>{titulo}</Text>

         <View style={styles.podiumRow}>
            {/* Segundo lugar */}
            <View style={styles.podiumColumn2}>
               <PodioColumna height={80} user={secondPlace} place={2} />
            </View>

            {/* Primer lugar */}
            <View style={styles.podiumColumn1}>
               <PodioColumna height={120} user={firstPlace} place={1} />
            </View>

            {/* Tercer lugar */}
            <View style={styles.podiumColumn3}>
               <PodioColumna height={60} user={thirdPlace} place={3} />
            </View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   sectionContainer: {
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
   },
   infoText: {
      fontSize: 14,
   },

   // Fila que agrupa las 3 columnas
   podiumRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
   },

   podiumColumn2: {
      width: 80,
      alignItems: 'center',
      overflow: 'visible',
   },
   podiumColumn1: {
      width: 80,
      alignItems: 'center',
      overflow: 'visible',
   },
   podiumColumn3: {
      width: 80,
      alignItems: 'center',
      overflow: 'visible',
   },

   // Columna individual
   columnaContainer: {
      alignItems: 'center',
      overflow: 'visible',
   },
   userText: {
      fontSize: 14,
      marginBottom: 4,
      width: '100%',
      flexWrap: 'wrap',
   },

   // Base del podio
   basePodio: {
      width: 80,
      alignItems: 'center',
      justifyContent: 'center',
   },
   placeText: {
      fontWeight: 'bold',
      fontSize: 30,
   },
});
