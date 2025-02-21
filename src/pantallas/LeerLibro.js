// LeerLibro.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function LeerLibro({ route }) {
  const { libro } = route.params;
  const pdfUrl = libro.enlace.replace("view", "preview"); // Modifica la URL

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