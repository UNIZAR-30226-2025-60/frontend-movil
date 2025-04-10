import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../componentes/Tema';
import Encabezado from '../componentes/Encabezado';
import Podio from '../componentes/Podio';
import { API_URL } from '../../config';
import { Picker } from '@react-native-picker/picker';

export default function Estadisticas({ correoUsuario }) {
   const colors = useThemeColors();
   const navigation = useNavigation();

   const [top3Mes, setTop3Mes] = useState([]);
   const [top3Anio, setTop3Anio] = useState([]);
   const [globalStats, setGlobalStats] = useState(null);
   const [monthlyStats, setMonthlyStats] = useState(null);
   const [yearlyStats, setYearlyStats] = useState(null);
   const [showNoValoracionesMsg, setShowNoValoracionesMsg] = useState(false);
   const [popularBooks, setPopularBooks] = useState([]);
   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // mes actual
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());   // año actual
   const [librosRecomendados, setLibrosRecomendados] = useState([]);

   // Listas de opciones para el Picker
   const MONTHS = [
      { label: 'Enero', value: 1 },
      { label: 'Febrero', value: 2 },
      { label: 'Marzo', value: 3 },
      { label: 'Abril', value: 4 },
      { label: 'Mayo', value: 5 },
      { label: 'Junio', value: 6 },
      { label: 'Julio', value: 7 },
      { label: 'Agosto', value: 8 },
      { label: 'Septiembre', value: 9 },
      { label: 'Octubre', value: 10 },
      { label: 'Noviembre', value: 11 },
      { label: 'Diciembre', value: 12 },
   ];

   // Puedes ajustar el rango de años a tu gusto
   const YEARS = [2023, 2024, 2025, 2026];

   const fetchDatosCompletosParaUsuarios = async (usuariosTop3) => {
      // Usa Promise.all para esperar todas las llamadas
      const usuariosCompletos = await Promise.all(
         usuariosTop3.map(async (usuario) => {
            // Usamos 'usuario.usuario_id' o 'usuario.correo' según corresponda
            const response = await fetch(`${API_URL}/usuario/${encodeURIComponent(usuario.usuario_id)}`);
            if (response.ok) {
               const dataCompleta = await response.json();
               // Fusionamos la información del top3 (ej. libros leídos) con la información completa
               return { ...usuario, ...dataCompleta };
            }
            return usuario;
         })
      );
      return usuariosCompletos;
   };

   // Obtiene el Top 3 de usuarios que han leído más en el mes actual
   const fetchTop3Mes = async () => {
      try {
         const response = await fetch(`${API_URL}/estadisticas/top3`);
         if (response.ok) {
            const data = await response.json();
            // Enriquecer cada usuario del top 3 con la información completa
            const dataEnriquecida = await fetchDatosCompletosParaUsuarios(data);
            setTop3Mes(dataEnriquecida);
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
            // Enriquecer cada usuario del top 3 con la información completa
            const dataEnriquecida = await fetchDatosCompletosParaUsuarios(data);
            setTop3Anio(dataEnriquecida);
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
            setGlobalStats(data);
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
            console.log("No se encontraron estadísticas mensuales");
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

   // Obtiene los 5 libros más leídos del mes y año actuales (libros populares)
   const fetchPopularBooks = async (month, year) => {
      try {
         const response = await fetch(`${API_URL}/estadisticas/top5libros/${month}/${year}`);
         if (response.ok) {
            const data = await response.json();
            setPopularBooks(data);
         } else {
            console.error("Error al obtener los libros populares");
         }
      } catch (error) {
         console.error("Error al obtener los libros populares", error);
      }
   };

   const fetchLibrosRecomendados = async () => {
      try {
         const response = await fetch(`${API_URL}/estadisticas/librosrecomendados/${encodeURIComponent(correoUsuario)}`);
         if (response.ok) {
            const data = await response.json();
            setLibrosRecomendados(data);
         } else {
            console.error("Error al obtener libros recomendados");
         }
      } catch (error) {
         console.error("Error al obtener libros recomendados", error);
      }
   };


   // Se ejecuta cada vez que se enfoca la pantalla
   useFocusEffect(
      useCallback(() => {
         fetchTop3Mes();
         fetchTop3Anio();
         fetchPopularBooks(selectedMonth, selectedYear);
         if (correoUsuario) {
            fetchPersonalStats();
            fetchMonthlyStats();
            fetchYearlyStats();
            fetchLibrosRecomendados();
         }
      }, [correoUsuario, selectedMonth, selectedYear])
   );

   return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
         <Encabezado titulo="Estadísticas" correoUsuario={correoUsuario} />

         <ScrollView contentContainerStyle={styles.container}>
            {/* =============================
                    MIS ESTADÍSTICAS (PERSONALES)
                   ============================= */}
            {correoUsuario && (
               <>
                  <Text style={[styles.sectionMainTitle, { color: colors.text }]}>Mis Estadísticas</Text>
               
                  {/* BLOQUE 1: Estadísticas personales (3 círculos) */}
                  <View style={[styles.statsContainer, { backgroundColor: colors.backgroundSecondary }]}>
                     <View style={styles.statsRow}>
                        {/* Círculo 1: En proceso */}
                        <View style={[styles.statCircle, { backgroundColor: colors.backgroundCirculoEstadisticas }]}>
                           <Text style={styles.statNumber}>
                              {yearlyStats?.libros_en_progreso ?? 0}
                           </Text>
                           <Text style={styles.statLabel}>En proceso</Text>
                        </View>

                        {/* Círculo 2: Leídos mes */}
                        <View style={[styles.statCircle, { backgroundColor: colors.backgroundCirculoEstadisticas }]}>
                           <Text style={styles.statNumber}>
                              {monthlyStats?.totalLibrosLeidos ?? 0}
                           </Text>
                           <Text style={styles.statLabel}>Leídos mes</Text>
                        </View>

                        {/* Círculo 3: Leídos total */}
                        <View style={[styles.statCircle, { backgroundColor: colors.backgroundCirculoEstadisticas }]}>
                           <Text style={styles.statNumber}>
                              {globalStats?.totalLibrosLeidos ?? 0}
                           </Text>
                           <Text style={styles.statLabel}>Leídos total</Text>
                        </View>
                     </View>
                  </View>

                  {/* BLOQUE 2: Mensaje de temáticas */}
                  {yearlyStats?.tematicasMasLeidas?.length > 0 ? (
                     <View style={[styles.blockContainer, { backgroundColor: colors.backgroundSecondary }]}>
                        <Text style={[styles.sectionMainTitle, { color: colors.textDark }]}>Temáticas más leídas:</Text>
                        {yearlyStats.tematicasMasLeidas.map((tema, index) => (
                           <Text key={index} style={{ color: colors.textDark }}>{tema}</Text>
                        ))}
                     </View>
                  ) : (
                     <View style={[styles.blockContainer, { backgroundColor: colors.backgroundSecondary }]}>
                        <Text style={[styles.messageText, { color: colors.text }]}>
                           ¡Ups! No hay suficiente información para mostrar las temáticas más leídas o recomendar otros libros.
                        </Text>
                     </View>
                  )}


                  {/* LIBROS RECOMENDADOS */}
                  {librosRecomendados?.length > 0 && (
                     <View style={styles.sectionSpacing}>
                        <Text style={[styles.sectionMainTitle, { color: colors.text }]}>Libros recomendados:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                           {librosRecomendados.map((libro, index) => (
                              <TouchableOpacity
                                 key={index}
                                 style={styles.popularItem}
                                 onPress={() => navigation.push("Detalles", { libro, correoUsuario })}
                              >
                                 <View style={[styles.bookCoverPlaceholder, { backgroundColor: colors.background }]}>
                                    <Image source={{ uri: libro.imagen_portada }} style={styles.bookCoverImage} />
                                 </View>
                                 <Text style={[styles.bookTitle, { color: colors.text }]}>{libro.nombre}</Text>
                                 <Text style={[styles.bookAuthor, { color: colors.text }]}>{libro.autor}</Text>
                              </TouchableOpacity>
                           ))}
                        </ScrollView>
                     </View>
                  )}

                  {/* BLOQUE 3: Mensaje de valoraciones */}
                  <View style={styles.sectionSpacing}>
                     <Text style={[styles.sectionMainTitle, { color: colors.text }]}>
                        Libros que más te han gustado:
                     </Text>

                     {globalStats?.librosMasValorados?.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                           {globalStats.librosMasValorados.map((libro, index) => (
                              <TouchableOpacity
                                 key={index}
                                 style={styles.popularItem}
                                 onPress={() => navigation.push("Detalles", { libro, correoUsuario })}
                              >
                                 <View style={[styles.bookCoverPlaceholder, { backgroundColor: colors.background }]}>
                                    <Image source={{ uri: libro.imagen_portada }} style={styles.bookCoverImage} />
                                 </View>
                                 <Text style={[styles.bookTitle, { color: colors.text }]}>{libro.nombre}</Text>
                                 <Text style={[styles.bookAuthor, { color: colors.text }]}>{libro.autor}</Text>
                              </TouchableOpacity>
                           ))}
                        </ScrollView>
                     ) : (
                        <View style={[styles.blockContainer, { backgroundColor: colors.backgroundSecondary }]}>
                           <Text style={[styles.messageText, { color: colors.text }]}>
                              ¡Hey! Todavía no has valorado ningún libro.
                           </Text>
                        </View>
                     )}
                  </View>

                  <View style={[styles.linea, { backgroundColor: colors.line, height: 2.5 }]} />
               </>
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

            {/* Sección: Libros Más Populares */}
            <View>
               {/* Controles para seleccionar mes y año */}
               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ color: colors.text, marginRight: 5 }}>Libros más populares de</Text>
                  <Picker
                     selectedValue={selectedMonth}
                     style={[styles.pickerStyle, { color: colors.text }]}
                     onValueChange={(value) => setSelectedMonth(value)}
                  >
                     {MONTHS.map((m) => (
                        <Picker.Item key={m.value} label={m.label} value={m.value} />
                     ))}
                  </Picker>
                  <Text style={{ color: colors.text, marginHorizontal: 5 }}>de</Text>
                  <Picker
                     selectedValue={selectedYear}
                     style={[styles.pickerStyle, { color: colors.text }]}
                     onValueChange={(value) => setSelectedYear(value)}
                  >
                     {YEARS.map((y) => (
                        <Picker.Item key={y} label={String(y)} value={y} />
                     ))}
                  </Picker>
               </View>

               {popularBooks && popularBooks.length > 0 ? (
                  /* ESTO ES PARA SCROLL HORIZONTAAAAAAAAAAAAAAAAAAAAAAAAAAAL */
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                     {popularBooks.map((libro, index) => (
                        <TouchableOpacity
                           key={index}
                           style={styles.popularItem}
                           // A LO MEJOR CAMBIO LA MANERA DE LLEGAR A LOS DETALLES DE UN LIBROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                           onPress={() => navigation.push("Detalles", { libro, correoUsuario })}
                        >
                           <View style={[styles.bookCoverPlaceholder, { backgroundColor: colors.background }]}>
                              <Image source={{ uri: libro.imagen_portada }} style={styles.bookCoverImage} />
                           </View>
                           <Text style={[styles.bookTitle, { color: colors.text }]}>{libro.nombre}</Text>
                           <Text style={[styles.bookAuthor, { color: colors.text }]}>{libro.autor}</Text>
                        </TouchableOpacity>
                     ))}
                  </ScrollView>

                  /* ESTO ES SI NO QUEREMOS SCROLL HORIZONTAAAAAAAAAAAAAAAAAAAAAAAAAAAL */
                  // <ScrollView>
                  // <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                  //    {popularBooks.map((libro, index) => (
                  //       <View key={index} style={styles.popularItem}>
                  //          <View style={[styles.bookCoverPlaceholder, { backgroundColor: colors.background }]}>
                  //             <Image source={{ uri: libro.imagen_portada }} style={styles.bookCoverImage} />
                  //          </View>
                  //          <Text style={[styles.bookTitle, { color: colors.text }]}>{libro.nombre}</Text>
                  //          <Text style={[styles.bookAuthor, { color: colors.text }]}>{libro.autor}</Text>
                  //       </View>
                  //    ))}
                  // </View>
                  // </ScrollView>
               ) : (
                  <Text style={[styles.messageText, { color: colors.text }]}>
                     No hay libros populares disponibles.
                  </Text>
               )}
            </View>
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
   blockContainer: {
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
   },
   sectionSpacing: {
      marginBottom: 20,
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
      width: 90,
      height: 90,
      borderRadius: 60,
      borderWidth: 1,
      marginHorizontal: 5,
   },
   statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
   },
   statLabel: {
      fontSize: 12,
   },
   messageText: {
      fontSize: 14,
   },
   pickerStyle: {
      width: 100,
   },
   popularItem: {
      width: 120,
      marginRight: 16,
      alignItems: 'center',
   },
   bookCoverPlaceholder: {
      width: 100,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      marginBottom: 8,
   },
   bookCoverImage: {
      width: 100,
      height: 150,
      borderRadius: 4,
   },
   bookTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
   },
   bookAuthor: {
      fontSize: 12,
      textAlign: 'center',
   },
   linea: {
      width: '100%',
      marginVertical: 5,
    },
});
