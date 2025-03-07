const LOCAL_BACKEND = "http://10.0.2.2:3000/api";  // Para desarrollo
const REMOTE_BACKEND = "https://backend-dcy8.onrender.com/api";  // Para producción

const LOCAL_GOOGLE_REDIRECT = "http://10.0.2.2:3000/auth/google/callback";
const REMOTE_GOOGLE_REDIRECT = "https://backend-dcy8.onrender.com/auth/google/callback";

// Detecta si está en modo desarrollo (local) o en producción (APK instalada)
const isDevelopment = __DEV__;

export const API_URL = isDevelopment ? LOCAL_BACKEND : REMOTE_BACKEND;
export const GOOGLE_REDIRECT_URI = isDevelopment ? LOCAL_GOOGLE_REDIRECT : REMOTE_GOOGLE_REDIRECT;
