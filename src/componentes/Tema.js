/**
 * Archivo: Tema.js
 * Descripción: Se definen los colores de la interfaz según el
 *              tema de color actual del dispositivo (claro u oscuro).
 */

import { useColorScheme } from "react-native";

// Función para obtener los colores según el tema
export const useThemeColors = () => {
  const theme = useColorScheme();
  
  return theme === "dark"
    ? { /***************************************/
        /************* TEMA OSCURO *************/
        /***************************************/

        // COLORES DE FONDO
        backgroundHeader: "#655f4e",
        subtitleBackground: "#97927f",  // Justo lo que hay debajo del encabezado principal
        background: "#4c4637",
        arrowBackground: "#fef9d2",

        // TEXTO
        text: "#dfcc75",
        textSecondary: "#a54cac",
        subtitleText: "#000000",

        // ICONOS
        icon: "#ffffff",
        star: "#ffe300",

        // BOTONES
        button: "#a54cac",
        buttonSec: "#a5365d",
        buttonText: "#ffffff",

        // OTROS BOTONES
        buttonOther: "#cacaca",
        buttonOtherText: "#a54cac",

        // BOTONES DE CATEGORÍA
        categoriaButton: "#be954e",
        categoriaButtonSec: "#d45682",

        // BORDES
        border: "#ffffff",
        
        
      }
    : { /***************************************/
        /************* TEMA CLARO *************/
        /***************************************/
        
        // COLORES DE FONDO
        backgroundHeader: "#bda636",
        subtitleBackground: "#dfcc75",  // Justo lo que hay debajo del encabezado principal
        background: "#f2f1e7",
        arrowBackground: "#cacac9",

        // TEXTO
        text: "#4c4637",
        textSecondary: "#333333",
        subtitleText: "#000000",

        // ICONOS
        icon: "#000000",
        star: "#ffe300",

        // BOTONES
        button: "#007bff",
        buttonSec: "#28a745",
        buttonText: "#000000",

        // OTROS BOTONES
        buttonOther: "#cacaca",
        buttonOtherText: "#007bff",

        // BOTONES DE CATEGORÍA
        categoriaButton: "#dfcc75",
        categoriaButtonSec: "#be954e",

        // BORDES
        border: "#000000",
      };
};
