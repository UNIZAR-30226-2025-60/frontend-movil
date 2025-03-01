// LeerLibro.js
// FUNCIONA PERO ES CON WEBVIEW
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;
//   const pdfUrl = libro.enlace.replace("view", "preview"); // Modifica la URL
//   // const pdfUrl = `https://docs.google.com/gview?embedded=true&url=${pdfUrl1}`;

//   return (
//     <View style={styles.container}>
//       <WebView 
//         source={{ uri: pdfUrl }} 
//         style={styles.webview} 
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         setBuiltInZoomControls={true}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webview: {
//     flex: 1,
//   },
// });



// BOTONES SIGUIENTE Y ANTERIOR PERO NO BAJAN
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;
//   const [paginaActual, setPaginaActual] = useState(1);
//   const totalPaginas = 170; // 🔴 Cambia esto al número real de páginas

//   // Construir la URL con la página actual
//   const construirUrl = (pagina) => {
//     return libro.enlace.replace("view", "preview") + `#page=${pagina}`;
//   };

//   // Navegar a la página siguiente
//   const paginaSiguiente = () => {
//     if (paginaActual < totalPaginas) {
//       setPaginaActual(paginaActual + 1);
//     }
//   };

//   // Navegar a la página anterior
//   const paginaAnterior = () => {
//     if (paginaActual > 1) {
//       setPaginaActual(paginaActual - 1);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <WebView 
//         source={{ uri: construirUrl(paginaActual) }} 
//         style={styles.webview} 
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//       />

//       {/* Número de página */}
//       <Text style={styles.pageNumber}>Página: {paginaActual} / {totalPaginas}</Text>

//       {/* Controles de navegación */}
//       <View style={styles.controls}>
//         <TouchableOpacity 
//           onPress={paginaAnterior} 
//           style={[styles.button, paginaActual === 1 && styles.disabled]}
//           disabled={paginaActual === 1}
//         >
//           <Text style={styles.buttonText}>◀ Anterior</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           onPress={paginaSiguiente} 
//           style={[styles.button, paginaActual === totalPaginas && styles.disabled]}
//           disabled={paginaActual === totalPaginas}
//         >
//           <Text style={styles.buttonText}>Siguiente ▶</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   webview: { flex: 1 },
//   pageNumber: {
//     position: 'absolute',
//     bottom: 60,
//     left: '50%',
//     transform: [{ translateX: -50 }],
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     color: 'white',
//     padding: 10,
//     borderRadius: 5,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     position: 'absolute',
//     bottom: 10,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 20,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   disabled: {
//     backgroundColor: '#ccc',
//   },
// });





// SI QUE CAMBIA DEL INDEXADOR, PERO NO BLOQUEA SCROLL
// import React, { useRef, useState } from 'react';
// import { View, StyleSheet, Button } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;
//   const webViewRef = useRef(null);
//   const [paginaActual, setPaginaActual] = useState(1);

//   // Función para inyectar JavaScript y cambiar la página
//   const cambiarPagina = (incremento) => {
//     const nuevaPagina = paginaActual + incremento;
//     if (nuevaPagina < 1) return;

//     setPaginaActual(nuevaPagina);

//     const script = `
//       (function() {
//         let elementos = document.querySelectorAll('.ndfHFb-c4YZDc-DARUcf-NnAfwf-cQYSPc');
//         if (elementos.length > 0) {
//           elementos[0].innerText = '${nuevaPagina}';
//         }
//       })();
//       true;
//     `;

//     webViewRef.current?.injectJavaScript(script);
//   };

//   return (
//     <View style={styles.container}>
//       <WebView
//         ref={webViewRef}
//         source={{ uri: libro.enlace.replace("view", "preview") }}
//         style={styles.webview}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//       />
//       <View style={styles.buttonsContainer}>
//         <Button title="Anterior" onPress={() => cambiarPagina(-1)} />
//         <Button title="Siguiente" onPress={() => cambiarPagina(1)} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   webview: { flex: 1 },
//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//   },
// });


// NO CAMBIA EL INDEXADOR, PERO SI QUE BLOQUEA SCROLL
// import React, { useRef, useState } from 'react';
// import { View, StyleSheet, Button } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;
//   const webViewRef = useRef(null);
//   const [paginaActual, setPaginaActual] = useState(1);

//   // Inyectamos JavaScript para deshabilitar el scroll
//   const scriptBloquearScroll = `
//     (function() {
//       document.body.style.overflow = 'hidden'; // Oculta scroll
//       document.documentElement.style.overflow = 'hidden';

//       // Evita eventos táctiles para desplazamiento
//       document.addEventListener('touchmove', function(event) {
//         event.preventDefault();
//       }, { passive: false });
//     })();
//     true;
//   `;

//   // Función para cambiar de página manualmente con los botones
//   const cambiarPagina = (incremento) => {
//     const nuevaPagina = paginaActual + incremento;
//     if (nuevaPagina < 1) return;

//     setPaginaActual(nuevaPagina);
//     console.log("Página actual:", nuevaPagina);

//     const script = `
//       (function() {
//         let event = new KeyboardEvent('keydown', {
//           key: '${incremento > 0 ? 'PageDown' : 'PageUp'}',
//           keyCode: ${incremento > 0 ? 34 : 33}, 
//           bubbles: true
//         });
//         document.dispatchEvent(event);
//       })();
//       true;
//     `;

//     webViewRef.current?.injectJavaScript(script);
//   };

//   return (
//     <View style={styles.container}>
//       <WebView
//         ref={webViewRef}
//         source={{ uri: libro.enlace.replace("view", "preview") }}
//         style={styles.webview}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         injectedJavaScript={scriptBloquearScroll} // Inyectamos el script para bloquear el scroll
//       />
//       <View style={styles.buttonsContainer}>
//         <Button title="Anterior" onPress={() => cambiarPagina(-1)} />
//         <Button title="Siguiente" onPress={() => cambiarPagina(1)} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   webview: { flex: 1 },
//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//   },
// });


// SI CAMBIA EL INDEXADOR, SI BLOQUEA SCROLL (a veces)
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LeerLibro({ route }) {
  const { libro } = route.params;
  const webViewRef = useRef(null);
  const [paginaActual, setPaginaActual] = useState(1);

  // Inyectamos JavaScript para bloquear el scroll y permitir el cambio de página
  const scriptBloquearScroll = `
    (function() {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Bloquear eventos de scroll táctil y de mouse
      document.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });
      document.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });

      // Permitir PageUp/PageDown para navegación
      document.addEventListener('keydown', (event) => {
        if (event.key === 'PageDown' || event.key === 'PageUp') {
          event.stopPropagation();
        }
      });
    })();
    true;
  `;

  // Función para cambiar la página
  const cambiarPagina = (incremento) => {
    const nuevaPagina = paginaActual + incremento;
    if (nuevaPagina < 1) return;

    setPaginaActual(nuevaPagina);
    console.log("Página actual:", nuevaPagina);

    const script = `
      (function() {
        // Simula presionar la tecla PageUp/PageDown
        var event = new KeyboardEvent('keydown', {
          key: '${incremento > 0 ? 'PageDown' : 'PageUp'}',
          keyCode: ${incremento > 0 ? 34 : 33},
          bubbles: true
        });
        document.dispatchEvent(event);

        // Actualizar el número del indexador de página
        let elementos = document.querySelectorAll('.ndfHFb-c4YZDc-DARUcf-NnAfwf-cQYSPc');
        if (elementos.length > 0) {
          elementos[0].innerText = '${nuevaPagina}';
        }
      })();
      true;
    `;

    webViewRef.current?.injectJavaScript(script);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: libro.enlace.replace("view", "preview") }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={scriptBloquearScroll} // Bloqueo de scroll
      />
      <View style={styles.buttonsContainer}>
        <Button title="Anterior" onPress={() => cambiarPagina(-1)} />
        <Button title="Siguiente" onPress={() => cambiarPagina(1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

























// DESCARGA EL PDF PERO NO LO VISUALIZA
// import React, { useRef, useState } from 'react';
// import { View, StyleSheet, Button, Dimensions } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;

//   const fileId = libro.enlace.match(/\/d\/(.*)\//)[1]; // Extrae el ID del archivo
//   const directPdfUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

//   // const pdfUrl = libro.enlace.replace("view", "preview"); // Modifica la URL

//   const webViewRef = useRef(null);
//   const screenHeight = Dimensions.get('window').height; // Altura de la pantalla
//   const [currentPage, setCurrentPage] = useState(1);

//   // Inyectar CSS para bloquear el scroll manual
//   const disableScrollScript = `
//     document.body.style.overflow = 'hidden'; 
//     true;
//   `;

//   // Función para hacer scroll en WebView
//   const scrollToPage = (direction) => {
//     const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
//     if (newPage < 1) return; // No ir antes de la primera página

//     const script = `window.scrollTo({ top: ${screenHeight * (newPage - 1)}, behavior: 'smooth' }); true;`;
//     webViewRef.current.injectJavaScript(script);
//     setCurrentPage(newPage);
//   };

//   return (
//     <View style={styles.container}>
//       <WebView 
//         ref={webViewRef}
//         source={{ uri: directPdfUrl }} 
//         style={styles.webview} 
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         injectedJavaScript={disableScrollScript} // Bloquea el scroll manual
//         scrollEnabled={false} // Evita el scroll en Android/iOS
//       />

//       {/* Botones de navegación */}
//       <View style={styles.buttonContainer}>
//         <Button title="← Anterior" onPress={() => scrollToPage("prev")} disabled={currentPage === 1} />
//         <Button title="Siguiente →" onPress={() => scrollToPage("next")} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webview: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//   },
// });


