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
        icon: "#ffffff",
        button: "#a54cac",
        buttonSec: "#a5365d",
        buttonText: "#ffffff",
      }
    : { // TEMA CLARO
        backgroundHeader: "#a2a2a2ff",
        background: "#ffffff",
        text: "#000000",
        icon: "#000000",
        button: "#007bff",
        buttonSec: "#28a745",
        buttonText: "#000000",
      };
};
