// NombreUsuario.js
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { API_URL } from '../../config';
import { useThemeColors } from '../componentes/Tema';

export default function NombreUsuario({ correo, estilo = {} }) {
   const [nombre, setNombre] = useState('');
   const [cargando, setCargando] = useState(true);
   const colors = useThemeColors();

   useEffect(() => {
      const obtenerNombre = async () => {
         try {
            const response = await fetch(`${API_URL}/usuario/${encodeURIComponent(correo)}`);
            if (!response.ok) {
               console.warn('No se pudo obtener el nombre, usando el correo como fallback');
               setNombre(correo);
               return;
            }
            const data = await response.json();
            setNombre(data.nombre || correo);
         } catch (error) {
            console.error('Error al obtener nombre del usuario:', error);
            setNombre(correo); // fallback al correo
         } finally {
            setCargando(false);
         }
      };

      if (correo) {
         obtenerNombre();
      }
   }, [correo]);

   if (cargando) return null;

   return (
      <Text style={[{ color: colors.textDarkSecondary }, estilo]}>
         {nombre}
      </Text>
   );
}
