// EnProceso.js

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from "../componentes/Tema";
import { API_URL } from "../../config";

export default function EnProceso({ correoUsuario }) {
    const [librosEnProceso, setLibrosEnProceso] = useState([]);
    const navigation = useNavigation();
    const colors = useThemeColors();

    const obtenerDetallesLibro = async (enlaceLibro) => {
        try {
        const enlaceCodificado = encodeURIComponent(enlaceLibro);
        const respuesta = await fetch(`${API_URL}/libros/libro/${enlaceCodificado}`);
        if (respuesta.ok) {
            const datos = await respuesta.json();
            return datos;
        }
        return null;
        } catch (error) {
        console.error("Error al obtener detalles del libro:", error);
        return null;
        }
    };

    // Función para obtener los libros de la lista "En proceso"
    const obtenerEnProceso = async () => {
        try {
            const respuestaEnProceso = await fetch(`${API_URL}/libros/enproceso/${correoUsuario}`);
            if (!respuestaEnProceso.ok) {
                console.error("Error al obtener los libros en proceso del usuario");
                setLibrosEnProceso([]);
                return;
            }

            const data = await respuestaEnProceso.json();

            const libros = await Promise.all(
                data.map(async (libro) => {
                    const detalles = await obtenerDetallesLibro(libro.enlace_libro);
                    return detalles ? { ...libro, ...detalles } : libro;
                })
            );
    
            setLibrosEnProceso(libros);
            
            // const respuestaListas = await fetch(`${API_URL}/listas/${encodeURIComponent(correoUsuario)}`);
    
            // if (!respuestaListas.ok) {
            //     console.error(`Error al obtener las listas del usuario. Código: ${respuestaListas.status}`);
            //     setLibrosEnProceso([]);
            //     return;
            // }
    
            // console.log("La respuesta es correcta");
            // const listas = await respuestaListas.json();
    
            // if (!Array.isArray(listas) || listas.length === 0) {
            //     console.warn("No hay listas disponibles para este usuario.");
            //     setLibrosEnProceso([]);
            //     return;
            // }
    
            // const listaEnProceso = listas.find(
            //     (lista) =>
            //         lista.nombre.toLowerCase() === "en proceso" ||
            //         lista.nombre.toLowerCase() === "enproceso"
            // );
    
            // if (!listaEnProceso) {
            //     console.warn("No se encontró la lista 'En proceso'.");
            //     setLibrosEnProceso([]);
            //     return;
            // }
    
            // console.log("Lista 'En proceso' encontrada:", listaEnProceso);
    
            // const respuestaLibros = await fetch(
            //     `${API_URL}/listas/${encodeURIComponent(correoUsuario)}/${encodeURIComponent(listaEnProceso.nombre)}/libros`
            // );
    
            // if (!respuestaLibros.ok) {
            //     console.error(`Error al obtener los libros de la lista 'En proceso'. Código: ${respuestaLibros.status}`);
            //     setLibrosEnProceso([]);
            //     return;
            // }
    
            // console.log("Libros de la lista 'En proceso' obtenidos correctamente");
            // const librosData = await respuestaLibros.json();
    
            // if (!Array.isArray(librosData) || librosData.length === 0) {
            //     console.log("No hay libros en la lista 'En proceso'.");
            //     setLibrosEnProceso([]);
            //     return;
            // }
    
            // const librosConDetalles = await Promise.all(
            //     librosData.map(async (libro) => {
            //         const detalles = await obtenerDetallesLibro(libro.enlace_libro);
            //         return detalles ? { ...libro, ...detalles } : libro;
            //     })
            // );
    
            // setLibrosEnProceso(librosConDetalles);
        } catch (error) {
            console.error("Error al obtener los libros en proceso:", error);
            setLibrosEnProceso([]);
        }
    };

    useFocusEffect(
        useCallback(() => {
        obtenerEnProceso();
        }, [correoUsuario])
    );

    useEffect(() => {
        obtenerEnProceso();
    }, []);

    const verDetallesLibro = (libro) => {
        navigation.navigate("Detalles", { libro });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Encabezado titulo="En Proceso" correoUsuario={correoUsuario} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.grid}>
            {librosEnProceso.length > 0 ? (
                librosEnProceso.map((libro, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.libroContainer}
                    onPress={() => verDetallesLibro(libro)}
                >
                    <Image 
                    source={{ uri: libro.imagen_portada }}
                    style={styles.imagenLibro}
                    />
                    <Text style={[styles.nombreLibro, { color: colors.text }]}>
                    {libro.nombre || 'Título no disponible'}
                    </Text>
                </TouchableOpacity>
                ))
            ) : (
                <Text style={[styles.textoVacio, { color: colors.text }]}>
                No se encontraron libros en proceso
                </Text>
            )}
            </View>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: { flexGrow: 1, padding: 16 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    libroContainer: { width: '47%', marginBottom: 20, alignItems: 'center' },
    imagenLibro: { width: 100, height: 150, marginBottom: 5 },
    nombreLibro: { marginTop: 8, textAlign: 'center', fontSize: 14 },
    textoVacio: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});
