/**
 * Archivo: CrearLista.js
 * Descripción: Pantalla para que el usuario cree una nueva lista.
 * Contenido:
 *  - Formulario con nombre y descripción de la lista
 *  - Botón para guardar la nueva lista
 *  - Conexión con la API para crear la lista en el backend
 */

import React, { useState } from 'react';
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../componentes/Tema';

export default function CrearLista() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [privacidad, setPrivacidad] = useState('Privada');
    const [portadaSeleccionada, setPortadaSeleccionada] = useState(null);
    const navigation = useNavigation();
    const colors = useThemeColors();
    const usuarioCorreo = 'amador@gmail.com';

    // 📌 Lista de imágenes desde Google Drive
    const imagenesPortada = [
        { id: 'autoayuda', url: 'https://drive.google.com/uc?export=view&id=1qESYBakLBurBbfsjn9r1iKkf7dk8PMMw' },
        { id: 'aventura', url: 'https://drive.google.com/uc?export=view&id=1WZv-JmvC0aMoeqQ4_Fnucb58rDImYV8o' },
        { id: 'biografia', url: 'https://drive.google.com/uc?export=view&id=10tHuwP668O05fehhWu2t92DX4A0AGwI3' }
    ];

    /**
     * 📌 Función para enviar la solicitud al backend y crear la lista.
     */
    const crearLista = async () => {
    if (!nombre.trim()) {
        Alert.alert('Error', 'El nombre de la lista es obligatorio.');
        return;
    }

    // BORRAAAAAAAAAAAAAAAAAAAAAAAAAAAAR
    const datosLista = {
        nombre,
        usuario_id: usuarioCorreo,
        descripcion: descripcion || "",
        publica: privacidad === 'Pública',
        portada: portadaSeleccionada || null
    };
    console.log("📤 Enviando datos al backend:", datosLista);
    // BORRAAAAAAAAAAAAAAAAAAAAAAAAAAAAR

    try {
        const respuesta = await fetch('http://10.0.2.2:3000/api/listas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                usuario_id: usuarioCorreo,
                descripcion: descripcion || "",
                publica: privacidad === 'Pública',
                portada: portadaSeleccionada || null
            }),
        });

        const respuestaTexto = await respuesta.text(); // Para debug
        console.log("Respuesta del servidor:", respuestaTexto);

        if (respuesta.ok) {
            Alert.alert('Éxito', 'Lista creada correctamente.');
            navigation.goBack(); // Volver a MisListas
        } else {
            Alert.alert('Error', `No se pudo crear la lista. Respuesta: ${respuestaTexto}`);
        }
    } catch (error) {
        console.error('Error al crear la lista:', error);
        Alert.alert('Error', 'Hubo un problema con la creación de la lista.');
    }
    };

    /**
     * 📌 Renderización del formulario para crear una lista
     */
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <Text style={[styles.titulo, { color: colors.text }]}>Crear Lista:</Text>

            {/* Campo de nombre */}
            <Text style={[styles.label, { color: colors.text }]}>Ingrese el nombre de su lista:</Text>
            <TextInput
                style={[styles.input, { borderColor: colors.text }]}
                placeholder="Ejemplo: Novelas Policiacas"
                placeholderTextColor={colors.placeholder}
                value={nombre}
                onChangeText={setNombre}
            />

            {/* Selección de imagen de portada */}
            <Text style={[styles.label, { color: colors.text }]}>Elige una imagen para la portada:</Text>
            <View style={styles.imagenesContainer}>
                {imagenesPortada.map((imagen) => (
                    <TouchableOpacity
                        key={imagen.id}
                        onPress={() => {
                            // Si la imagen ya está seleccionada, deseleccionar
                            if (portadaSeleccionada === imagen.url) {
                                setPortadaSeleccionada(null);
                            } else {
                                setPortadaSeleccionada(imagen.url);
                            }
                        }}
                    >
                        <Image 
                            source={{ uri: imagen.url }}  
                            style={[
                                styles.imagenPortada, 
                                portadaSeleccionada === imagen.url ? styles.imagenSeleccionada : {}
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Campo de descripción */}
            <Text style={[styles.label, { color: colors.text }]}>Descripción:</Text>
            <TextInput
                style={[styles.textarea, { borderColor: colors.text }]}
                placeholder="Añade una descripción (opcional)"
                placeholderTextColor={colors.placeholder}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
            />

            {/* Selector de privacidad con radio buttons */}
            <Text style={[styles.label, { color: colors.text }]}>Privacidad:</Text>
            <View style={styles.radioContainer}>
            {["Privada", "Pública"].map((opcion) => (
                <TouchableOpacity
                    key={opcion}
                    style={styles.radioButton}
                    onPress={() => setPrivacidad(opcion)}
                >
                <View style={[styles.radioOuter, { borderColor: colors.text }]}>
                    {privacidad === opcion && <View style={[styles.radioInner, { backgroundColor: colors.text }]} />}
                </View>
                <Text style={[styles.radioLabel, { color: colors.text }]}>{opcion}</Text>
                </TouchableOpacity>
            ))}
            </View>

            {/* Botón para crear la lista */}
            <TouchableOpacity
                style={[styles.boton, { backgroundColor: colors.button }]}
                onPress={crearLista}
            >
            <Text style={[styles.textoBoton, { color: colors.buttonText }]}>Crear Lista</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, marginBottom: 5 },
    input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 15 },
    textarea: { borderWidth: 1, padding: 10, borderRadius: 5, height: 80, marginBottom: 15 },

    // 📌 Estilos para las imágenes de portada
    imagenesContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
    imagenPortada: { width: 80, height: 80, marginHorizontal: 5, borderRadius: 5 },
    imagenSeleccionada: {
        borderWidth: 3,
        borderColor: 'blue',
        opacity: 0.7, // Resalta la imagen seleccionada
    },

    // 📌 Estilos para el selector de privacidad
    radioContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
    radioButton: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    radioLabel: { fontSize: 16 },

    // 📌 Botón de "Crear Lista"
    boton: { padding: 15, borderRadius: 5, alignItems: 'center' },
    textoBoton: { fontSize: 16, fontWeight: 'bold' },
});