/**
 * Archivo: CrearLista.js
 * Descripción: Pantalla para que el usuario cree una nueva lista.
 * Contenido:
 *  - Formulario con nombre y descripción de la lista
 *  - Botón para guardar la nueva lista
 *  - Conexión con la API para crear la lista en el backend
 */

import React, { useState, useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import { useThemeColors } from '../componentes/Tema';
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../config";

export default function CrearLista({ correoUsuario, navigation }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [privacidad, setPrivacidad] = useState('Privada');
    const [portadaSeleccionada, setPortadaSeleccionada] = useState(null);
    const [imagenesPortada, setImagenesPortada] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const colors = useThemeColors();

    function filtrarDuplicados(array) {
        const seen = new Set();
        return array.filter(item => {
            if (seen.has(item.foto)) {
                return false;
            }
            seen.add(item.foto);
            return true;
        });
    }

    // Convierte links de Drive “/view?usp=sharing” a “uc?id=...”
    function convertirDriveLink(url) {
        if (url.includes("uc?id=")) return url;
        const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
        if (match) {
        const fileId = match[1];
        return `https://drive.google.com/uc?id=${fileId}`;
        }
        return url;
    }

    /**
     * 📌 Al montar el componente, pedimos la lista de portadas al backend: GET /listas/portadas-temas
     */
    useEffect(() => {
    const cargarPortadas = async () => {
      try {
        const resp = await fetch(`${API_URL}/listas/portadas-temas`);
        const data = await resp.json();

        // Convertir y (opcional) filtrar duplicados
        const fotosConvertidas = data.map(item => ({
          foto: convertirDriveLink(item.foto)
        }));
        const sinDuplicados = filtrarDuplicados(fotosConvertidas); // Quita duplicados si los hay
        setImagenesPortada(sinDuplicados);

        if (sinDuplicados.length > 0) {
          setPortadaSeleccionada(sinDuplicados[0].foto);
        }
      } catch (error) {
        console.error("Error al obtener portadas:", error);
      }
    };
    cargarPortadas();
  }, []);

    /**
     * 📌 Función para enviar la solicitud al backend y crear la lista.
     */
    const crearLista = async () => {
    if (!nombre.trim()) {
        Alert.alert('Error', 'El nombre de la lista es obligatorio.');
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/listas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                usuario_id: correoUsuario,
                descripcion: descripcion || "",
                publica: privacidad === 'Pública',
                portada: portadaSeleccionada || null
            }),
        });

        if (respuesta.ok) {
            Alert.alert('✅ Éxito', 'Lista creada correctamente.');
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
     * 📌 Renderiza el modal con las imágenes que NO están en las primeras 3 (y tampoco la seleccionada si está entre esas 3).
     */
    function renderModalTodasImagenes() {
        const resto = imagenesPortada.slice(3);
        return (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={[styles.modalOverlay, { backgroundColor: colors.backgroundFormulario }]}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitulo}>Selecciona una imagen</Text>
    
                <FlatList
                  data={resto}
                  keyExtractor={(_, idx) => idx.toString()}
                  numColumns={3}
                  style={{ maxHeight: '80%', marginTop: 10, marginBottom: 15 }}
                  showsVerticalScrollIndicator
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (portadaSeleccionada === item.foto) {
                          setPortadaSeleccionada(null);
                        } else {
                          setPortadaSeleccionada(item.foto);
                        }
                        // No cerramos el modal
                      }}
                    >
                      <Image
                        source={{ uri: item.foto }}
                        style={[
                          styles.imagenPortadaModal,
                          portadaSeleccionada === item.foto ? styles.imagenSeleccionada : {}
                        ]}
                      />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.listaModal}
                />
    
                <TouchableOpacity
                  style={[styles.boton, { backgroundColor: colors.buttonDark }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        );
      }

    const handleEditarFotoPerfil = () => {
      setModalVisible(true);
    };
      


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

          <View style={[styles.card, { backgroundColor: colors.backgroundSecondary, alignItems: 'center' }]}>
            <Text style={{ fontSize: 15, marginBottom: 10, textAlign: 'justify' }}>¿Quieres compartir tus recomendaciones o prefieres mantener tu lista sólo para ti? ¡Tú decides! Crea listas públicas para inspirar a otros, o privadas para disfrutar en solitario</Text>
            
            <Image
              source={{ uri: portadaSeleccionada }}
              style={[styles.imagenPortadaLista]}
            />
            
            <TouchableOpacity
              style={[styles.botonEditar, { backgroundColor: colors.buttonDark, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }]}
              onPress={handleEditarFotoPerfil}
            >
              <Ionicons name="pencil" size={17} color={colors.buttonTextDark} style={{ marginRight: 7 }}/>
              <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Editar foto de perfil</Text>
            </TouchableOpacity>
            {renderModalTodasImagenes()}
          </View>

            {/* Campo de nombre */}
            <Text style={[styles.label, { color: colors.text }]}>Nombre de la lista:</Text>
            <TextInput
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundFormulario}]}
                placeholder="Ejemplo: Novelas Policiacas"
                placeholderTextColor={colors.textSecondary}
                value={nombre}
                onChangeText={setNombre}
            />

            {/* Campo de descripción */}
            <Text style={[styles.label, { color: colors.text }]}>Descripción:</Text>
            <TextInput
                style={[styles.textarea, { borderColor: colors.text, backgroundColor: colors.backgroundFormulario, color: colors.text }]}
                placeholder="Añade una descripción (opcional)"
                placeholderTextColor={colors.textSecondary}
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
                style={[styles.boton, { backgroundColor: colors.buttonDark }]}
                onPress={crearLista}
            >
              <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    );
}

