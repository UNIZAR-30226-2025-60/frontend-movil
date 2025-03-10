// LeerLibro.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import Pdf from "react-native-pdf";
import RNFetchBlob from "react-native-blob-util";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import cargandoGif from "../../assets/animacion_cargando.gif";

export default function LeerLibro({ route, correoUsuario }) {
  const { libro } = route.params;
  const navigation = useNavigation();

  const [pdfPath, setPdfPath] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(libro.num_paginas || null);
  const [pdfKey, setPdfKey] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [paginasMarcadas, setPaginasMarcadas] = useState([]); // 🔥 Vector de páginas marcadas

  const pdfRef = useRef(null);

  const increaseZoom = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const decreaseZoom = () => setScale((prev) => Math.max(prev - 0.2, 1));

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

    if (correoUsuario) {
      obtenerPrimeraPagina();
      obtenerPaginasDestacadas();
    }  
  }, [libro]);

  const obtenerPrimeraPagina = async () => {
    try {
      console.log("ENLACE:", libro.enlace);
      const url = `http://10.0.2.2:3000/api/libros/enproceso/${correoUsuario}`;
      const respuesta = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        if (data.length !== 0) {
          const libroEnProceso = data.find(item => item.enlace === libro.enlace);
          if (libroEnProceso) {
            setCurrentPage(libroEnProceso.pagina);
            console.log("PRIMERA PÁGINA:", libroEnProceso.pagina);
          }
        }
      }
    } catch(error) {
      console.log("Error al obtener la página en proceso:", error);
    }
  };

  const obtenerPaginasDestacadas = async () => {
    try {
      const url = `http://10.0.2.2:3000/api/fragmentos?correo=${correoUsuario}&enlace=${encodeURIComponent(libro.enlace)}`;
      const respuesta = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!respuesta.ok) {
        console.log(`Error al obtener las páginas destacadas: ` + respuesta.error);
        throw new Error(`Error al obtener las páginas destacadas: ` + respuesta.error);
      }
      console.log(`Páginas destacadas obtenidas correctamente`);

      const data = await respuesta.json();
      const paginas = data.map(item => item.pagina);
      setPaginasMarcadas(paginas);

    } catch (error) {
      console.log(error);
    }
  }

  // 🚀 Cambia la página y verifica si está marcada
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPdfKey((prevKey) => prevKey + 1);
    }
  };

  // ✅ Agrega o quita la página actual del vector de marcadas
  const toggleBookmark = async () => {
    const isMarked = paginasMarcadas.includes(currentPage);
    setPaginasMarcadas((prevMarcadas) =>
      isMarked
        ? prevMarcadas.filter((page) => page !== currentPage)
        : [...prevMarcadas, currentPage]
    );

      try {
        const respuesta = await fetch("http://10.0.2.2:3000/api/fragmentos", {
          method: isMarked ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            correo: correoUsuario,
            enlace: libro.enlace,
            pagina: currentPage}),
        });
  
        if (!respuesta.ok) {
          console.log(`Error al ${isMarked ? "eliminar" : "guardar"} el bookmark: ` + respuesta.error);
          throw new Error(`Error al ${isMarked ? "eliminar" : "guardar"} el bookmark: ` + respuesta.error);
        }
        Alert.alert(`✅ Página ${currentPage} ${isMarked ? "eliminada de destacados" : "destacada"} correctamente`);
        console.log(`Bookmark correctamente ${isMarked ? "eliminado" : "guardado"}`);
  
  
      } catch (error) {
        console.log("Error al guardar la guardar la página: " + error);
      }
  };

  // Función para finalizar lectura
  const finalizarLectura = async () => {
    try {
      if (correoUsuario) {
        const respuesta = await fetch("http://10.0.2.2:3000/api/libros/enproceso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            correo: correoUsuario,
            enlace: libro.enlace,
            pagina: currentPage
          }),
        });
    
        if (!respuesta.ok) {
          throw new Error(respuesta.error);
        }
      }

      console.log("Lectura finalizada correctamente en la página " + currentPage);
      Alert.alert("✅ Lectura Finalizada", `Terminaste en la página ${currentPage}`, [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);

    } catch (error) {
      console.log("Error al guardar la página de finalización de la lectura", respuesta.error);
      Alert.alert("⚠️ Error al guardar la página de finalización de la lectura", respuesta.error, [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };


  return (
    <View style={styles.container}>
      {pdfPath ? (
        <>
          <View>
            {/* Botón Finalizar Lectura */}
            <TouchableOpacity style={styles.finishButton} onPress={finalizarLectura}>
              <Text style={styles.buttonText}>Finalizar Lectura</Text>
            </TouchableOpacity>

            {/* Control del Zoom y Marcador */}
            <View style={styles.zoomContainer}>
              <TouchableOpacity
                style={[styles.zoomButton, scale <= 1 && styles.disabledButton]}
                onPress={decreaseZoom}
                disabled={scale <= 1}
              >
                <Icon name="search-minus" size={20} color={scale <= 1 ? "#888" : "#fff"} />
              </TouchableOpacity>

              <Text style={styles.zoomText}>{(scale * 100).toFixed(0)}%</Text>

              <TouchableOpacity
                style={[styles.zoomButton, scale >= 3 && styles.disabledButton]}
                onPress={increaseZoom}
                disabled={scale >= 3}
              >
                <Icon name="search-plus" size={20} color={scale >= 3 ? "#888" : "#fff"} />
              </TouchableOpacity>

              {/* Botón de Marcador */}
              {correoUsuario && (
                <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark}>
                  <Icon
                    name={paginasMarcadas.includes(currentPage) ? "bookmark" : "bookmark-o"}
                    size={24}
                    color={paginasMarcadas.includes(currentPage) ? "#FFD700" : "#444"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* PDF del libro */}
          <Pdf
            key={pdfKey}
            ref={pdfRef}
            source={{ uri: pdfPath, cache: true }}
            page={currentPage}
            scale={scale}
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
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Cargando PDF...</Text>
          <Image source={cargandoGif} style={styles.loadingImage}/>
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
  zoomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  zoomButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  zoomText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookmarkButton: {
    marginLeft: 10,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingImage: {
    width: 160,
    height: 160,
  },
});
