// // LeerLibro.js

// NO FUNCIONA EL PDF EN WEB
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function LeerLibro({ route }) {
//   const { libro } = route.params;
//   const pdfUrl = libro.enlace; // URL del PDF desde Google Drive

//   return (
//     <View style={styles.container}>
//       <WebView 
//         source={{ uri: pdfUrl }} 
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



// SE NECESITA ACCESO AL PDF EN WEB
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function LeerLibro({ route }) {
  const { libro } = route.params;
  const pdfUrl = libro.enlace; // URL del PDF desde Google Drive

  return (
    <View style={styles.container}>
      <iframe
        src={pdfUrl}
        style={styles.iframe}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iframe: {
    width: '100%',
    height: '100%',
  },
});


