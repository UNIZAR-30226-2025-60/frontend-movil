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
        backgroudSubtitle: "#97927f",  // Justo lo que hay debajo del encabezado principal
        background: "#4c4637",
        buttonArrow: "#fef9d2",

        // TEXTO
        text: "#dfcc75",
        textSecondary: "#a54cac",
        subtitleText: "#000000",

        // ICONOS
        icon: "#dfcc75",
        star: "#ffe300",

        // BOTONES
        button: "#a54cac",
        buttonSec: "#a5365d",
        buttonOther: "#cacaca",
        buttonOtherText: "#a54cac",
        buttonDark: "#4c4637",
        buttonLight: "#dfcc75",

        // TEXTO BOTONES
        buttonText: "#ffffff",
        buttonTextLight: "#4c4637",
        buttonTextDark: "#dfcc75",

        // BOTONES DE CATEGORÍA
        categoriaButton: "#be954e",
        categoriaButtonSeleccionado: "#d45682",

        // BORDES
        border: "#ffffff",
        
        
      }
    : { /***************************************/
        /************* TEMA CLARO *************/
        /***************************************/
        
        // COLORES DE FONDO
        backgroundHeader: "#eeca06",
        backgroudSubtitle: "#f8e79b",  // Justo lo que hay debajo del encabezado principal
        background: "#f8f7f3",
        backgroundFormulario: "#f8e79b",
        backgroundSecondary: "#ecebe5",

        // TEXTO
        text: "#4c4637",
        textSecondary: "#6a6456",
        textTerciary: "#878374",
        subtitleText: "#6a6456",

        // ICONOS
        icon: "#4c4637",
        star: "#eeca06",

        // BOTONES
        button: "#007bff",
        buttonSec: "#28a745",
        buttonDark: "#4c4637",
        buttonDarkSecondary: "#6a6456",
        buttonDarkTerciary: "#878374",
        buttonLight: "#f8e79b",

        // TEXTO BOTONES
        buttonText: "#000000",
        buttonTextLight: "#4c4637",
        buttonTextDark: "#f8e79b",

        // OTROS BOTONES
        buttonOther: "#cacaca",
        buttonOtherText: "#007bff",

        // BUSCADOR Y CATEGORÍAS
        buscador: "#f8e79b",
        categoriaButton: "#d9d6cc",
        categoriaButtonSeleccionado: "#b2ab99",
        buttonArrow: "#d9d6cc",

        // FILTROS
        filtroSeleccionado: "#b2ab99",
        filtroNoSeleccionado: "#ecebe5",

        // VALORACIONES
        progressFilled: "#f4dd69",
        progressNotFilled: "#ecebe5",

        // BORDES
        border: "#4c4637",
        line: "#4c4637",
      };
};
