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
        backgroundSubtitle: "#878374",  // Justo lo que hay debajo del encabezado principal
        background: "#4c4637",
        buttonArrow: "#fef9d2",
        // ahora
        backgroundFormulario: "#B2AB99",
        backgroundSecondary: "#A5A294",
        backgroundMenu: "#6a6456",
        backgroundMenuLibro: "#d9d6cc",
        //
        backgroundModal: "#fbf1cd",
        backgroundCheckbox: "#f8f7f3",
        backgroundForo: "#ecebe5",

        // TEXTO
        textHeader: "#4c4637",
        text: "#ecebe5",
        textDark: "#4c4637",
        textLight: "#FBF1CD",
        textSecondary: "#F8E79B",
        subtitleText: "#ecebe5",
        // ahora
        textTerciary: "#B2AB99",
        textFormulario: "#4c4637",
        //

        // ICONOS
        icon: "#FBF1CD",
        star: "#ffe300",
        iconBorder: "#f8e79b",

        // BOTONES
        button: "#4c4637",
        buttonSec: "#a5365d",
        buttonDark: "#FBF1CD",
        buttonDarkSecondary: "#F8E79B",
        buttonDarkTerciary: "#F4DD69",
        buttonLight: "#4c4637",
        buttonClose: "#FF5A5F",
        buttonDarkDisabled: "#ecebe5",

        // TEXTO BOTONES
        buttonText: "#f8f7f3",
        buttonTextLight: "#f8e79b",
        buttonTextDark: "#4c4637",
        buttonTextDarkDisabled: "#a5a294",

        // BUSCADOR Y CATEGORÍAS
        buscador: "#f8f7f3",
        categoriaButton: "#f8f7f3",
        categoriaButtonSeleccionado: "#c6c1b3",
        buttonArrow: "#d9d6cc",
        buttonArrowDesactivado: "#ECEBE5",
        iconArrow: "#4c4637",
        iconArrowDesactivado: "#c3c1b3",

        // FILTROS
        filtroSeleccionado: "#C3C1B3",
        filtroNoSeleccionado: "#878374",

        // VALORACIONES
        progressFilled: "#f4dd69",
        progressNotFilled: "#ecebe5",

        // BORDES
        border: "#4c4637",
        borderFormulario: "#ecebe5",
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
        backgroundMenuLibro: "#d9d6cc",
        backgroundModal: "#f8f7f3",
        backgroundForo: "#ecebe5",

        // TEXTO
        textHeader: "#4c4637",
        text: "#4c4637",
        textDark: "#4c4637",
        textLight: "#FBF1CD",
        textSecondary: "#6a6456",
        textTerciary: "#878374",
        textFormulario: "#4c4637",
        subtitleText: "#4c4637",

        // ICONOS
        icon: "#4c4637",
        star: "#eeca06",
        iconBorder: "#4c4637",

        // BOTONES
        button: "#4c4637",
        buttonSec: "#28a745",
        buttonDark: "#4c4637",
        buttonDarkSecondary: "#6a6456",
        buttonDarkTerciary: "#878374",
        buttonLight: "#f8e79b",
        buttonClose: "#FF5A5F",
        buttonDarkDisabled: "#c6c1b3",

        // TEXTO BOTONES
        buttonText: "#fbf1cd",
        buttonTextLight: "#4c4637",
        buttonTextDark: "#fbf1cd",
        buttonTextDarkDisabled: "#878374",

        // BUSCADOR Y CATEGORÍAS
        buscador: "#f8f7f3",
        categoriaButton: "#f8f7f3",
        categoriaButtonSeleccionado: "#c6c1b3",
        buttonArrow: "#d9d6cc",
        buttonArrowDesactivado: "#ECEBE5",
        iconArrow: "#4c4637",
        iconArrowDesactivado: "#c3c1b3",

        // FILTROS
        filtroSeleccionado: "#b2ab99",
        filtroNoSeleccionado: "#ecebe5",

        // VALORACIONES
        progressFilled: "#f4dd69",
        progressNotFilled: "#ecebe5",

        // BORDES
        border: "#4c4637",
        borderFormulario: "#4c4637",
        line: "#4c4637",
      };
};
