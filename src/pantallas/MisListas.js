// MisListas.js

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Encabezado from '../componentes/Encabezado';
import { useThemeColors } from "../componentes/Tema";

export default function MisListas() {
  const [listas, setListas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaLista, setNuevaLista] = useState("");
  const colors = useThemeColors();
  const navigation = useNavigation();
  const usuarioCorreo = 'usuario@correo.com'; // Simulación, debería venir de autenticación
  const backendUrl = 'http://10.0.2.2:3000';

  useEffect(() => {
    obtenerListas();
  }, []);

  const obtenerListas = async () => {
    try {
      const respuesta = await fetch(`${backendUrl}/api/listas/${usuarioCorreo}`);
      const datos = await respuesta.json();
      setListas(datos);
    } catch (error) {
      console.error('Error al obtener listas:', error);
      Alert.alert('Error', 'No se pudieron cargar las listas.');
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
      onPress={() => navigation.navigate("MostrarListaLibros", { lista: item })}
      onLongPress={() =>
        Alert.alert(
          'Eliminar lista',
          `¿Seguro que deseas eliminar la lista "${item.nombre}"?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', onPress: () => eliminarLista(item.id_lista) },
          ]
        )
      }
    >
      <Ionicons name="book-outline" size={50} color={colors.icon} />
      <Text style={[styles.nombreLista, { color: colors.text }]}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Encabezado />
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
        keyExtractor={(item) => item.id_lista.toString()}
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
