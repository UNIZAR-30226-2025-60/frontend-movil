import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useThemeColors } from '../componentes/Tema';
import Encabezado from '../componentes/Encabezado';
import Podio from '../componentes/Podio';
import { API_URL } from '../../config';

export default function Estadisticas({ correoUsuario }) {
   const colors = useThemeColors();

   const [top3Mes, setTop3Mes] = useState([]);
   const [top3Anio, setTop3Anio] = useState([]);
   const [personalStats, setPersonalStats] = useState(null);
   const [monthlyStats, setMonthlyStats] = useState(null);
   const [yearlyStats, setYearlyStats] = useState(null);
   const [showNoTematicasMsg, setShowNoTematicasMsg] = useState(false);
   const [showNoValoracionesMsg, setShowNoValoracionesMsg] = useState(false);


   // Obtiene el Top 3 de usuarios que han leído más en el mes actual
   const fetchTop3Mes = async () => {
      try {
         const response = await fetch(`${API_URL}/estadisticas/top3`);
         if (response.ok) {
            const data = await response.json();
            setTop3Mes(data);
         } else {
            console.error("Error al obtener el top 3 del mes");
         }
      } catch (error) {
         console.error("Error al obtener el top 3 del mes", error);
      }
   };

   // Obtiene el Top 3 de usuarios que han leído más en el año actual
   const fetchTop3Anio = async () => {
      try {
         const response = await fetch(`${API_URL}/estadisticas/top3anuales`);
         if (response.ok) {
            const data = await response.json();
            setTop3Anio(data);
         } else {
            console.error("Error al obtener el top 3 del año");
         }
      } catch (error) {
         console.error("Error al obtener el top 3 del año", error);
      }
   };

   // Obtiene las estadísticas personales del usuario logueado
   const fetchPersonalStats = async () => {
      if (!correoUsuario) return;
      try {
         const response = await fetch(`${API_URL}/estadisticas/generales/${encodeURIComponent(correoUsuario)}`);
         if (response.ok) {
            const data = await response.json();
            setPersonalStats(data);

            // Verificar si "tematicas" viene vacío
            if (!data.tematicas || data.tematicas.length === 0) {
               setShowNoTematicasMsg(true);
            } else {
               setShowNoTematicasMsg(false);
            }
         } else {
            console.error("Error al obtener estadísticas personales");
         }
      } catch (error) {
         console.error("Error al obtener estadísticas personales", error);
      }
   };

   // Obtiene estadísticas mensuales detalladas (endpoint: /estadisticas/:correo)
   const fetchMonthlyStats = async () => {
      if (!correoUsuario) return;
      try {
         const response = await fetch(`${API_URL}/estadisticas/${encodeURIComponent(correoUsuario)}`);
         if (response.ok) {
            const data = await response.json();
            setMonthlyStats(data || {});
         } else {
            console.warn("No se encontraron estadísticas mensuales");
         }
      } catch (error) {
         console.error("Error al obtener estadísticas mensuales", error);
      }
   };

   // Obtiene estadísticas anuales detalladas (endpoint: /estadisticas/:correo/:year)
   const fetchYearlyStats = async () => {
      if (!correoUsuario) return;
      const currentYear = new Date().getFullYear();
      try {
         const response = await fetch(`${API_URL}/estadisticas/${encodeURIComponent(correoUsuario)}/${currentYear}`);
         if (response.ok) {
            const data = await response.json();
            setYearlyStats(data);

            // Verificar si "librosMasValorados" está vacío
            if (!data.librosMasValorados || data.librosMasValorados.length === 0) {
               setShowNoValoracionesMsg(true);
            } else {
               setShowNoValoracionesMsg(false);
            }
         } else {
            console.error("Error al obtener estadísticas anuales");
         }
      } catch (error) {
         console.error("Error al obtener estadísticas anuales", error);
      }
   };


   // Se ejecuta cada vez que se enfoca la pantalla
   useFocusEffect(
      useCallback(() => {
         fetchTop3Mes();
         fetchTop3Anio();
         if (correoUsuario) {
            fetchPersonalStats();
            fetchMonthlyStats();
            fetchYearlyStats();
         }
      }, [correoUsuario])
   );

   return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
         <Encabezado titulo="Estadísticas" correoUsuario={correoUsuario} />

         <ScrollView contentContainerStyle={styles.container}>
            {/* =============================
                    MIS ESTADÍSTICAS (PERSONALES)
                   ============================= */}
            <Text style={[styles.sectionMainTitle, { color: colors.text }]}>Mis Estadísticas</Text>

            {correoUsuario && (
               <View style={[styles.statsContainer, { backgroundColor: colors.backgroundSecondary }]}>

                  {/* ---- Fila de 3 círculos ---- */}
                  <View style={styles.statsRow}>
                     {/* Círculo 1: En progreso */}
                     <View style={[styles.statCircle, { backgroundColor: colors.background }]}>
                        <Text style={styles.statNumber}>
                           {yearlyStats?.libros_en_progreso ?? 0}
                        </Text>
                        <Text style={styles.statLabel}>En progreso</Text>
                     </View>

                     {/* Círculo 2: Leídos mes */}
                     <View style={[styles.statCircle, { backgroundColor: colors.background }]}>
                        <Text style={styles.statNumber}>
                           {monthlyStats?.totalLibrosLeidos ?? 0}
                        </Text>
                        <Text style={styles.statLabel}>Leídos mes</Text>
                     </View>

                     {/* Círculo 3: Leídos total */}
                     <View style={[styles.statCircle, { backgroundColor: colors.background }]}>
                        <Text style={styles.statNumber}>
                           {personalStats?.totalLibrosLeidos ?? 0}
                        </Text>
                        <Text style={styles.statLabel}>Leídos total</Text>
                     </View>
                  </View>

                  {/* ---- Mensajes según respuesta del API ---- */}
                  <View style={styles.messagesContainer}>
                     {showNoTematicasMsg && (
                        <View style={[styles.messageBox, { backgroundColor: colors.background }]}>
                           <Text style={[styles.messageText, { color: colors.text }]}>
                              ¡Ups! No hay suficiente información para mostrar las temáticas más leídas o recomendar otros libros.
                           </Text>
                        </View>
                     )}
                     {showNoValoracionesMsg && (
                        <View style={[styles.messageBox, { backgroundColor: colors.background }]}>
                           <Text style={[styles.messageText, { color: colors.text }]}>
                              ¡Hey! Todavía no has valorado ningún libro.
                           </Text>
                        </View>
                     )}
                  </View>

               </View>
            )}

            {/* ============================
                    ESTADÍSTICAS GENERALES
                   ============================ */}

            <Text style={[styles.sectionMainTitle, { color: colors.text }]}> Estadísticas Generales </Text>

            {/* Sección: Top 3 Usuarios del Mes */}
            {top3Mes && (
               <Podio
                  data={top3Mes}
                  titulo="Top 3 Usuarios del Mes"
               />
            )}

            {/* Sección: Top 3 Usuarios del Año */}
            {top3Anio && (
               <Podio
                  data={top3Anio}
                  titulo="Top 3 Usuarios del Año"
               />
            )}
         </ScrollView>
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
   },
   container: {
      padding: 16,
      paddingBottom: 30,
   },
   sectionMainTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
   },
   statsContainer: {
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
   },
   statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
   },
   statCircle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 80,
      borderRadius: 40,
      marginHorizontal: 5,
   },
   statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   statLabel: {
      fontSize: 12,
   },
   messagesContainer: {
      marginTop: 10,
   },
   messageBox: {
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
   },
   messageText: {
      fontSize: 14,
   },
});
