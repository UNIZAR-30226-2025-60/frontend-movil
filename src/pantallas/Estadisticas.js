// Estadisticas.js

import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../componentes/Tema';
import Encabezado from '../componentes/Encabezado';
import { API_URL } from '../../config';
import { useFocusEffect } from '@react-navigation/native';

export default function Estadisticas({ correoUsuario }) {
    const colors = useThemeColors();

    const [top3Mes, setTop3Mes] = useState([]);
    const [top3Anio, setTop3Anio] = useState([]);
    const [personalStats, setPersonalStats] = useState(null);

    // Obtiene el Top 3 de usuarios que han leído más en el mes actual
    const fetchTop3Mes = async () => {
        try {
            const response = await fetch(`${API_URL}/estadisticas/top3`);
            if (response.ok) {
                const data = await response.json();
                setTop3Mes(data);
            }
            else {
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
            }
            else {
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
            }
            else {
                console.error("Error al obtener estadísticas personales");
            }
        } catch (error) {
            console.error("Error al obtener estadísticas personales", error);
        }
    };

    // Se ejecuta cada vez que se enfoca la pantalla
    useFocusEffect(
        useCallback(() => {
            fetchTop3Mes();
            fetchTop3Anio();
            if (correoUsuario) {
                fetchPersonalStats();
            }
        }, [correoUsuario])
    );

    // -- Función para renderizar un item del Top 3 con estilo de “oro, plata, bronce”
    const renderRankingItem = (item, index) => {
        // Asigna color e icono según la posición
        const rank = index + 1;
        let colorFondo = colors.background;
        let colorBorde = colors.border;
        let iconColor = colors.icon;
        let tituloPosicion = `${rank}º Lugar`;

        // Distintos colores para 1, 2, 3
        switch (rank) {
            case 1:
                colorFondo = '#FFD700'; // Oro
                iconColor = '#B8860B';
                tituloPosicion = '1º Lugar';
                break;
            case 2:
                colorFondo = '#C0C0C0'; // Plata
                iconColor = '#808080';
                tituloPosicion = '2º Lugar';
                break;
            case 3:
                colorFondo = '#CD7F32'; // Bronce
                iconColor = '#8B4513';
                tituloPosicion = '3º Lugar';
                break;
            default:
                // Para el caso de que tengas más de 3 (poco habitual)
                break;
        }

        return (
            <View
                key={index}
                style={[
                    styles.rankingCard,
                    { borderColor: colorBorde, backgroundColor: colors.backgroundSecondary }
                ]}
            >
                {/* Pequeño contenedor que hace de “medalla” */}
                <View style={[styles.medalContainer, { backgroundColor: colorFondo }]}>
                    <Ionicons name="trophy-outline" size={24} color={iconColor} />
                    <Text style={styles.medalText}>{tituloPosicion}</Text>
                </View>
        
                {/* Datos del usuario */}
                <Text style={[styles.rankingText, { color: colors.text }]}>
                    {item.usuario_id} — Libros leídos: {item.libros_leidos}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            <Encabezado titulo="Estadísticas" correoUsuario={correoUsuario} />

            <ScrollView contentContainerStyle={styles.container}>

                {/* SECCIÓN: ESTADÍSTICAS GENERALES */}
                <View style={[styles.sectionContainer, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.sectionMainTitle, { color: colors.text }]}>Estadísticas Generales</Text>

                    {/* Sección: Top 3 usuarios del mes */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Top 3 Usuarios del Mes</Text>
                    {top3Mes.length > 0 ? (
                        top3Mes.map((item, index) => renderRankingItem(item, index))
                        // top3Mes.map((item, index) => (
                        //     <View
                        //     key={index}
                        //     style={[styles.itemContainer, { borderColor: colors.border, backgroundColor: colors.background }]}
                        //     >
                        //     <Text style={[styles.itemText, { color: colors.text }]}>
                        //         {item.usuario_id} – Libros leídos: {item.libros_leidos}
                        //     </Text>
                        //     </View>
                        // ))
                    ) : (
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            No hay datos para el mes actual.
                        </Text>
                    )}

                    {/* Sección: Top 3 usuarios del año */}
                    <Text style={[styles.sectionSubtitle, { color: colors.text, marginTop: 20 }]}>Top 3 Usuarios del Año</Text>
                    {top3Anio.length > 0 ? (
                        top3Anio.map((item, index) => (
                            <View
                                key={index}
                                style={[styles.itemContainer, { borderColor: colors.border, backgroundColor: colors.background }]}
                            >
                                <Text style={[styles.itemText, { color: colors.text }]}>
                                    {item.usuario_id} – Libros leídos: {item.libros_leidos}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            No hay datos para el año actual.
                        </Text>
                    )}
                </View>

                {/* SECCIÓN: ESTADÍSTICAS PERSONALES (si está logueado) */}
                {correoUsuario && personalStats && (
                    <View style={[styles.sectionContainer, { backgroundColor: colors.backgroundSecondary }]}>
                        <Text style={[styles.sectionMainTitle, { color: colors.text }]}>Mis Estadísticas</Text>

                        <View
                            style={[
                                styles.itemContainer,
                                { borderColor: colors.border, backgroundColor: colors.background }
                            ]}
                        >
                            <Text style={[styles.itemText, { color: colors.text }]}>
                                Total libros leídos: {personalStats.totalLibrosLeidos}
                            </Text>
                            <Text style={[styles.itemText, { color: colors.text }]}>
                                Temáticas:{" "}
                                {personalStats.tematicas && Array.isArray(personalStats.tematicas)
                                ? personalStats.tematicas.join(", ")
                                : "N/A"}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    /******** SECCIONES ********/
    sectionContainer: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    sectionMainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
  
    /******** ELEMENTOS ********/
    itemContainer: {
        marginTop: 6,
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },
    itemText: {
        fontSize: 14,
    },
    infoText: {
        marginTop: 6,
        fontSize: 14,
    },
});
