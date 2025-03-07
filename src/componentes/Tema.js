/* Archivo para definir los colores predeterminados a utilizar por los diferentes modos
 * claro u oscuro de interfaz
 */
import { Button, useColorScheme } from "react-native";

// Función para obtener los colores según el tema
export const useThemeColors = () => {
  const theme = useColorScheme();
  
  return theme === "dark"
    ? { // TEMA OSCURO
        backgroundHeader: "#121212",
        background: "#2b2b2b",
        text: "#ffffff",
        textSecondary: "#a54cac",
        icon: "#ffffff",
        button: "#a54cac",
        buttonSec: "#a5365d",
        buttonText: "#ffffff",
        buttonOther: "#cacaca",
        buttonOtherText: "#a54cac",
        categoriaButton: "#be954e",
        categoriaButtonSec: "#d45682",
        border: "#ffffff",
        star: "#ffe300",
      }
    : { // TEMA CLARO
        backgroundHeader: "#be954e",
        background: "#ffffff",
        text: "#000000",
        textSecondary: "#333333",
        icon: "#000000",
        button: "#007bff",
        buttonSec: "#28a745",
        buttonText: "#000000",
        buttonOther: "#cacaca",
        buttonOtherText: "#007bff",
        categoriaButton: "#be954e",
        categoriaButtonSec: "#007bff",
        border: "#000000",
        star: "#ffe300",
      };
};
