// LeerLibro.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import Pdf from "react-native-pdf";
import RNFetchBlob from "react-native-blob-util";

export default function LeerLibro({ route }) {
  const { libro } = route.params;
  const [pdfPath, setPdfPath] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(libro.num_paginas || null);
  const [pdfKey, setPdfKey] = useState(0); // 🔥 Se usa para forzar el renderizado
  const pdfRef = useRef(null);

  useEffect(() => {
    const downloadPdf = async () => {
      const match = libro.enlace.match(/[-\w]{25,}/);
      const fileId = match ? match[0] : null;
      const pdfUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      const { dirs } = RNFetchBlob.fs;
      const filePath = `${dirs.DocumentDir}/archivo.pdf`;

      try {
        const res = await RNFetchBlob.config({
          fileCache: true,
          path: filePath,
        }).fetch("GET", pdfUrl);

        setPdfPath(res.path());
      } catch (error) {
        Alert.alert("Error", "No se pudo descargar el PDF: " + error.message);
      }
    };

    downloadPdf();
  }, [libro]);

  // 🚀 Función para cambiar la página
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPdfKey((prevKey) => prevKey + 1); // 🔥 Forzar recarga del PDF
    }
  };

  // Función para finalizar lectura
  const finalizarLectura = () => {
    console.log(`Lectura finalizada en la página: ${currentPage}`);
    Alert.alert("Lectura Finalizada", `Terminaste en la página ${currentPage}`);
  };

  return (
    <View style={styles.container}>
      {pdfPath ? (
        <>
          <Pdf
            key={pdfKey} // 🔥 Forzamos el redibujado del PDF al cambiar la página
            ref={pdfRef}
            source={{ uri: pdfPath, cache: true }}
            page={currentPage} // 📌 Se asegura de mostrar la página correcta
            style={styles.pdf}
            onLoadComplete={(numberOfPages) => {
              setTotalPages(numberOfPages || libro.num_paginas);
            }}
            onPageChanged={(page) => setCurrentPage(page)}
          />

          {/* Botones de navegación */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, currentPage <= 1 && styles.disabledButton]}
              onPress={() => changePage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Página {currentPage} de {totalPages ?? "?"}
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                totalPages && currentPage >= totalPages && styles.disabledButton,
              ]}
              onPress={() => changePage(currentPage + 1)}
              disabled={totalPages && currentPage >= totalPages}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>

          {/* Botón Finalizar Lectura */}
          <TouchableOpacity style={styles.finishButton} onPress={finalizarLectura}>
            <Text style={styles.buttonText}>Finalizar Lectura</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Cargando PDF...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  pageText: {
    fontSize: 16,
    alignSelf: "center",
  },
  finishButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

