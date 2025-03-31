/**
 * Archivo: EditarLista.js
 * Descripción: Pantalla para editar una lista existente.
 * Contenido:
 *  - Formulario con nombre, descripción, portada y privacidad de la lista
 *  - Botón para guardar los cambios (PATCH a la API)
 *  - Conexión con la API para actualizar la lista en el backend
 */

import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { useThemeColors } from '../componentes/Tema';
import { API_URL } from "../../config";

export default function EditarLista({ route, navigation }) {
  const { lista, correoUsuario } = route.params;
  const colors = useThemeColors();

  // Cargamos en el formulario los datos existentes de la lista
  const [nombre, setNombre] = useState(lista.nombre || '');
  const [descripcion, setDescripcion] = useState(lista.descripcion || '');
  const [privacidad, setPrivacidad] = useState(lista.publica ? 'Pública' : 'Privada');
  const [portadaSeleccionada, setPortadaSeleccionada] = useState(lista.portada || null);
  const [imagenesPortada, setImagenesPortada] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

    // Función para filtrar duplicados (por si el backend envía repeticiones)
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

  // Convierte links de Drive del tipo "/file/d/FILE_ID/view?usp=sharing" a "https://drive.google.com/uc?id=FILE_ID"
  function convertirDriveLink(url) {
    if (url.includes("uc?id=")) return url;
    const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/uc?id=${fileId}`;
    }
    return url;
  }

  // Al montar, se carga la lista de portadas desde el backend
  useEffect(() => {
    const cargarPortadas = async () => {
      try {
        const resp = await fetch(`${API_URL}/listas/portadas-temas`);
        const data = await resp.json();
        // Convertir cada enlace y filtrar duplicados
        const fotosConvertidas = data.map(item => ({
          foto: convertirDriveLink(item.foto)
        }));
        setImagenesPortada(filtrarDuplicados(fotosConvertidas));
      } catch (error) {
        console.error("Error al obtener portadas:", error);
      }
    };
    cargarPortadas();
  }, []);

  /**
   * Función para editar la lista en el backend (PATCH).
   * La ruta esperada es:
   *   PATCH /api/listas/:usuario_id/:nombreOriginal
   * Y el body puede incluir: { nuevoNombre, descripcion, publica, portada }
   */
  const editarLista = async () => {
    // Validar que al menos haya un nombre
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre de la lista es obligatorio.');
      return;
    }

    try {
      const nombreOriginal = lista.nombre; // Nombre anterior de la lista
      const url = `${API_URL}/listas/${encodeURIComponent(correoUsuario)}/${encodeURIComponent(nombreOriginal)}`;

      const respuesta = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Solo enviamos los campos que se modifican.
          // El backend actualiza cada uno si está presente.
          nuevoNombre: nombre, // Nuevo nombre de la lista
          descripcion,
          publica: (privacidad === 'Pública'),
          portada: portadaSeleccionada,
        }),
      });

      if (respuesta.ok) {
        Alert.alert('Éxito', 'Lista actualizada correctamente.');
        navigation.goBack(); // O navigation.navigate("MisListasScreen"), etc.
      } else {
        // Si no fue ok, mostramos el texto devuelto por el backend
        const textoResp = await respuesta.text();
        Alert.alert('Error', `No se pudo editar la lista. Servidor: ${textoResp}`);
      }
    } catch (error) {
      console.error('Error al editar la lista:', error);
      Alert.alert('Error', 'Hubo un problema con la edición de la lista.');
    }
  };

  // Para la vista principal: mostramos las primeras 3 imágenes (sin reordenar)
  const imagenesPrincipales = imagenesPortada.slice(0, 3);
  // Las imágenes que se mostrarán en el modal serán las que quedan (desde el índice 3 en adelante)
  const imagenesModal = imagenesPortada.slice(3);

  // Renderiza las 3 primeras imágenes en la vista principal
  function renderImagenesPrincipales() {
    return (
      <View style={styles.imagenesContainer}>
        {imagenesPrincipales.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (portadaSeleccionada === item.foto) {
                setPortadaSeleccionada(null);
              } else {
                setPortadaSeleccionada(item.foto);
              }
            }}
          >
            <Image
              source={{ uri: item.foto }}
              style={[
                styles.imagenPortada,
                portadaSeleccionada === item.foto ? styles.imagenSeleccionada : {}
              ]}
            />
          </TouchableOpacity>
        ))}
        {imagenesPortada.length > 3 && (
          <TouchableOpacity
            style={styles.verMasContainer}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.verMasTexto}>+{imagenesPortada.length - 3}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Renderiza el modal con el resto de las imágenes; no se cierra automáticamente al pulsar.
  function renderModalTodasImagenes() {
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
              data={imagenesModal}
              keyExtractor={(_, idx) => idx.toString()}
              numColumns={3}
              style={{ maxHeight: '80%', marginTop: 10, marginBottom: 15 }}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (portadaSeleccionada === item.foto) {
                      setPortadaSeleccionada(null);
                    } else {
                      setPortadaSeleccionada(item.foto);
                    }
                    // NO se cierra el modal automáticamente
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Campo de nombre */}
      <Text style={[styles.label, { color: colors.text }]}>Nombre de la lista:</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.text, backgroundColor: colors.backgroundFormulario }]}
        placeholder="Nombre de la lista"
        placeholderTextColor={colors.textSecondary}
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Campo de descripción */}
      <Text style={[styles.label, { color: colors.text }]}>Descripción:</Text>
      <TextInput
        style={[styles.textarea, { borderColor: colors.text, backgroundColor: colors.backgroundFormulario }]}
        placeholder="Descripción (opcional)"
        placeholderTextColor={colors.textSecondary}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      {/* Vista principal de imágenes */}
      <Text style={[styles.label, { color: colors.text }]}>Elige una imagen para la portada:</Text>
      {renderImagenesPrincipales()}
      {renderModalTodasImagenes()}

      {/* Selector de privacidad */}
      <Text style={[styles.label, { color: colors.text }]}>Privacidad:</Text>
      <View style={styles.radioContainer}>
        {["Privada", "Pública"].map((opcion) => (
          <TouchableOpacity
            key={opcion}
            style={styles.radioButton}
            onPress={() => setPrivacidad(opcion)}
          >
            <View style={[styles.radioOuter, { borderColor: colors.text }]}>
              {privacidad === opcion && (
                <View style={[styles.radioInner, { backgroundColor: colors.text }]} />
              )}
            </View>
            <Text style={[styles.radioLabel, { color: colors.text }]}>{opcion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón para confirmar edición */}
      <TouchableOpacity
        style={[styles.boton, { backgroundColor: colors.buttonDark }]}
        onPress={editarLista}
      >
        <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
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

  // Vista principal de imágenes (primeras 3)
  imagenesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagenPortada: {
    width: 80,
    height: 80,
    marginHorizontal: 5,
    borderRadius: 5
  },
  imagenSeleccionada: {
    borderWidth: 3,
    borderColor: 'blue',
    opacity: 1.0,
  },
  verMasContainer: {
    width: 80,
    height: 80,
    marginHorizontal: 5,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verMasTexto: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    textAlign: 'center',
  },
  imagenPortadaModal: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 5,
  },
  listaModal: {
    justifyContent: 'center',
  },
  
  radioContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  radioButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 10 
  },
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
  radioLabel: { 
    fontSize: 16 
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
});
