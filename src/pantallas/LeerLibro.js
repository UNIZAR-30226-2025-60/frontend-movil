// LeerLibro.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, Modal } from "react-native";
import Pdf from "react-native-pdf";
import RNFetchBlob from "react-native-blob-util";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "../componentes/Tema";
import { useColorScheme } from "react-native";
import cargandoModoOscuro from "../../assets/animacion_cargando_modo_oscuro.gif";
import cargandoModoClaro from "../../assets/animacion_cargando_modo_claro.gif";
import { API_URL } from "../../config";


export default function LeerLibro({ route, correoUsuario }) {
  const { libro } = route.params;
  const navigation = useNavigation();
  const colors = useThemeColors();
  const theme = useColorScheme();

  const [pdfPath, setPdfPath] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageRef = useRef(currentPage);
  const [totalPages, setTotalPages] = useState(libro.num_paginas || null);
  const [pdfKey, setPdfKey] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [paginasMarcadas, setPaginasMarcadas] = useState([]); // 🔥 Vector de páginas marcadas
  const [modalVisible, setModalVisible] = useState(false);

  const pdfRef = useRef(null);

  const increaseZoom = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const decreaseZoom = () => setScale((prev) => Math.max(prev - 0.1, 1));

  // Configuramos la cabecera con el título y la flecha de volver
  useEffect(() => {
    navigation.setOptions({
      title: `Leyendo: ${libro.nombre}`,
      headerStyle: { backgroundColor: colors.backgroundHeader },
      headerTintColor: colors.textHeader,
      headerBackTitle: "Atrás",
    });
  });

  useEffect(() => {
    const finalizar = navigation.addListener('beforeRemove', async (e) => {
      e.preventDefault();

      try {
        if (correoUsuario) {
          console.log("SI hay correo");
          // 1. Ha acabado la lectura de todo el libro
          if (libro.num_paginas == currentPageRef.current) {
            // Eliminamos el libro de en proceso, si estuviese ahí
            const respuestaDelete = await fetch(`${API_URL}/libros/enproceso`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                correo: correoUsuario,
                enlace: libro.enlace
              }),
            });
    
            const dataDelete = await respuestaDelete.json();
            if (!respuestaDelete.ok) {
              console.error("Error al eliminar el libro de 'En proceso':", dataDelete.error);
            } else {
              console.log("Libro eliminado de 'En Proceso':", dataDelete.message);
            }
  
            // Añadimos el libro a leidos
            const respuesta = await fetch(`${API_URL}/libros/leidos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                correo: correoUsuario,
                enlace: libro.enlace,
              }),
            });
  
            if (!respuesta.ok) {
              console.log("Hay un error");
              const errorData = await respuesta.json();
                throw new Error(errorData.error || "No se pudo agregar el libro a Leídos");
            }
  
  
            console.log("Finalizada la lectura del libro correctamente");
            Alert.alert("✅ Fin de la lectura", "Ha finalizado la lectura del libro correctamente");
          } 
  
          // 2. Aún no ha leído todo el libro
          else {
            const respuesta = await fetch(`${API_URL}/libros/enproceso`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                correo: correoUsuario,
                enlace: libro.enlace,
                pagina: currentPageRef.current
              }),
            });
            if (!respuesta.ok) {
              throw new Error(respuesta.error);
            }
  
            console.log("Lectura finalizada correctamente en la página " + currentPageRef.current);
            Alert.alert("✅ Lectura Finalizada", `Terminaste en la página ${currentPageRef.current}`);
  
          }
        }
        else {
          console.log("NO hay correo");

          console.log("Lectura finalizada correctamente");
          Alert.alert("✅ Lectura Finalizada", `Terminaste en la página ${currentPageRef.current}`);
        }

        navigation.dispatch(e.data.action);
  
      } catch (error) {
        console.log("Error al guardar la página de finalización de la lectura", respuesta.error);
        Alert.alert("⚠️ Error al guardar la página de finalización de la lectura", respuesta.error);
      }
    });

    return finalizar; // Limpia el listener al desmontar el componente
  }, [navigation]);


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
      const url = `${API_URL}/libros/enproceso/${correoUsuario}`;
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
      const url = `${API_URL}/fragmentos/obtenerFragmentos?correo=${correoUsuario}&enlace=${encodeURIComponent(libro.enlace)}`;
      const respuesta = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!respuesta.ok) {
        console.log(`Error al obtener las páginas destacadas: ` + respuesta.error);
        throw new Error(`Error al obtener las páginas destacadas: ` + respuesta.error);
      }

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

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  

  // ✅ Agrega o quita la página actual del vector de marcadas
  const toggleBookmark = async () => {
    const isMarked = paginasMarcadas.includes(currentPage);
    setPaginasMarcadas((prevMarcadas) =>
      isMarked
        ? prevMarcadas.filter((page) => page !== currentPage)
        : [...prevMarcadas, currentPage]
    );

      try {
        const respuesta = await fetch(`${API_URL}/fragmentos`, {
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


  const handleVerPaginasDestacadas = async () => {
    setModalVisible(true);
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {pdfPath ? (
        <>
          <View>
            {/* Control del Zoom y Marcador */}
            <View style={[styles.zoomContainer, { backgroundColor: colors.backgroundMenuLibro }]}>
              <TouchableOpacity
                style={[
                  styles.zoomButton,
                  { backgroundColor: scale <= 1 ? colors.buttonDarkDisabled : colors.buttonDarkSecondary },
                ]}
                onPress={decreaseZoom}
                disabled={scale <= 1}
              >
                <Icon
                  name="search-minus"
                  size={20}
                  color={scale <= 1 ? colors.buttonTextDarkDisabled : colors.buttonTextDark }
                />
              </TouchableOpacity>

              <Text style={[styles.zoomText, { color: colors.textDark }]}>{(scale * 100).toFixed(0)}%</Text>

              <TouchableOpacity
                style={[styles.zoomButton, { backgroundColor: scale >= 2 ? colors.buttonDarkDisabled : colors.buttonDarkSecondary },]}
                onPress={increaseZoom}
                disabled={scale >= 3}
              >
                <Icon name="search-plus" size={20} color={scale >= 2 ? colors.buttonTextDarkDisabled : colors.buttonTextDark } />
              </TouchableOpacity>

              {/* Botón de Marcador y Ver páginas destacadas*/}
              {correoUsuario && (
                <>
                  <TouchableOpacity style={[styles.bookmarkButton]} onPress={toggleBookmark}>
                    <Icon
                      name={paginasMarcadas.includes(currentPage) ? "bookmark" : "bookmark-o"}
                      size={24}
                      color={paginasMarcadas.includes(currentPage) ? colors.star : colors.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.viewBookmarksButton, { backgroundColor: colors.buttonDarkSecondary }]} onPress={handleVerPaginasDestacadas}>
                    <Text
                      style={[{ color: colors.buttonTextDark }]}
                    >
                      Ver páginas destacadas
                    </Text>
                  </TouchableOpacity>
                </>
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
          <View style={[styles.buttonContainer, { backgroundColor: colors.backgroundMenuLibro }]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: currentPage <= 1 ? colors.buttonDarkDisabled : colors.buttonDarkSecondary, }]}
              onPress={() => changePage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <Text 
                style={[styles.buttonText, { color: currentPage <= 1 
                      ? colors.buttonTextDarkDisabled : colors.buttonTextDark }]}
              >
                Anterior
              </Text>
            </TouchableOpacity>

            <Text style={[styles.pageText, { color: colors.textDark }]}>
              Página {currentPage} de {totalPages ?? "?"}
            </Text>

            <TouchableOpacity
              style={[ styles.button, { backgroundColor: totalPages && currentPage >= totalPages ? colors.buttonDarkDisabled : colors.buttonDarkSecondary }]}
              onPress={() => changePage(currentPage + 1)}
              disabled={totalPages && currentPage >= totalPages}
            >
              <Text 
                style={[styles.buttonText, { color: totalPages && currentPage >= totalPages
                      ? colors.buttonTextDarkDisabled : colors.buttonTextDark }]}
              >
                Siguiente
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>Cargando PDF...</Text>
          <Image source={theme === 'dark' ? cargandoModoOscuro : cargandoModoClaro} style={styles.loadingImage}/>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.drawerOverlay]}>
          <View style={[styles.drawer]}>
            <Text style={[styles.drawerTitle, { color: colors.text }]}>Páginas destacadas</Text>

            {paginasMarcadas.length === 0 ? (
              <Text style={{ color: colors.text }}>No hay páginas destacadas aún</Text>
            ) : (
              paginasMarcadas
                .sort((a, b) => a - b)
                .map((page, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => {setCurrentPage(page); setModalVisible(false); }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Icon
                      name="bookmark"
                      size={24}
                      color={colors.star}
                    />
                    <Text style={[styles.pageItem, { marginLeft: 10, color: colors.text }]}>Página {page}</Text>
                  </TouchableOpacity>
                ))
            )}

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.buttonDarkSecondary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: colors.buttonTextDark }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  button: {
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
  pageText: {
    fontSize: 16,
    alignSelf: "center",
  },
  finishButton: {
    padding: 10,
    margin: 10,
    borderRadius: 22,
    alignItems: "center",
  },
  zoomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  zoomButton: {
    padding: 10,
    borderRadius: 22,
    marginHorizontal: 5,
  },
  zoomText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookmarkButton: {
    padding: 10,
    borderRadius: 22,
  },
  viewBookmarksButton: {
    padding: 10,
    borderRadius: 22,
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
  // Estilos para el modal
  pageItem: {
    fontSize: 16,
    paddingVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignSelf: "flex-start",
  },
  drawerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  drawer: {
    width: "80%",
    height: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pageItem: {
    fontSize: 16,
    paddingVertical: 6,
  },
});