// ---- ESTILOS ----
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        justifyContent: 'center' 
    },
    titulo: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    label: { 
        fontSize: 16, 
        marginBottom: 5 
    },
    input: { 
        borderWidth: 1, 
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 15 
    },
    textarea: { 
        borderWidth: 1, 
        padding: 10, 
        borderRadius: 5, 
        height: 80, 
        marginBottom: 15 
    },

    // 📌 Estilos para las imágenes de portada
    imagenesContainer: {
      flexDirection: 'row',
      alignItems: 'center',     // Asegura que estén verticalmente centrados
      marginBottom: 20,
    },
    imagenPortadaLista: {
      width: 100,
      height: 100,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    imagenPortada: {
      width: 80,
      height: 80,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    imagenSeleccionada: {
        borderWidth: 3,
        opacity: 4.5, // Resalta la imagen seleccionada
    },
    verMasContainer: {
        width: 80,
        height: 80,
        marginRight: 5,
        borderRadius: 5,
        borderStyle: 'dashed',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verMasTexto: {
        fontSize: 18, // un + grande
        fontWeight: 'bold',
    },

    // Modal overlay (fondo semitransparente)
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Contenido principal del modal
    modalContent: {
        borderRadius: 8,
        padding: 16,
        width: '80%',
        maxHeight: '80%',
        alignItems: 'center',
    },
    modalTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center', // Centra el texto horizontalmente
    },

    // Estilo de la lista dentro del modal
    imagenPortadaModal: {
        width: 80,
        height: 80,
        margin: 5,
        borderRadius: 5,
    },
    listaModal: {
        justifyContent: 'center',
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
    botonEditar: { 
      paddingVertical: 6, 
      paddingHorizontal: 20,
      marginTop: 7,
      borderRadius: 22, 
      alignSelf: 'flex-start'
    },
    boton: { 
      padding: 15, 
      borderRadius: 22, 
      alignItems: 'center' 
    },
    textoBoton: { 
      fontSize: 16, 
      fontWeight: 'bold' 
    },
    card: {
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2 // Sombra en Android
    },
});