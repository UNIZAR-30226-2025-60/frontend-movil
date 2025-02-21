// MisListas.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from "../componentes/Tema";

export default function MisListas() {
  const route = useRoute();
  const { libro } = route.params || {}; // Recibimos el libro di viene de DetallesLibro
  const [listas, setListas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaLista, setNuevaLista] = useState("");
  const colors = useThemeColors();
  const navigation = useNavigation();

  const usuarioCorreo = 'amador@gmail.com'; // Simulación, debería venir de autenticación
  const backendUrl = 'http://10.0.2.2:3000';

  useEffect(() => {
    obtenerListas();
  }, []);

  const obtenerListas = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/${usuarioCorreo}`);
      const datos = await respuesta.json();

    // Ordenar: "Mis Favoritos" primero y el resto alfabéticamente
    const listasOrdenadas = datos.sort((a, b) => {
      if (a.nombre === 'Mis Favoritos') return -1;
      if (b.nombre === 'Mis Favoritos') return 1;
      return a.nombre.localeCompare(b.nombre); // Orden alfabético
    });

    setListas(listasOrdenadas);

    } catch (error) {
      console.error('Error al obtener listas:', error);
    }
  };

  // Añadir el libro a la lista seleccionada
  const añadirLibroALista = async (idLista) => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/libro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioCorreo,
          id_lista: idLista,
          enlace_libro: libro.enlace, // Añadimos el libro
        }),
      });
      if (respuesta.ok) {
        Alert.alert('Éxito', `El libro se ha añadido a la lista seleccionada.`);
        navigation.goBack(); // Volvemos a la pantalla anterior
      } else {
        Alert.alert('Error', 'No se pudo añadir el libro a la lista.');
      }
    } catch (error) {
      console.error('Error al añadir libro a la lista:', error);
    }
  };

  const crearLista = async () => {
    if (!nuevaLista.trim()) return;
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioCorreo,
          nombre_lista: nuevaLista,
        }),
      });
      if (respuesta.ok) {
        setNuevaLista("");
        setModalVisible(false);
        obtenerListas();
      } else {
        Alert.alert('Error', 'No se pudo crear la lista.');
      }
    } catch (error) {
      console.error('Error al crear lista:', error);
    }
  };

  const eliminarLista = async (idLista) => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/${idLista}`, {
        method: 'DELETE',
      });
      if (respuesta.ok) {
        obtenerListas();
      } else {
        Alert.alert('Error', 'No se pudo eliminar la lista.');
      }
    } catch (error) {
      console.error('Error al eliminar lista:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: colors.background }]}
      //onPress={() => libro ? añadirLibroALista(item.id_lista) : navigation.navigate("MostrarListaLibros", { lista: item })}
      onPress={() => {
        if (item.nombre === 'Mis Favoritos') {
          // Solo redirige si el nombre coincide
          navigation.navigate('Mis favoritos');
        } else if (libro) {
          añadirLibroALista(item.id_lista);
        } else {
          // Aquí manejarías otras listas
          const urlLista = `http://10.0.2.2:3000/api/listas/amador@gmail.com/${item.nombre}/libros`;
          navigation.navigate('LibrosDeListaScreen', { nombreLista: item.nombre, url: urlLista });
        }
      }}
    >
      <Ionicons name="book-outline" size={50} color={colors.icon} />
      <Text style={[styles.nombreLista, { color: colors.text }]}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Encabezado titulo="Mis Listas" />
      <FlatList
        data={[...listas, { id_lista: 'nueva', nombre: 'Añadir lista', esNueva: true }]}
        renderItem={({ item }) =>
          item.esNueva ? (
            <TouchableOpacity
              style={[styles.itemContainer, styles.addContainer]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={50} color={colors.icon} />
              <Text style={[styles.nombreLista, { color: colors.text }]}>Añadir lista</Text>
            </TouchableOpacity>
          ) : (
            renderItem({ item })
          )
        }
        //keyExtractor={(item) => item.id_lista.toString()}
        keyExtractor={(item, index) => (item.id_lista ? item.id_lista.toString() : index.toString())}
        numColumns={2}
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      />

      {/* Modal para crear una nueva lista */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>            
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Lista</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
              placeholder="Nombre de la lista"
              placeholderTextColor="#aaa"
              value={nuevaLista}
              onChangeText={setNuevaLista}
            />
            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.boton} onPress={() => setModalVisible(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boton} onPress={crearLista}>
                <Text>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  itemContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  nombreLista: { marginTop: 8, textAlign: 'center', fontSize: 14 },
  addContainer: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#aaa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  boton: { flex: 1, alignItems: 'center', padding: 10 },
});
