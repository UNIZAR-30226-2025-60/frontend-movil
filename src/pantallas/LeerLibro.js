// // LeerLibro.js
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;
//   const pdfUrl = libro.enlace; // URL del PDF desde Google Drive

//   return (
//     <View style={styles.container}>
//       <WebView 
//         source={{ uri: `https://docs.google.com/gview?embedded=true&url=${pdfUrl}` }} 
//         style={styles.webview} 
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


import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LeerLibro({ route }) {
  const { libro } = route.params;
  const pdfUrl = libro.enlace; // Asegúrate de que este enlace sea válido y público

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: pdfUrl }} 
        style={styles.webview} 
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
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
