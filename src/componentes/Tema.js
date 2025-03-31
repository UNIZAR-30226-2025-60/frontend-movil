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
        backgroundHeader: "#eeca06",
        backgroundSubtitle: "#97927f",  // Justo lo que hay debajo del encabezado principal
        background: "#4c4637",
        buttonArrow: "#fef9d2",
        // ahora
        backgroundFormulario: "#B2AB99",
        backgroundSecondary: "#A5A294",
        backgroundMenu: "#6a6456",
        //

        // TEXTO
        textHeader: "#4c4637",
        text: "#FBF1CD",
        textDark: "#4c4637",
        textLight: "#FBF1CD",
        textSecondary: "#F8E79B",
        subtitleText: "#000000",
        // ahora
        textTerciary: "#B2AB99",
        textFormulario: "#4c4637",
        //

        // ICONOS
        icon: "#FBF1CD",
        star: "#ffe300",

        // BOTONES
        button: "#a54cac",
        buttonSec: "#a5365d",
        buttonDark: "#FBF1CD",
        buttonDarkSecondary: "#F8E79B",
        buttonDarkTerciary: "#F4DD69",
        buttonLight: "#4c4637",

        // TEXTO BOTONES
        buttonText: "#000000",
        buttonTextLight: "#f8e79b",
        buttonTextDark: "#4c4637",

        // BUSCADOR Y CATEGORÍAS
        buscador: "#FBF1CD",
        categoriaButton: "#C3C1B3",
        categoriaButtonSeleccionado: "#878374",
        categoriaText: "#4c4637",
        buttonArrow: "#d9d6cc",

        // FILTROS
        filtroSeleccionado: "#C3C1B3",
        filtroNoSeleccionado: "#878374",

        // VALORACIONES
        progressFilled: "#f4dd69",
        progressNotFilled: "#ecebe5",

        // BORDES
        border: "#FBF1CD",
        line: "#FBF1CD",
        
        
      }
    : { /***************************************/
        /************* TEMA CLARO *************/
        /***************************************/
        
        // COLORES DE FONDO
        backgroundHeader: "#eeca06",
        backgroundSubtitle: "#f8e79b",  // Justo lo que hay debajo del encabezado principal
        background: "#f8f7f3",
        backgroundFormulario: "#f8e79b",
        backgroundSecondary: "#ecebe5",
        backgroundMenu: "#f8f7f3",

        // TEXTO
        textHeader: "#4c4637",
        text: "#4c4637",
        textDark: "#4c4637",
        textLight: "#FBF1CD",
        textSecondary: "#6a6456",
        textTerciary: "#878374",
        textFormulario: "#4c4637",
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

        // BUSCADOR Y CATEGORÍAS
        buscador: "#f8e79b",
        categoriaButton: "#d9d6cc",
        categoriaButtonSeleccionado: "#b2ab99",
        categoriaText: "#4c4637",
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
