// LeerLibro.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LeerLibro({ route }) {
  const { libro } = route.params;
  const pdfUrl = libro.enlace.replace("view", "preview"); // Modifica la URL
  // const pdfUrl = `https://docs.google.com/gview?embedded=true&url=${pdfUrl1}`;

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: pdfUrl }} 
        style={styles.webview} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        setBuiltInZoomControls={true}
      />
      {/* <WebView 
        source={{ uri: pdfUrl }} 
        style={styles.webview} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true} // Habilita zoom nativo
        allowsFullscreenVideo={true}
        useWebKit={true}
        setBuiltInZoomControls={true} // Controles de zoom en Android
        // setDisplayZoomControls={false} // Oculta los botones de zoom
      /> */}
      {/* <WebView 
        source={{ uri: pdfUrl }} 
        style={styles.webview} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});



// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import Pdf from 'react-native-pdf';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;
//   const pdfUrl = `https://drive.google.com/uc?export=download&id=${libro.enlace.split('/d/')[1].split('/')[0]}`;

//   return (
//     <View style={styles.container}>
//       <Pdf
//         source={{ uri: pdfUrl, cache: true }}
//         style={styles.pdf}
//         onLoadComplete={(numberOfPages) => console.log(`PDF cargado, ${numberOfPages} páginas`)}
//         onError={(error) => console.log(error)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   pdf: { flex: 1, width: '100%', height: '100%' },
// });

