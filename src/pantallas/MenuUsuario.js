// MenuUsuario.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, Pressable, Alert, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from "../componentes/Tema";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import imagenPortadaLibro from "../../assets/imagen-portada-login.png";
import imagenFondoLibro from "../../assets/libro-abierto.png";


const { width } = Dimensions.get('window');

const IMAGE_WIDTH = width*0.5;
const IMAGE_HEIGHT = IMAGE_WIDTH*(7/5); // Relación de aspecto 5:7
const START_X = width/6;

export default function MenuUsuario({ setCorreoUsuario }) {
  const [bookOpened, setBookOpened] = useState(false);

  const navigation = useNavigation();
  const colors = useThemeColors();

  // Configuramos la cabecera con el título y la flecha de volver
  useEffect(() => {
    navigation.setOptions({
      title: "Menú de usuario",
      headerBackTitle: "Atrás",
    });
  }, [navigation]);


  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  // const opacity = useSharedValue(0);

  const openBook = () => {
    rotation.value = withTiming(150, { duration: 1000 }, () => {
      // opacity.value = withTiming(1, { duration: 0 });
    });
    scale.value = withTiming(0.5, { duration: 1000 });
    
    setBookOpened(true);
  };


  const animatedCoverStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { translateX: -START_X },
        { rotateY: `-${rotation.value}deg` },
        { translateX: START_X },
        { scaleX: scale.value },
      ]
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      // opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable onPress={openBook}>
        <Animated.View style={[styles.bookCover, animatedCoverStyle]}>
          <Image
            source={imagenPortadaLibro}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      </Pressable>

      {bookOpened && 
        <Animated.View style={[styles.textContainer, animatedTextStyle, { backgroundImage: imagenFondoLibro, backgroundSize: 'cover' }]}>
          <ImageBackground
            source={imagenFondoLibro}
            style={[styles.imagenFondoLibro, { resizeMode: 'cover' }]}
          >
            <View style={styles.centeredContent}> 
              <Text style={[styles.titulo, { color: colors.text }]}>¡Bienvenido    a Bookly!</Text>

              <TouchableOpacity 
                style={[styles.boton, { backgroundColor: colors.buttonDark }]}
                onPress={() => bookOpened && navigation.navigate("IniciarSesion")}
              >
                <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Iniciar sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.boton, styles.botonSecundario, { backgroundColor: colors.buttonDark }]}
                onPress={() => bookOpened && navigation.navigate("Registrarse")}
              >
                <Text style={[styles.textoBoton, { color: colors.buttonTextDark }]}>Registrarse</Text>
              </TouchableOpacity>

            </View>
          </ImageBackground>
        </Animated.View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCover: {
    position: 'relative',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  textContainer: {
    position: 'absolute',
    left: width/3,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boton: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginBottom: 10,
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagenFondoLibro: {
    width: IMAGE_WIDTH*1,
    height: IMAGE_HEIGHT,
  },
  centeredContent: {
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 30,
    height: '100%',
  },
});

